import { Send, Square, Quote, X } from 'lucide-react';
import { useState, useRef, useEffect, type KeyboardEvent, memo } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  prefilledValue?: string;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
  quotedText?: string | null;
  onClearQuote?: () => void;
}

export const ChatInput = memo(({ onSendMessage, prefilledValue, isGenerating, onStopGeneration, quotedText, onClearQuote }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const [bottomOffset, setBottomOffset] = useState(0);
  const [textareaHeight, setTextareaHeight] = useState(60);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shadowRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    
    if (!window.visualViewport) return;

    const handleVisualViewportResize = () => {
      const visualViewport = window.visualViewport;
      if (!visualViewport) return;

      const windowHeight = window.innerHeight;
      const viewportHeight = visualViewport.height;
      const offsetTop = visualViewport.offsetTop;

      const diff = windowHeight - viewportHeight - offsetTop;
      
      if (diff > 20) {
        setBottomOffset(diff);
      } else {
        setBottomOffset(0);
      }
    };

    handleVisualViewportResize();

    window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    window.visualViewport.addEventListener('scroll', handleVisualViewportResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
      window.visualViewport?.removeEventListener('scroll', handleVisualViewportResize);
    };
  }, []);

  useEffect(() => {
    if (prefilledValue) {
      setValue(prefilledValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [prefilledValue]);

  useEffect(() => {
    if (shadowRef.current) {
      const contentHeight = Math.min(Math.max(shadowRef.current.scrollHeight, 60), 200);
      
      if (isFocused) {
        setTextareaHeight(contentHeight);
      } else {
        setTextareaHeight(60);
      }
    }
  }, [value, isFocused]);

  useEffect(() => {
    if (quotedText && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [quotedText]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (document.activeElement === textareaRef.current) {
          textareaRef.current?.blur();
        } else {
          textareaRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);



  const handleSend = () => {
    if (!value.trim()) return;
    
    let messageToSend = value;
    
    onSendMessage(messageToSend);
    setValue('');
 
    
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="fixed md:absolute bottom-0 left-0 right-0 pb-[max(4px,env(safe-area-inset-bottom))] md:pb-6 pt-10 px-4 z-20 bg-gradient-to-t from-surface-main via-surface-main to-transparent transition-[bottom] duration-75"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="max-w-3xl mx-auto">
        {quotedText && (
          <div className="mb-2 mx-2 p-3 bg-surface-card/80 backdrop-blur-md border-l-4 border-brand-500 rounded-r-lg shadow-lg flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
             <Quote className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-brand-500 mb-0.5">Citando trecho no context</p>
               <p className="text-primary/70 text-sm line-clamp-2 italic">{quotedText}</p>
             </div>
             <button 
               onClick={onClearQuote}
               className="p-1 hover:bg-primary/5 rounded-full text-primary/40 hover:text-primary transition-colors"
             >
               <X size={14} />
             </button>
          </div>
        )}
        <div className="relative group">
          <motion.textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Envie uma mensagem..."
            initial={{ height: 60 }}
            animate={{ height: textareaHeight }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="peer w-full bg-surface-input/50 border border-transparent hover:bg-surface-input hover:border-primary/20 focus:bg-surface-input focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-2xl pl-5 pr-14 md:pr-28 py-5 text-primary placeholder-transparent text-sm md:text-base resize-none outline-none shadow-xl overflow-y-auto no-scrollbar min-h-[60px] max-h-[200px]"
            rows={1}
            disabled={isGenerating}
          />

          <textarea
            ref={shadowRef}
            value={value}
            readOnly
            aria-hidden
            className="absolute -z-50 invisible w-full bg-transparent border border-transparent rounded-2xl pl-5 pr-14 md:pr-28 py-5 text-primary text-sm md:text-base resize-none outline-none min-h-[60px] max-h-[200px] overflow-hidden"
            rows={1}
          />
          <label
            htmlFor="chat-input"
            className="absolute left-4 top-5 px-1 text-sm md:text-base text-primary/40 transition-opacity duration-200 opacity-0 peer-placeholder-shown:opacity-100 pointer-events-none"
          >
            Envie uma mensagem...
          </label>
          <div className="absolute right-3 bottom-5 flex items-center gap-2">

            
            {isGenerating ? (
              <button
                aria-label="Stop Generation"
                onClick={onStopGeneration}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 animate-pulse"
                title="Parar resposta"
              >
                <Square size={20} fill="currentColor" />
              </button>
            ) : (
              <button
                aria-label="Send"
                onClick={handleSend}
                disabled={!value.trim()}
                className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-brand-500/20"
              >
                <Send size={20} fill="currentColor" />
              </button>
            )}
          </div>

        </div>
        <p className="text-[10px] md:text-xs text-primary/40 text-center mt-1 font-medium max-w-[90%] mx-auto leading-tight">
          {"O WolfChat pode gerar informações incorretas."}
        </p>
      </div>
    </div>
  );
});