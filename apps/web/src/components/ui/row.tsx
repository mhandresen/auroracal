export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
      <span className='text-xs text-zinc-400'>{label}</span>
      <span className='text-xs font-medium text-zinc-200'>{value}</span>
    </div>
  );
}
