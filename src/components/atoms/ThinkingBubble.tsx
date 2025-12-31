import { useState } from 'react';
import { ChevronRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThinkingBubble = ({ reasoning }: { reasoning: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!reasoning) return null;

  return (
    <div className="w-full my-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 text-xs md:text-sm text-primary/60 hover:text-brand-500 transition-colors bg-primary/5 hover:bg-brand-500/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-primary/10 hover:border-brand-500/30"
      >
        <motion.div
           animate={{ rotate: isOpen ? 90 : 0 }}
           transition={{ duration: 0.2 }}
        >
             <ChevronRight size={14} className="group-hover:text-brand-500" /> 
        </motion.div>
        
        <div className="flex items-center gap-2">
             <BrainCircuit size={14} className={isOpen ? "text-brand-500" : "opacity-70 group-hover:text-brand-500"} />
             <span className="font-medium group-hover:text-brand-500">Thinking...</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="mt-2 pl-4 md:pl-8 border-l-2 border-brand-500/30 ml-2">
                    <p className="text-sm text-primary/70 italic whitespace-pre-wrap leading-relaxed font-serif">
                        {reasoning}
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
