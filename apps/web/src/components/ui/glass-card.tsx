import React from "react";

function cn2(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GlassCard2({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className='relative'>
      {/* soft glow */}
      <div className='absolute -inset-6 rounded-[40px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-violet-500/10 blur-2xl' />
      <div
        className={cn2(
          "relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/45 shadow-[0_30px_120px_-60px_rgba(16,185,129,0.35)] backdrop-blur-xl",
          className
        )}
      >
        {/* subtle inner highlight */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent' />
        <div className='relative p-5 sm:p-6'>{children}</div>
      </div>
    </div>
  );
}
