import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { processInlineTags } from '../../utils/immersiveUtils';
import { copyToClipboard } from '../../utils/clipboardUtils';

interface TerminalBlockProps {
  content: string;
}

export const TerminalBlock = ({ content }: TerminalBlockProps) => {
  const [copied, setCopied] = useState(false);

  const getCleanContent = (text: string) => {
     return text.replace(/<\/?\\w+>/g, '');
  };

  const handleCopy = async () => {
    const cleanText = getCleanContent(content);
    const success = await copyToClipboard(cleanText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-2 md:my-6 rounded-lg overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 w-full max-w-full group">
       <div className="flex items-center justify-between px-2 md:px-4 py-1.5 md:py-2.5 bg-white/[0.03] border-b border-white/5">
          <div className="flex gap-1.5 ml-2 md:ml-0 md:gap-2 shrink-0 items-center">
             <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
             <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
             <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <div className="text-[9px] md:text-[11px] font-bold tracking-widest text-white/30 select-none truncate ml-1 mt-0.5">BASH</div>
          </div>
          
           <button
             onClick={handleCopy}
             className="flex items-center gap-1.5 px-3 py-1.5 md:px-2 md:py-1 rounded-lg text-xs font-medium text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95 touch-manipulation"
             aria-label="Copy to clipboard"
             title="Copy to clipboard"
           >
             {copied ? <Check size={14} className="text-[#50fa7b] pointer-events-none" /> : <Copy size={14} className="pointer-events-none" />}
             <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
           </button>
       </div>
       <pre className="py-6 px-4 md:p-6 font-mono text-[12px] md:text-sm overflow-x-auto custom-scrollbar text-gray-200 block w-full relative">
          <code className="flex flex-col gap-0.5 md:gap-1.5 min-w-max">
             <div className="flex items-center text-white/50 select-none mb-1 md:mb-2 font-medium">
                <span className="text-fuchsia-400 mr-1 md:mr-2">➜</span>
                <span className="text-sky-400 mr-1 md:mr-2">~</span>
                $ execution_log
             </div>
             <span className="text-sky-200/90 whitespace-pre leading-snug">{processInlineTags(content)}</span>
          </code>
       </pre>
    </div>
  );
};
