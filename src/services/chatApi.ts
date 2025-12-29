import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types/chat';

export const sendMessageToApi = async (
  messages: Message[],
  selectedModel: string,
  apiKey: string,
  isImmersive: boolean = false,
  selectedLanguage: string = 'default',
  signal?: AbortSignal,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const isGroq = selectedModel.startsWith('groq/');
  const isGemini = selectedModel.startsWith('gemini/');
  let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  let modelId = selectedModel;
  
  if (selectedModel.startsWith('openrouter/')) {
    modelId = selectedModel.replace('openrouter/', '');
  }

  if (isGroq) {
    apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    modelId = selectedModel.replace('groq/', '');
  }

  if (isGemini) {
    modelId = selectedModel.replace('gemini/', '');
  }

  const immersiveSystemPrompt = `
You are in **Immersive Mode**. Your goal is to provide highly structured, visually rich, and easy-to-understand responses.
Use the following XML-like tags to structure your content. Use markdown when convenient.
CRITICAL RULES:
1. write tags DIRECTLY in the text. Do NOT wrap them in markdown code blocks.
2. Do NOT nest Block Tags (obs, title, subtitle, warning, quote, terminal, banner) inside each other.
3. NEVER forget to close tags.
4. Do NOT use tags that are not listed above.
5. Only use the tags when necessary, don't force the use.
6. A tag technical-term should only be used for keywords of up to 20 characters.
7. Never use quotes inside the quote tag.
8. Do not use the terminal and technical-term tags in subjects that are not programming.
9. Use the quote tag only if necessary.
10. A highlight tag should only be used for phrases of up to 30 characters.
11. You don't need to use all the tags.

AVAILABLE TAGS:
- <technical-term> text </technical-term> : Use for technical terms, file paths, or specific technologies. (Cyan monospace)
- <highlight> text </highlight> : Use to highlight important keywords. (Yellow highlight)
- <obs> text </obs> : Use for observations, notes, or side comments. (Box with info icon)
- <title> text </title> : Use for main section headers. (Large gradient text)
- <subtitle> text </subtitle> : Use for subsection headers. (Medium text)
- <warning> text </warning> : Use for warnings, alerts, or critical info. (Red box with icon)
- <quote> text </quote> : Use for quotes or emphasized statements.
- <terminal> text </terminal> : Use for terminal commands. (Dark terminal window). IMPORTANT: This tag has a block appearance and is not inline content.
- <banner> text </banner> : Use for a large, decorative title at the start of the response.

FOR CODE BLOCKS:
- Use standard markdown triple backticks with language specification. Example:
\`\`\`python
def hello():
    print("Hello World")
\`\`\`
This ensures correct syntax highlighting and indentation preservation.
`;

  let baseSystemPrompt = `You are WolfChat, a helpful AI assistant.`;
  
  if (selectedLanguage !== 'default') {
    baseSystemPrompt += ` Please respond in ${selectedLanguage}.`;
  }

  const systemMessageContent = isImmersive ? baseSystemPrompt + immersiveSystemPrompt : baseSystemPrompt;

  if (isGemini) {
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        timeout: 300000
      }
    });
    
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: messages.map(message => ({
          role: message.sender === 'user' ? 'user' : 'model',
          parts: [{ text: message.text }]
        })),
        config: {
          systemInstruction: {
            parts: [{ text: systemMessageContent }]
          }
        }
      });

      const rawContent = response.text || '';
      
      if (onChunk) onChunk(rawContent);
      
      return rawContent;

    } catch (error: any) {
       if (error.message && (error.message.includes('429') || error.status === 429)) {
          throw new Error(`Limite de requisições excedido (Erro 429). O modelo ${modelId} possui limites restritos de uso. Aguarde alguns instantes e tente novamente.`);
       }
       if (error.message && error.message.includes('overloaded')) {
          throw new Error(`O modelo está sobrecarregado no momento. Tente novamente em alguns segundos. (Detalhes: ${error.message})`);
       }
       throw error;
    }
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(isGroq ? {} : {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'WolfChat',
      }),
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: systemMessageContent
        },
        ...messages.map(message => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.text,
        }))
      ],
      stream: true
    }),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line === 'data: [DONE]') return fullContent;
          
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices[0]?.delta;
              const content = delta?.content || '';
              const reasoning = delta?.reasoning_content || delta?.reasoning || '';
              
              if (content || reasoning) {
                const textChunk = (reasoning ? `\n> *Thinking: ${reasoning}*\n` : '') + content;
                fullContent += textChunk;
                if (onChunk) onChunk(textChunk);
              }
            } catch (e) {
              console.error('Error parsing SSE message', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream', error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }

  return fullContent;
};

export const generateChatTitle = async (
  userMessage: string,
  botMessage: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) return '';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a title generator. Generate a concise title (max 50 chars) for the chat based on the conversation.'
          },
          {
            role: 'user',
            content: `User: ${userMessage.slice(0, 200)}\nAssistant: ${botMessage.slice(0, 200)}\n\nGenerate a title for this chat. The title must be at most 50 characters long. Do not use quotes. Return ONLY the title.`
          }
        ],
        stream: false
      }),
    });

    if (!response.ok) return '';

    const data = await response.json();
    let title = data.choices[0]?.message?.content?.trim() || '';
    return title.replace(/^["']|["']$/g, '').slice(0, 50);
  } catch (error) {
    console.error('Failed to generate title', error);
    return '';
  }
};