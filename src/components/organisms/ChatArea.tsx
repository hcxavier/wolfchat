import { User, Sparkles, Code, Check, Copy, Lightbulb, ArrowUp, ArrowDown, MessageSquarePlus, RotateCcw } from 'lucide-react';
import { WolfLogo } from '../atoms/WolfLogo';
import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import type { Message } from '../../types/chat';
import { TypingIndicator } from '../atoms/TypingIndicator';
import { Button } from '../atoms/Buttons';

import { ImmersiveMessage } from '../molecules/ImmersiveMessage';
import Logger from '../../utils/logger';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '../atoms/CodeBlock';
import { SophisticatedHr } from '../atoms/SophisticatedHr';
import { ThinkingBubble } from '../atoms/ThinkingBubble';
import { MotionReveal } from '../atoms/MotionReveal';

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const AnimatedMarkdown = memo(({ text, shouldAnimate, onReveal }: { text: string; shouldAnimate: boolean; onReveal?: (el: HTMLElement) => void }) => {
  const components = useMemo(() => ({
    hr: () => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal}>
        <SophisticatedHr />
      </MotionReveal>
    ),
    p: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-4">
        <p className="whitespace-pre-wrap">{children}</p>
      </MotionReveal>
    ),
    h1: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-4">
        <h1 className="text-2xl font-bold">{children}</h1>
      </MotionReveal>
    ),
    h2: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-3">
        <h2 className="text-xl font-bold">{children}</h2>
      </MotionReveal>
    ),
    h3: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-2">
        <h3 className="text-lg font-bold">{children}</h3>
      </MotionReveal>
    ),
    ul: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-4">
        <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">{children}</ul>
      </MotionReveal>
    ),
    ol: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="mb-4">
        <ol className="list-decimal pl-6 space-y-2 marker:text-brand-500 marker:font-bold">{children}</ol>
      </MotionReveal>
    ),
    li: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal}>
        <li className="pl-1 leading-relaxed text-primary/90">{children}</li>
      </MotionReveal>
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal}>
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, '')}
            />
          </MotionReveal>
        );
      }
      return (
        <code className={`${className} bg-primary/10 rounded px-1 py-0.5 text-xs md:text-sm font-mono text-brand-600 dark:text-brand-300`} {...props}>
          {children}
        </code>
      );
    },
    table: ({ children }: any) => (
      <MotionReveal shouldAnimate={shouldAnimate} delayIndex={0} onReveal={onReveal} className="w-full overflow-x-auto my-4 rounded-lg border border-primary/10">
          <table className="w-full border-collapse bg-primary/5">
              {children}
          </table>
      </MotionReveal>
    ),
    thead: ({ children }: any) => <thead className="bg-primary/5">{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="p-3 text-left text-xs md:text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">{children}</th>,
    td: ({ children }: any) => <td className="p-3 text-sm text-primary/80 border-l border-primary/5 first:border-0">{children}</td>,
  }), [shouldAnimate, onReveal]);

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]} 
      rehypePlugins={[rehypeRaw]} 
      components={components}
    >
      {text}
    </ReactMarkdown>
  );
});

interface ChatAreaProps {
  messages: Message[];
  onPromptClick: (text: string) => void;
  chatTitle?: string;
  isImmersive: boolean;
  onQuote: (text: string) => void;
  onRegenerate: (id: number) => void;
}

const stripImmersiveTags = (text: string): string => {
  const immersiveTags = ['technical-term', 'highlight', 'obs', 'text', 'title', 'subtitle', 'warning', 'quote', 'terminal', 'banner', 'mark'];
  let cleanText = text;
  for (const tag of immersiveTags) {
    const regex = new RegExp(`<${tag}[^>]*?>([\\s\\S]*?)</${tag}>`, 'g');
    cleanText = cleanText.replace(regex, '$1');
  }
  return cleanText;
};

const processMessageContent = (text: string): string => {
  return text;
};

interface MessageItemProps {
  message: Message;
  isHovered: boolean;
  isCopied: boolean;
  onHover: (id: number | null) => void;
  onCopy: (text: string, id: number) => void;
  onRegenerate: (id: number) => void;

  isImmersive: boolean;
  shouldAnimate: boolean;
  onReveal?: (el: HTMLElement) => void;
}

const MessageItem = memo(({ message, isHovered, isCopied, onHover, onCopy, onRegenerate, isImmersive, shouldAnimate, onReveal }: MessageItemProps) => {
  const processedText = useMemo(() => {
    if (message.sender === 'bot') {
       return message.text ? processMessageContent(message.text) : message.text;
    }
    return message.originalUserInput || message.text;
  }, [message.text, message.sender, message.originalUserInput]);

  const handleMouseEnter = useCallback(() => onHover(message.id), [message.id, onHover]);
  const handleMouseLeave = useCallback(() => onHover(null), [onHover]);
  const handleCopy = useCallback(() => onCopy(message.text, message.id), [message.text, message.id, onCopy]);
  const handleRegenerate = useCallback(() => onRegenerate(message.id), [message.id, onRegenerate]);

  const isBot = message.sender === 'bot';

  if (!isBot) {
    return (
      <div 
        className="flex gap-3 md:gap-6 flex-row-reverse max-w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg bg-surface-card text-primary/80">
          <User size={20} className="w-5 h-5 md:w-auto md:h-auto" />
        </div>

        <div className="flex flex-col items-end max-w-[85%] ml-auto gap-2">
           <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="outline" 
                className="text-xs h-7 px-2.5 rounded-full border-primary/20 text-primary/60 hover:text-brand-500 hover:border-brand-500 hover:bg-transparent"
                leftIcon={isCopied ? <Check size={12} /> : <Copy size={12} />}
                onClick={handleCopy}
              >
                {isCopied ? 'Copiado' : 'Copiar'}
              </Button>
           </div>
           
           <div className="bg-surface-card p-4 md:p-6 rounded-2xl border border-primary/10 shadow-xl w-full">
            <div className="prose prose-invert max-w-none text-primary/90 leading-relaxed text-base break-words w-full overflow-hidden min-w-0">
               {processedText.split('\n').map((line, i) => {
                 if (line.startsWith('> ')) {
                   return (
                     <blockquote key={i} className="border-l-4 border-brand-500 pl-4 py-1 my-2 bg-primary/5 rounded-r italic text-primary/70">
                       {line.substring(2)}
                     </blockquote>
                   );
                 }

                 const commandMatch = line.match(/^(\/[\w-]+)(\s.*)?$/);
                 if (commandMatch) {
                    return (
                        <p key={i} className="whitespace-pre-wrap mb-2 last:mb-0">
                            <span className="text-brand-500 font-bold">{commandMatch[1]}</span>
                            {commandMatch[2]}
                        </p>
                    );
                 }

                 return <p key={i} className="whitespace-pre-wrap mb-2 last:mb-0">{line}</p>;
               })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col md:flex-row gap-2 md:gap-3 items-start max-w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <div className="w-full h-full p-1.5"><WolfLogo className="w-full h-full text-white" /></div>
        </div>
        <div className="text-sm font-bold text-primary tracking-wide md:hidden">WolfChat</div>
      </div>

      <div className="flex-1 px-2 md:px-0 min-w-0 w-full max-w-full">
        
        {message.reasoning && <ThinkingBubble reasoning={message.reasoning} />}

        <div className="prose prose-invert max-w-none text-primary/90 leading-relaxed text-base break-words w-full min-w-0">
          {!message.text && !message.reasoning ? (
            <TypingIndicator />
          ) : (
            <>
              {isImmersive ? (
                <ImmersiveMessage content={message.text || ''} shouldAnimate={shouldAnimate} onReveal={onReveal} />
              ) : (
                <AnimatedMarkdown text={processedText} shouldAnimate={shouldAnimate} onReveal={onReveal} />
              )}

            </>
          )}
        </div>

        {message.text && (
          <div className="mt-4 flex items-center gap-3">
            <Button 
              variant="outline" 
              className="text-xs h-8 px-3 rounded-full border-primary/20 text-primary/60 hover:text-brand-500 hover:border-brand-500 hover:bg-transparent"
              leftIcon={isCopied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
            >
              {isCopied ? 'Copiado' : 'Copiar'}
            </Button>
            <Button
              variant="outline"
              className="text-xs h-8 px-3 rounded-full border-primary/20 text-primary/60 hover:text-brand-500 hover:border-brand-500 hover:bg-transparent"
              leftIcon={<RotateCcw size={14} />}
              onClick={handleRegenerate}
            >
              Gerar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export const ChatArea = memo(({ messages, onPromptClick, chatTitle, isImmersive, onQuote, onRegenerate }: ChatAreaProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectionMenu, setSelectionMenu] = useState<{ x: number, y: number, text: string } | null>(null);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<any>(null);
  
  const [initialMessageIds] = useState(() => new Set(messages.map(m => m.id)));

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const threshold = 150;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (isUserScrollingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, isNearBottom, scrollToBottom]);

  const copyToClipboard = useCallback(async (text: string, id: number) => {
    try {
      const cleanText = stripImmersiveTags(text);
      await navigator.clipboard.writeText(cleanText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      Logger.error('Failed to copy text: ', error);
    }
  }, []);

  const handleManualScrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    isUserScrollingRef.current = false;
  }, []);

  const handleManualScrollToTop = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);

    isUserScrollingRef.current = !isNearBottom();
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollRange = scrollHeight - clientHeight;
    
    if (scrollRange > 0) {
      const scrollRatio = scrollTop / scrollRange;
      setShowScrollTop(scrollRatio > 0.5);
      setShowScrollBottom(scrollRatio <= 0.5 && scrollRange > 100); 
    } else {
      setShowScrollTop(false);
      setShowScrollBottom(false);
    }
  }, [isNearBottom]);

  const handleHover = useCallback((id: number | null) => {
    setHoveredMessageId(id);
  }, []);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) { 
        
        return; 
      }

      const text = selection.toString().trim();
      if (!text) {
         setSelectionMenu(null);
         return;
      }

      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      if(rects.length === 0) return;
      
      const rect = rects[0]; 

      setSelectionMenu({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        text
      });
    };

    const onMouseUp = () => {
        
        setTimeout(() => {
             const selection = window.getSelection();
             if (!selection || selection.isCollapsed) {
                 setSelectionMenu(null);
                 return;
             }
             
             const text = selection.toString().trim();
             if (text.length > 0) {
                 handleSelection();
             } else {
                 setSelectionMenu(null);
             }
        }, 10);
    }

    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const handleQuoteClick = useCallback(() => {
    if (selectionMenu) {
      onQuote(selectionMenu.text);
      setSelectionMenu(null);
      window.getSelection()?.removeAllRanges();
    }
  }, [selectionMenu, onQuote]);

  return (
    <div className="flex-1 relative w-full h-full max-w-full">
      
      {selectionMenu && (
        <div 
            className="fixed z-[100] transform -translate-x-1/2 -translate-y-full"
            style={{ 
                left: selectionMenu.x, 
                top: selectionMenu.y - 10 
            }}
        >
            <button
                onClick={handleQuoteClick}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full shadow-2xl border border-primary/10 backdrop-blur-md animate-in fade-in zoom-in duration-200"
            >
                <MessageSquarePlus size={16} />
                <span className="text-sm font-medium whitespace-nowrap">Perguntar ao WolfChat</span>
            </button>
            <div className="w-3 h-3 bg-brand-600 absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}

      {chatTitle && (
        <div className="absolute top-20 md:top-24 left-0 right-0 z-30 flex justify-center pointer-events-none">
           <div className="bg-surface-main/60 backdrop-blur-xl border border-primary/10 px-4 py-1.5 rounded-full shadow-2xl transition-all duration-300">
              <h2 className="text-[10px] font-bold text-primary/50 tracking-[0.2em] uppercase max-w-[200px] truncate">{chatTitle}</h2>
           </div>
        </div>
      )}

      <div className={`absolute right-4 md:right-8 bottom-32 md:bottom-36 z-50 flex flex-col gap-3 pointer-events-none transition-opacity duration-300 ${isScrolling ? 'opacity-100' : 'opacity-0'}`}>
        {showScrollTop && (
          <button
            onClick={handleManualScrollToTop}
            className="pointer-events-auto p-3 rounded-full bg-surface-card/80 backdrop-blur-md border border-primary/10 text-primary/70 hover:text-brand-500 hover:border-brand-500 hover:bg-surface-hover shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Rolar para o topo"
          >
            <ArrowUp size={20} />
          </button>
        )}
        {showScrollBottom && (
          <button
            onClick={handleManualScrollToBottom}
            className="pointer-events-auto p-3 rounded-full bg-surface-card/80 backdrop-blur-md border border-primary/10 text-primary/70 hover:text-brand-500 hover:border-brand-500 hover:bg-surface-hover shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Rolar para o fim"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className={`relative w-full h-full min-h-0 scrollbar-thin scrollbar-thumb-surface-card scrollbar-track-transparent flex flex-col overflow-x-hidden ${messages.length === 0 ? 'overflow-hidden p-4 items-center justify-center' : 'overflow-y-auto pt-24 md:pt-32 pb-36 md:pb-40 px-3 md:px-4'}`}
        onScroll={handleScroll}
      >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center min-h-0 w-full max-w-4xl mx-auto my-auto pb-20">
             <div className="relative mb-4 md:mb-8">
                 <div className="absolute inset-[-20px] bg-brand-500/20 blur-xl rounded-full" />
                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/30 relative overflow-hidden p-4">
                    <WolfLogo className="w-full h-full text-white" />
                 </div>
             </div>
             
             <h1 className="text-3xl md:text-4xl text-primary mb-2 md:mb-4 font-black tracking-tight">
                WolfChat
             </h1>
             <p className="text-primary/60 max-w-lg mb-6 md:mb-12 text-base md:text-xl leading-relaxed">
                Seu assistente de IA avançado. <br />
                <span className="text-brand-500 font-semibold">O que vamos criar juntos?</span>
             </p>

             <div className="grid grid-cols-2 lg:flex lg:flex-wrap justify-center gap-2 md:gap-4 max-w-4xl w-full">
                {[ 
                  { icon: Sparkles, text: "Explique computação quântica" },
                  { icon: Code, text: "Script Python para automação" },
                  { icon: User, text: "Simule uma entrevista" },
                  { icon: Lightbulb, text: "Ideias para um app inovador" }
                ].map((item, index) => (
                  <button 
                    key={index}
                    onClick={() => onPromptClick(item.text)}
                    className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0 text-center p-3 md:p-6 rounded-2xl bg-surface-card border border-primary/10 text-primary/90 hover:border-brand-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  >
                    <item.icon size={20} className="text-brand-500 md:mb-1 w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs md:text-base font-medium leading-snug truncate w-full">{item.text}</span>
                  </button>
                ))}
             </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto w-full">
          {messages.map((message) => (
             <MessageItem
                key={message.id}
                message={message}
                isHovered={hoveredMessageId === message.id}
                isCopied={copiedId === message.id}
                onHover={handleHover}
                onCopy={copyToClipboard}

                isImmersive={isImmersive}
                shouldAnimate={!initialMessageIds.has(message.id) && message.sender === 'bot'}
                onReveal={undefined}
                onRegenerate={onRegenerate}
              />
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
      </div>
    </div>
  );
});