import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { copyToClipboard } from '../../utils/clipboardUtils';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const customStyle = {
    ...dracula,
    'code[class*="language-"]': {
      ...dracula['code[class*="language-"]'],
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      fontSize: 'inherit',
      lineHeight: '1.5',
    },
    'pre[class*="language-"]': {
      ...dracula['pre[class*="language-"]'],
      background: 'transparent',
      margin: 0,
      padding: '1rem',
      overflow: 'auto',
      maxWidth: '100%',
    },
  };

  return (
    <div className="group relative my-2 md:my-4 rounded-xl border border-white/10 bg-[#282a36] shadow-2xl transition-all hover:border-brand-500/30 w-full max-w-full min-w-0 overflow-hidden text-xs md:text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5555]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#f1fa8c]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#50fa7b]" />
          </div>
          <span className="text-xs font-mono font-bold text-brand-500 uppercase tracking-wider shadow-brand-500/20 drop-shadow-md mt-1">
            {language || 'text'}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-2 md:py-1 rounded-lg text-xs font-medium text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95 touch-manipulation"
        >
          {copied ? <Check size={14} className="text-[#50fa7b] pointer-events-none" /> : <Copy size={14} className="pointer-events-none" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#6272a4',
            textAlign: 'right',
          }}
          wrapLines
          customStyle={{
            background: 'transparent',
            margin: 0,
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#ff79c6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
