import { Send, Square } from 'lucide-react';
import { useState, useRef, useEffect, type KeyboardEvent, memo } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  prefilledValue?: string;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
}





export const ChatInput = memo(({ onSendMessage, prefilledValue, isGenerating, onStopGeneration }: ChatInputProps) => {
  const [value, setValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefilledValue) {
      setValue(prefilledValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustHeight(textareaRef.current);
      }
    }
  }, [prefilledValue]);

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

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  };

  const handleSend = () => {
    if (!value.trim()) return;
    
    let messageToSend = value;
    
    onSendMessage(messageToSend);
    setValue('');
 
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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
    <div className="fixed md:absolute bottom-0 left-0 right-0 pb-1 md:pb-6 pt-10 px-4 z-20 bg-gradient-to-t from-surface-main via-surface-main to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight(e.target);
            }}
            onKeyDown={handleKeyDown}
            placeholder={"Envie uma mensagem..."}
            className="w-full bg-surface-input/50 border border-transparent hover:bg-surface-input hover:border-white/20 focus:bg-surface-input focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-2xl pl-4 pr-12 md:pr-36 py-5 text-white placeholder-white/40 text-sm md:text-base resize-none outline-none shadow-xl transition-all duration-200 overflow-hidden min-h-[60px] max-h-[200px]"
            rows={1}
            disabled={isGenerating}
          />
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
        <p className="text-[10px] md:text-xs text-white/40 text-center mt-1 font-medium max-w-[90%] mx-auto leading-tight">
          {"O WolfChat pode gerar informações incorretas."}
        </p>
      </div>
    </div>
  );
});