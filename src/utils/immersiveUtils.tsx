import React from 'react';
import { Command } from 'lucide-react';

export const IMMERSIVE_INLINE_TAGS = ['technical-term', 'highlight', 'mark', 'strong'];

export const processInlineTags = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = new RegExp(`<(${IMMERSIVE_INLINE_TAGS.join('|')})>([\\s\\S]*?)<\\/\\1>`, 'g');
  
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const tag = match[1];
    const content = match[2];
    const processedContent = processInlineTags(content);
    
    switch (tag) {
      case 'technical-term':
        parts.push(
           <span key={`tech-${match.index}`} className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.85em] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30 align-baseline shadow-[0_0_10px_rgba(14,165,233,0.1)] hover:bg-sky-500/20 transition-colors cursor-default">
              <Command size={10} className="mb-0.5 mr-1 opacity-100" />
              {processedContent}
           </span>
        );
        break;
      case 'highlight':
         parts.push(
           <span key={`highlight-${match.index}`} className="inline-block px-1.5 rounded bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30 font-medium mx-0.5 shadow-[0_0_8px_rgba(217,70,239,0.1)]">
              {processedContent}
           </span>
         );
         break;
      case 'mark':
         parts.push(
           <span key={`mark-${match.index}`} className="relative inline-block mx-0.5 px-0.5 transform -skew-x-6">
              <span className="absolute inset-0 bg-lime-400/20 rounded-sm border-b-2 border-lime-400/50" />
              <span className="relative text-lime-100 font-semibold">{processedContent}</span>
           </span>
         );
         break;
      case 'strong':
          parts.push(
            <strong key={`strong-${match.index}`} className="font-bold text-white drop-shadow-sm">
                {processedContent}
            </strong>
          );
          break;
      default:
         parts.push(processedContent);
    }
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};
