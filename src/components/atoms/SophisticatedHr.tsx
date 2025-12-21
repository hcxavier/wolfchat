import { memo } from 'react';

export const SophisticatedHr = memo(() => {
  return (
    <div className="relative my-2 md:my-0 py-2 w-full flex items-center justify-center gap-6 opacity-90 group">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-indigo-500/30 group-hover:to-indigo-400/50 transition-all duration-500" />
      
      <div className="flex items-center gap-1.5 shrink-0 transform transition-transform duration-500 group-hover:scale-110 group-hover:gap-2">
        <div className="w-[2px] h-3 bg-indigo-500/30 -skew-x-[20deg] rounded-full transition-colors duration-300 group-hover:bg-indigo-400/60" />
        <div className="w-[3px] h-5 bg-indigo-500 -skew-x-[20deg] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] group-hover:bg-indigo-400" />
        <div className="w-[2px] h-3 bg-indigo-500/30 -skew-x-[20deg] rounded-full transition-colors duration-300 group-hover:bg-indigo-400/60" />
      </div>

      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/5 to-indigo-500/30 group-hover:to-indigo-400/50 transition-all duration-500" />
    </div>
  );
});
