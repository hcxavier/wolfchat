import { Search, MessageSquare, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { ChatSession } from '../../types/chat';

interface ChatSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatSession[];
  onSelectChat: (chat: ChatSession) => void;
}

export const ChatSearchModal = ({ isOpen, onClose, chatHistory, onSelectChat }: ChatSearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    return chatHistory.filter(chat => {
      const titleMatch = chat.title.toLowerCase().includes(lowerQuery);
      const messageMatch = chat.messages.some(m => m.text.toLowerCase().includes(lowerQuery));
      return titleMatch || messageMatch;
    }).slice(0, 5);
  }, [query, chatHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[#0d0d15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/5">
          <Search className="text-white/40" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chats..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          <div className="flex gap-1">
             <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/40 font-mono">ESC</kbd>
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                     onSelectChat(chat);
                     onClose();
                  }}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 group"
                >
                  <MessageSquare size={16} className="text-white/40 group-hover:text-brand-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-white/40 truncate">
                      {chat.messages.find(m => m.text.toLowerCase().includes(query.toLowerCase()))?.text || "Match in title"}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-white/30 text-sm">
              No results found
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-white/30 text-sm">
              Type to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
