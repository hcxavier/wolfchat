import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { availableModels, modelAliases } from '../../utils/constants';
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

  const getModelName = (modelId: string) => {
    return modelAliases[modelId] || modelId.replace(/^(groq\/|openrouter\/|gemini\/)/, '');
  };

  const getProviderName = (modelId: string) => {
    if (modelId.startsWith('gemini/')) return 'GOOGLE';
    if (modelId.startsWith('groq/')) return 'GROQ';
    if (modelId.startsWith('openrouter/')) return 'OPENROUTER';
    return 'AI PROVIDER';
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <div className="absolute -top-2 right-2 text-[9px] font-black text-brand-500 pointer-events-none select-none tracking-widest z-10">
        {getProviderName(selectedModel)}
      </div>

      <Button 
        variant="outline"
        className="text-[11px] font-bold py-1.5 px-2.5 h-auto bg-white/5 border border-white/10 rounded-full hover:bg-white/10 max-w-[150px] sm:max-w-[250px] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate block uppercase tracking-tight">
          {getModelName(selectedModel)}
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
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest leading-none">
                  {getProviderName(model)}
                </span>
                <span className="font-medium">
                  {getModelName(model)}
                </span>
              </div>
              {selectedModel === model && <Check size={14} className="text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};