import React, { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language = 'html',
  placeholder = 'Digite seu código aqui...'
}) => {
  const textareaReference = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaReference.current) return;
    
    textareaReference.current.style.height = 'auto';
    const scrollHeight = textareaReference.current.scrollHeight;
    const maxHeight = 300;
    textareaReference.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + '  ' + value.substring(end);
    onChange(newValue);
    
    requestAnimationFrame(() => {
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = start + 2;
    });
  };

  return (
    <div className="relative w-full" data-language={language}>
      <textarea
        ref={textareaReference}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className="
          w-full min-h-[120px] max-h-[300px] p-4
          font-mono text-sm leading-relaxed
          bg-[#282a36] text-[#f8f8f2]
          border-0 outline-none resize-none
          placeholder:text-white/30
          scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
          selection:bg-brand-500/30
        "
      />
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-brand-500/60 bg-brand-500/10">
        {language}
      </div>
    </div>
  );
};
