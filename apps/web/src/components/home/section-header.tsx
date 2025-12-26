export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className='mb-8'>
      <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300'>
        <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
        {eyebrow}
      </div>
      <h2 className='mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl'>{title}</h2>
      <p className='mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300'>{subtitle}</p>
    </div>
  );
}
