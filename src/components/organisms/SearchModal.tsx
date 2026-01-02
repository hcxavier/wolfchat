import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageSquare, CornerDownLeft } from 'lucide-react';
import type { ChatSession } from '../../types/chat';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatSession[];
  onSelectChat: (chat: ChatSession) => void;
}

export const SearchModal = ({ isOpen, onClose, chatHistory, onSelectChat }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return chatHistory.slice(0, 5);

    const lowerQuery = query.toLowerCase();
    return chatHistory.filter(chat => 
      chat.title.toLowerCase().includes(lowerQuery) || 
      chat.messages.some(m => m.text.toLowerCase().includes(lowerQuery))
    ).slice(0, 20);
  }, [chatHistory, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          onSelectChat(filteredResults[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onSelectChat, onClose]);

  useEffect(() => {
    const activeItem = listRef.current?.children[selectedIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none w-full">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-surface-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative z-10 flex flex-col max-h-[70vh]"
            >
            <div className="flex items-center px-4 py-4 border-b border-white/5 bg-white/5 relative">
              <Search className="w-5 h-5 text-primary/50 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar chats..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-primary placeholder:text-primary/30 h-8"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-primary/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-[300px]"
            >
              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-primary/30">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p>Nenhum resultado encontrado</p>
                </div>
              ) : (
                filteredResults.map((chat, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200
                        ${isSelected ? 'bg-brand-500/10' : 'hover:bg-white/5'}
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${isSelected ? 'bg-brand-500 text-white' : 'bg-surface-hover text-primary/60'}
                      `}>
                        <MessageSquare size={20} />
                      </div>
                      
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className={`font-medium truncate transition-colors ${isSelected ? 'text-brand-500' : 'text-primary'}`}>
                          {chat.title}
                        </div>
                        <div className="text-xs text-primary/40 truncate flex items-center gap-2">
                          <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          layoutId="enterCheck"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-brand-500"
                        >
                          <CornerDownLeft size={18} />
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-primary/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-sans">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-sans">↓</kbd>
                  navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-sans">↵</kbd>
                  selecionar
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-sans">esc</kbd>
                fechar
              </span>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
