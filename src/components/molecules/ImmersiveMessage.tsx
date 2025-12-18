import { AlertTriangle, Quote, Sparkles, Info, Hash, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '../atoms/CodeBlock';
import { TerminalBlock } from '../atoms/TerminalBlock';
import { SophisticatedHr } from '../atoms/SophisticatedHr';
import { processInlineTags } from '../../utils/immersiveUtils';
import { MotionReveal } from '../atoms/MotionReveal';
import React, { useMemo } from 'react';

interface ImmersiveMessageProps {
  content: string;
  shouldAnimate: boolean;
  onReveal?: (el: HTMLElement) => void;
}

const IMMERSIVE_BLOCK_TAGS = ['obs', 'text', 'title', 'subtitle', 'warning', 'quote', 'terminal', 'banner', 'ul', 'ol'];

const parseContent = (text: string) => {
  const parts: { type: string; content: string; language?: string }[] = [];
  
  const tagPattern = `(<(?:${IMMERSIVE_BLOCK_TAGS.join('|')})>)([\\s\\S]*?)(</(?:${IMMERSIVE_BLOCK_TAGS.join('|')})>)`;
  const codePattern = "``` *(\\w+)? *(?:\\n|\\r\\n)?([\\s\\S]*?)```";
  
  const regex = new RegExp(`${tagPattern}|${codePattern}`, 'g');
  
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }

    if (match[1]) {
      const tag = match[1].replace(/[<>]/g, '');
      parts.push({ type: tag, content: match[2] });
    } else {
      const language = match[4] || 'text';
      const codeContent = match[5];
      parts.push({ type: 'code', content: codeContent, language });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return parts;
};

const createMarkdownComponents = (): Components => {
  return {
    h1: ({ children }) => (
      <div className="relative my-4 md:my-6 group w-full max-w-full overflow-hidden rounded-xl p-1">
        <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter relative z-10 pb-1 md:pb-2 drop-shadow-xl break-words">
          {children}
        </h1>
        <div className="absolute bottom-0 left-0 w-8 md:w-16 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-brand-500 rounded-full group-hover:w-16 md:group-hover:w-32 transition-all duration-500" />
      </div>
    ),
    h2: ({ children }) => (
      <h2 className="flex items-center gap-2 text-lg md:text-2xl font-bold text-white/95 mt-4 md:mt-6 mb-2 pl-1 w-full max-w-full break-words">
        <div className="w-1 md:w-1.5 h-4 md:h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)] shrink-0" />
        <span className="break-words min-w-0">{children}</span>
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base md:text-xl font-bold text-white mt-4 md:mt-6 mb-2 flex items-center gap-2">
        <span className="flex items-center justify-center text-indigo-400 bg-indigo-500/20 w-6 h-6 md:w-8 md:h-8 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          <Hash size={14} className="md:w-4 md:h-4" />
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100/80">
          {children}
        </span>
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-sm md:text-lg font-bold text-indigo-200 mt-3 md:mt-5 mb-1 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-sm md:text-base font-semibold text-white/90 mt-2 md:mt-4 uppercase tracking-wide">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-xs md:text-sm font-semibold text-white/70 mt-2 md:mt-4 italic">
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <div className="whitespace-pre-wrap leading-relaxed text-white/80 text-base mb-2 md:mb-3">
         {React.Children.map(children, child => {
            if (typeof child === 'string') return processInlineTags(child);
            return child;
         })}
      </div>
    ),
    ul: ({ children }) => (
        <div className="w-full flex flex-col gap-0.5 md:gap-1 my-2">
            {children}
        </div>
    ),
    ol: ({ children }) => (
        <div className="w-full flex flex-col gap-0.5 md:gap-1 my-2 counter-reset-ol">
            {children}
        </div>
    ),
    li: ({ children }) => {
        return (
            <div className="group relative flex items-start gap-2 md:gap-3 py-1 px-1 rounded-lg hover:bg-white/[0.03] transition-colors duration-200">
                 <div className="flex items-center justify-center h-6 shrink-0 pt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-150 group-hover:bg-indigo-300 shadow-[0_0_8px_rgba(129,140,248,0.6)] transition-all duration-300" />
                 </div>
                 <div className="flex-1 text-white/90 group-hover:text-white leading-relaxed text-sm md:text-[0.95rem]">
                   {React.Children.map(children, child => {
                        if (typeof child === 'string') return processInlineTags(child);
                        if (React.isValidElement(child) && child.type === 'p') {
                             return (child.props as any).children; 
                        }
                        return child;
                   })}
                 </div>
            </div>
        );
    },
    blockquote: ({ children }) => (
      <div className="relative my-3 md:my-6 group w-full">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
          <div className="pl-4 md:pl-6 py-1">
              <Quote size={14} className="text-indigo-400 mb-1 opacity-50" />
              <div className="text-white/90 font-serif italic leading-relaxed text-base">
                  {children}
              </div>
          </div>
      </div>
    ),
    a: ({ href, children }) => (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/30 hover:decoration-indigo-300 transition-all font-medium"
        >
            {children}
            <LinkIcon size={10} className="opacity-70" />
        </a>
    ),
    code: ({ node, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        const isInline = !match && !String(children).includes('\n');
        
        if (isInline) {
            return (
                <code className="px-1.5 py-0.5 rounded-md text-[0.85em] font-mono bg-black/40 text-yellow-300 border border-yellow-500/20 align-baseline shadow-[0_0_8px_rgba(234,179,8,0.1)] mx-0.5" {...props}>
                    {children}
                </code>
            );
        }

        return (
            <div className="my-4 w-full max-w-full">
                <CodeBlock 
                    language={match ? match[1] : 'text'}
                    value={String(children).replace(/\n$/, '')}
                />
            </div>
        );
    },
    pre: ({ children }) => <>{children}</>,
    img: ({ src, alt }) => (
        <div className="relative my-4 group overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <img src={src} alt={alt} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            {alt && <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white/70 truncate">{alt}</div>}
            <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white/50">
                <ImageIcon size={14} />
            </div>
        </div>
    ),
    hr: () => (
         <SophisticatedHr />
    ),
    table: ({ children }) => (
        <div className="w-full overflow-x-auto my-4 rounded-lg border border-white/10">
            <table className="w-full border-collapse bg-white/[0.02]">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">{children}</tr>,
    th: ({ children }) => <th className="p-3 text-left text-xs md:text-sm font-semibold text-indigo-300 uppercase tracking-wider">{children}</th>,
    td: ({ children }) => <td className="p-3 text-sm text-white/80 border-l border-white/5 first:border-0">{children}</td>,
  };
};

export const ImmersiveMessage = ({ content, shouldAnimate, onReveal }: ImmersiveMessageProps) => {
  const parts = useMemo(() => parseContent(content), [content]);
  const counter = { count: 0 };
  const markdownComponents = useMemo(() => createMarkdownComponents(), []);

  return (
    <div className="not-prose flex flex-col gap-2 md:gap-4 w-full max-w-full break-words">
      {parts.map((part, index) => {
        if (!part.content.trim() && part.type === 'text') return null;

        switch (part.type) {
          case 'title':
            return (
              <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                <div className="relative my-2 md:my-5 group w-full max-w-full rounded-xl p-1">
                  <h1 className="text-xl md:text-5xl font-black text-white tracking-tighter relative z-5 pb-1 md:pb-3 drop-shadow-xl break-words">
                    {processInlineTags(part.content)}
                  </h1>
                  <div className="absolute bottom-0 left-0 w-12 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-brand-500 rounded-full group-hover:w-24 md:group-hover:w-48 transition-all duration-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
                  <div className="absolute -left-10 -top-10 w-24 h-24 md:w-48 md:h-48 bg-indigo-500/10 blur-[30px] md:blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
                </div>
              </MotionReveal>
            );
          case 'subtitle':
            return (
              <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                <h2 className="flex items-center gap-1.5 md:gap-3 text-base md:text-2xl font-bold text-white/95 mt-2 md:mt-4 pl-1 w-full max-w-full break-words">
                  <div className="w-1 md:w-1.5 h-4 md:h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)] shrink-0" />
                  <span className="break-words min-w-0">
                    {processInlineTags(part.content)}
                  </span>
                </h2>
              </MotionReveal>
            );

          case 'terminal':
            return (
              <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                <TerminalBlock content={part.content} />
              </MotionReveal>
            );
          case 'warning':
            return (
              <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                <div className="my-2 md:my-5 relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 p-2 md:p-5 group hover:border-red-500/50 transition-colors shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] w-full max-w-full">
                   <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                      <AlertTriangle size={60} className="text-red-500 md:w-[100px] md:h-[100px]" />
                   </div>
                   <div className="relative flex gap-2 md:gap-4 items-start max-w-full">
                      <div className="p-1.5 md:p-3 h-fit rounded-lg md:rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                         <AlertTriangle size={16} className="md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                      </div>
                      <div className="space-y-0.5 md:space-y-1.5 pt-0.5 min-w-0 flex-1">
                         <div className="text-[9px] md:text-xs font-black text-red-500 uppercase tracking-widest">Atenção</div>
                         <div className="text-xs md:text-base text-red-100/95 leading-relaxed font-medium break-words">
                            {processInlineTags(part.content)}
                         </div>
                      </div>
                   </div>
                </div>
              </MotionReveal>
            );
          case 'obs':
             return (
               <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                 <div className="my-1.5 md:my-3 p-2 md:p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-start gap-2 md:gap-3 backdrop-blur-sm shadow-sm hover:border-teal-500/40 transition-colors w-full max-w-full">
                    <Info size={12} className="text-teal-400 shrink-0 mt-0.5 md:w-4 md:h-4" />
                    <div className="text-[11px] md:text-sm text-teal-100/90 leading-relaxed break-words min-w-0 flex-1">
                       {processInlineTags(part.content)}
                    </div>
                 </div>
               </MotionReveal>
             );

          case 'quote':
             return (
               <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                 <div className="relative my-3 md:my-8 group w-full max-w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <div className="absolute -left-3 -top-2 md:-top-3 p-1 md:p-1.5 bg-[#2b2c30] rounded-full border border-indigo-500/30 shadow-lg">
                       <Quote size={10} className="text-indigo-400 fill-indigo-400/20 md:w-[14px] md:h-[14px]" />
                    </div>
                    <div className="pl-4 md:pl-6 py-0.5 md:py-1">
                       <p className="text-xs md:text-xl text-white/90 font-serif italic leading-relaxed drop-shadow-sm break-words">
                          "{processInlineTags(part.content)}"
                       </p>
                    </div>
                 </div>
               </MotionReveal>
             );
          case 'banner':
             return (
                <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                   <div className="relative my-2 md:my-4 w-full group max-w-full min-w-0">
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-2 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-brand-500/30 hover:shadow-brand-500/10 w-full">
                         
                         <div className="absolute top-0 right-0 w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-brand-500/10 blur-[60px] md:blur-[100px] rounded-full mix-blend-screen opacity-50 pointer-events-none" />
                         <div className="absolute bottom-0 left-0 w-[100px] h-[100px] md:w-[200px] md:h-[200px] bg-blue-500/10 blur-[40px] md:blur-[80px] rounded-full mix-blend-screen opacity-30 pointer-events-none" />
                         
                         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />

                         <div className="relative z-10 py-6 md:py-2 flex flex-col items-center justify-center text-center gap-2 md:gap-6 w-full max-w-full whitespace-normal">
                            <div className="p-1 md:p-3 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300 shrink-0">
                               <Sparkles size={14} className="drop-shadow-[0_0_10px_rgba(var(--brand-500),0.5)] md:w-6 md:h-6" />
                            </div>

                            <div className="space-y-1 md:space-y-4 w-full max-w-full px-1">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg break-words w-full leading-snug">
                                  {processInlineTags(part.content)}
                                </h2>
                                <div className="h-px w-10 md:w-32 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>
                         </div>
                      </div>
                   </div>
                </MotionReveal>
             );

          case 'code':
            return (
              <MotionReveal key={index} delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                <CodeBlock 
                  language={part.language || 'text'}
                  value={part.content.trim()}
                />
              </MotionReveal>
            );

          case 'text':
          default:
             return (

               <div key={index} className="w-full max-w-full break-words min-w-0">
                  <MotionReveal delayIndex={counter.count++} shouldAnimate={shouldAnimate} onReveal={onReveal}>
                     <ReactMarkdown
                       remarkPlugins={[remarkGfm]}
                       rehypePlugins={[rehypeRaw]}
                       components={markdownComponents}
                     >
                       {part.content}
                     </ReactMarkdown>
                  </MotionReveal>
               </div>
             );
        }
      })}
    </div>
  );
};
