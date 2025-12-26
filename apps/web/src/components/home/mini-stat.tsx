export function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
      <div className='flex items-center gap-2 text-xs text-zinc-400'>
        <span className='text-emerald-300'>{icon}</span>
        {label}
      </div>
      <div className='mt-2 text-lg font-semibold tracking-tight text-zinc-50'>{value}</div>
    </div>
  );
}
