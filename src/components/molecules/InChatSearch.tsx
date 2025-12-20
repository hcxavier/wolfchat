import { X, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface InChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  currentMatch: number;
  totalMatches: number;
  onNext: () => void;
  onPrev: () => void;
}

export const InChatSearch = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  currentMatch,
  totalMatches,
  onNext,
  onPrev,
}: InChatSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute top-6 right-6 z-50 flex items-center gap-1.5 p-1.5 pl-3 bg-[#121216] border border-white/20 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden max-w-[calc(100%-3rem)]"
    >
      <Search size={16} className="text-brand-500 mr-1.5 flex-shrink-0" strokeWidth={3} />
      
      <div className="h-4 w-[1px] bg-white/20 mx-1 flex-shrink-0" />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
             e.preventDefault();
             if (e.shiftKey) onPrev();
             else onNext();
          }
          if (e.key === 'Escape') onClose();
        }}
        placeholder="Localizar..."
        className="min-w-0 w-32 sm:w-40 bg-transparent border-none outline-none text-sm text-white font-semibold placeholder-white/40 selection:bg-brand-500/30"
        spellCheck={false}
      />

      <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 mx-1 flex-shrink-0">
        <span className="text-[10px] font-mono font-bold text-white/90 min-w-[3ch] text-center tracking-wider">
          {totalMatches === 0 ? '0' : `${currentMatch}/${totalMatches}`}
        </span>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={onPrev}
          disabled={totalMatches === 0}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-brand-400 disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:bg-transparent transition-all duration-200"
        >
          <ChevronUp size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={onNext}
          disabled={totalMatches === 0}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-brand-400 disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:bg-transparent transition-all duration-200"
        >
          <ChevronDown size={16} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="h-4 w-[1px] bg-white/20 mx-1 flex-shrink-0" />

      <button
        onClick={onClose}
        className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/70 hover:text-red-400 transition-all duration-200 group flex-shrink-0"
      >
        <X size={16} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
      </button>
    </motion.div>
  );
};
