import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { availableModels } from '../../utils/constants';
import { Button } from '../atoms/Buttons';

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export const ModelSelector = ({ selectedModel, onSelectModel }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <Button 
        variant="outline"
        className="text-[11px] font-bold py-1.5 px-2.5 h-auto bg-white/5 border border-white/10 rounded-full hover:bg-white/10 max-w-[100px] sm:max-w-[200px] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate block uppercase tracking-tight">
          {selectedModel.replace(/^(groq\/|openrouter\/|gemini\/)/, '')}
        </span>
        <ChevronDown size={12} className="shrink-0 ml-1 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-surface-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1 max-h-[400px] overflow-y-auto">
          {availableModels.map((model) => (
            <button 
              key={model} 
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between hover:bg-surface-hover ${selectedModel === model ? 'bg-white/10 text-white' : 'text-gray-200'}`}
              onClick={() => {
                onSelectModel(model);
                setIsOpen(false);
              }}
            >
              <span>
                {model.replace(/^(groq\/|openrouter\/|gemini\/)/, '')}
              </span>
              {selectedModel === model && <Check size={14} className="text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};