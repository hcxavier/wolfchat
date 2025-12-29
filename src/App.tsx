import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sidebar } from './components/organisms/Sidebar';
import { Header } from './components/organisms/Header';
import { ChatArea } from './components/organisms/ChatArea';
import { ChatInput } from './components/molecules/ChatInput';
import { SettingsModal } from './components/organisms/SettingsModal';

import { useChat } from './hooks/useChat';
import { useApiKeys, useModelSettings } from './hooks/useSettings';
import { sendMessageToApi, generateChatTitle } from './services/chatApi';

import type { Message, ChatSession } from './types/chat';
import { db } from './db/dexie';
import { migrateFromLocalStorage } from './utils/migration';

function App() {
  const { 
    messages, 
    setMessages, 
    chatHistory, 
    currentChatId, 
    createNewChat, 
    selectChat, 
    updateChatHistory,
    updateChatMessages,
    deleteChat,
    renameChat,
    clearAllChats
  } = useChat();

  const { openRouterApiKey, groqApiKey, geminiApiKey } = useApiKeys();
  const { selectedModel, selectedLanguage } = useModelSettings();
  
  const [prefilledText, setPrefilledText] = useState<string | undefined>(undefined);
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isImmersive, setIsImmersive] = useState(false);

  useEffect(() => {
    migrateFromLocalStorage();
    db.settings.get('isImmersive').then(s => {
      if(s) setIsImmersive(s.value === 'true');
    });
  }, []);


  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);



  const handleImmersiveChange = useCallback((value: boolean) => {
    setIsImmersive(value);
    db.settings.put({ key: 'isImmersive', value: String(value) });
  }, []);

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    createNewChat();
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [createNewChat]);

  const handleSelectChat = useCallback((chat: ChatSession) => {
    selectChat(chat);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [selectChat]);



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  const currentChatTitle = useMemo(() => {
    return chatHistory.find(c => c.id === currentChatId)?.title;
  }, [chatHistory, currentChatId]);
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
  
    let finalMessageText = text;
    if (quotedText) {
      finalMessageText = `> ${quotedText}\n\n${text}`;
      setQuotedText(null);
    }
  
    const userMessage: Message = { 
      id: Date.now(), 
      text: finalMessageText, 
      sender: 'user', 
      timestamp: new Date() 
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPrefilledText(undefined);
  
    const title = !currentChatId ? (text.slice(0, 30) + (text.length > 30 ? '...' : '')) : undefined;
    const activeChatId = await updateChatHistory(updatedMessages, title);
  
    const isGroq = selectedModel.startsWith('groq/');
    const isGemini = selectedModel.startsWith('gemini/');
    const currentApiKey = isGroq ? groqApiKey : (isGemini ? geminiApiKey : openRouterApiKey);
  
    if (!currentApiKey) {
      const errorMessage: Message = {
        id: Date.now() + 1, 
        text: `Por favor, configure sua chave API ${isGroq ? 'do Groq' : (isGemini ? 'do Gemini' : 'do OpenRouter')} nas configurações.`, 
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((previousState: Message[]) => [...previousState, errorMessage]);
      return;
    }
  
    const botThinkingMessageId = Date.now() + 1;
    setMessages((previousState: Message[]) => [
      ...previousState,
      {
        id: botThinkingMessageId, 
        text: "", 
        sender: "bot",
        timestamp: new Date()
      }
    ]);

    setIsGenerating(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
  
    try {
      let currentResponse = "";
      
      await sendMessageToApi(
        updatedMessages, 
        selectedModel, 
        currentApiKey, 
        isImmersive, 
        selectedLanguage,
        abortController.signal,
        (chunk) => {
          currentResponse += chunk;
          setMessages((previousState: Message[]) => {
            const newMessages = previousState.map((message: Message) =>
              message.id === botThinkingMessageId
                ? { ...message, text: currentResponse }
                : message
            );
            return newMessages;
          });
        }
      );
  
      setMessages((previousState: Message[]) => {
        const newMessages = previousState.map((message: Message) =>
          message.id === botThinkingMessageId
            ? { ...message, text: currentResponse }
            : message
        );
        if (activeChatId) {
            updateChatMessages(activeChatId, newMessages);
        }
        
        if (updatedMessages.length === 1 && groqApiKey && activeChatId) {
            generateChatTitle(updatedMessages[0].text, currentResponse, groqApiKey)
              .then(newTitle => {
                if (newTitle) {
                  renameChat(activeChatId, newTitle);
                }
              });
        }

        return newMessages;
      });

    } catch (error: any) {
      if (error.name === 'AbortError') {
        setMessages((previousState: Message[]) => {
          const newMessages = previousState.map((message: Message) =>
            message.id === botThinkingMessageId
              ? { ...message, text: message.text || "🛑 Resposta interrompida pelo usuário." }
              : message
          );
          return newMessages;
        });
      } else {
        setMessages((previousState: Message[]) => {
          const newMessages = previousState.map((message: Message) =>
            message.id === botThinkingMessageId
              ? { ...message, text: `Erro: ${error.message || 'Não foi possível obter uma resposta.'}` }
              : message
          );
          if (activeChatId) {
             updateChatMessages(activeChatId, newMessages);
          }
          return newMessages;
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [messages, currentChatId, updateChatHistory, updateChatMessages, selectedModel, groqApiKey, geminiApiKey, openRouterApiKey, isImmersive, selectedLanguage, setMessages, renameChat, quotedText]);

  return (
    <div className="flex h-full bg-surface-main overflow-hidden text-white font-sans selection:bg-brand-500/30">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        chatHistory={chatHistory} 
        currentChatId={currentChatId} 
        onNewChat={handleNewChat} 
        onSelectChat={handleSelectChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}

      />

      <div className="flex flex-1 overflow-hidden relative transition-all duration-500 ease-out">
        <div className={`flex flex-col h-full relative transition-all duration-500 ease-out w-full`}>
          <Header 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
            isImmersive={isImmersive}
            setIsImmersive={handleImmersiveChange}

          />

          <ChatArea 
            messages={messages} 
            onPromptClick={setPrefilledText}
            chatTitle={currentChatTitle}

            isImmersive={isImmersive}
            onQuote={setQuotedText}
          />

          <ChatInput 
            onSendMessage={handleSendMessage}
            prefilledValue={prefilledText}
            isGenerating={isGenerating}
            onStopGeneration={handleStopGeneration}
            quotedText={quotedText}
            onClearQuote={() => setQuotedText(null)}
          />
        </div>


      </div>

      <SettingsModal onClearAllChats={clearAllChats} />
    </div>
  );
}

export default App;