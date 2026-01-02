import { Send, Square, Quote, X, Terminal } from 'lucide-react';
import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';

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


  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prompts = useLiveQuery(
    () => db.dynamicPrompts.toArray(),
    []
  );

  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    if (!suggestionQuery) return prompts.slice(0, 5); 
    
    return prompts
        .filter(p => p.command.toLowerCase().includes(suggestionQuery.toLowerCase()))
        .slice(0, 5);
  }, [prompts, suggestionQuery]);

  const inputRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

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

  const getCaretIndex = (element: HTMLElement) => {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount !== 0) {
        const range = window.getSelection()?.getRangeAt(0);
        const preCaretRange = range?.cloneRange();
        preCaretRange?.selectNodeContents(element);
        preCaretRange?.setEnd(range!.endContainer, range!.endOffset);
        position = preCaretRange?.toString().length || 0;
      }
    }
    return position;
  };

  const setCaretIndex = (element: HTMLElement, index: number) => {
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(element, 0);
    range.collapse(true);
    const nodeStack: Node[] = [element];
    let node: Node | undefined;
    let found = false;

    while (!found && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex + (node.nodeValue?.length || 0);
        if (index <= nextCharIndex) {
          range.setStart(node, index - charIndex);
          range.collapse(true);
          found = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const scrollToCaret = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const inputRect = element.getBoundingClientRect();

    if (rect.bottom > inputRect.bottom) {
        element.scrollTop += (rect.bottom - inputRect.bottom);
    }
     
    else if (rect.top < inputRect.top) {
        element.scrollTop -= (inputRect.top - rect.top);
    }
  };

  const handleDivInput = (e: React.FormEvent<HTMLDivElement>) => {
      const text = e.currentTarget.innerText;

      setValue(text);
      
      if (isComposing.current) return;

      const lastWordRegex = /(?:^|\s)\/([a-zA-Z0-9-_]*)$/;
      const match = text.match(lastWordRegex);

      if (match) {
          setShowSuggestions(true);
          setSuggestionQuery(match[1]);
          setSelectedIndex(0);
      } else {
          setShowSuggestions(false);
      }

      const html = text.replace(
        /(\/[\w-]+)(?=\s|$)/g, 
        '<span class="text-brand-500 font-bold">$1</span>'
      ).replace(/\n/g, '<br>');  

      const currentCaret = getCaretIndex(e.currentTarget);

       if (e.currentTarget.innerHTML !== html) {

          if (text.match(/(\/[\w-]+)/)) {
              e.currentTarget.innerHTML = html;
              setCaretIndex(e.currentTarget, currentCaret);
          }
       }

       scrollToCaret(e.currentTarget);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  useEffect(() => {
    if (prefilledValue && inputRef.current) {
        inputRef.current.innerText = prefilledValue;
        setValue(prefilledValue);
        inputRef.current.focus();
    }
  }, [prefilledValue]);

   useEffect(() => {
    if (quotedText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quotedText]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (document.activeElement === inputRef.current) {
          inputRef.current?.blur();
        } else {
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const applySuggestion = (command: string) => {
       
      const lastWordRegex = /(?:^|\s)\/([a-zA-Z0-9-_]*)$/;
      const match = value.match(lastWordRegex);
      
      if (match) {
          const prefix = value.substring(0, match.index);
          const newValue = `${prefix}${prefix && !prefix.endsWith(' ') ? ' ' : ''}/${command} `;
          setValue(newValue);
          if (inputRef.current) {
              inputRef.current.innerText = newValue;
              inputRef.current.innerHTML = newValue.replace(/(\/[\w-]+)(?=\s|$)/g, '<span class="text-brand-500 font-bold">$1</span>');

              const range = document.createRange();
              range.selectNodeContents(inputRef.current);
              range.collapse(false);
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(range);
          }
          setShowSuggestions(false);
          inputRef.current?.focus();
      }
  };
  
    const handleSend = () => {
    if (!value.trim()) return;
    onSendMessage(value);
    setValue('');
    if (inputRef.current) {
        inputRef.current.innerHTML = '';
        inputRef.current.blur();
    }
    setShowSuggestions(false);
  };
  
  const handleDivKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (showSuggestions && filteredPrompts.length > 0) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredPrompts.length) % filteredPrompts.length);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredPrompts.length);
            return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            applySuggestion(filteredPrompts[selectedIndex].command);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setShowSuggestions(false);
            return;
        }
    }
    
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
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence>
            {showSuggestions && filteredPrompts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-full md:w-64 bg-surface-card border border-primary/10 rounded-xl shadow-xl overflow-hidden z-50 px-1 py-1"
                >
                    <div className="px-3 py-2 text-xs font-semibold text-primary/40 uppercase tracking-wider">
                        Prompts Dinâmicos
                    </div>
                    {filteredPrompts.map((prompt, index) => (
                        <button
                            key={prompt.id}
                            onClick={() => applySuggestion(prompt.command)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                                index === selectedIndex 
                                    ? 'bg-brand-500 text-white' 
                                    : 'text-primary hover:bg-white/5'
                            }`}
                        >
                            <Terminal size={14} className={index === selectedIndex ? "text-white" : "text-brand-500"} />
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">/{prompt.command}</div>
                                <div className={`truncate text-xs ${index === selectedIndex ? "text-white/70" : "text-primary/50"}`}>
                                    {prompt.name}
                                </div>
                            </div>
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>

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
          <div
            ref={inputRef}
            contentEditable
            onInput={handleDivInput}
            onKeyDown={handleDivKeyDown}
            onPaste={handlePaste}
            onCompositionStart={() => { isComposing.current = true; }}
            onCompositionEnd={() => { isComposing.current = false; }}
            onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
            }}
            data-placeholder="Envie uma mensagem..."
            className="w-full bg-surface-input/50 border border-transparent hover:bg-surface-input hover:border-primary/20 focus:bg-surface-input focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-2xl pl-5 pr-14 md:pr-28 py-5 text-primary text-sm md:text-base outline-none shadow-xl overflow-y-auto no-scrollbar min-h-[60px] max-h-[200px] empty:before:text-primary/40 empty:before:content-[attr(data-placeholder)] cursor-text"
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
        <p className="text-[10px] md:text-xs text-primary/40 text-center mt-1 font-medium max-w-[90%] mx-auto leading-tight">
          {"O WolfChat pode gerar informações incorretas."}
        </p>
      </div>
    </div>
  );
});