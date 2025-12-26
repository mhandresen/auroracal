export function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
      <div className='text-[11px] text-zinc-400'>{label}</div>
      <div className='mt-0.5 text-xs font-semibold text-zinc-200'>{value}</div>
    </div>
  );
}
