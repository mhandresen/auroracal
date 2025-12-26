import cx from "classnames";
export function RuleRow({ day, hours, state, muted }: { day: string; hours: string; state: string; muted?: boolean }) {
  return (
    <div
      className={cx(
        "flex items-center justify-between rounded-2xl border px-3 py-2",
        muted ? "border-white/5 bg-black/10" : "border-white/10 bg-black/20"
      )}
    >
      <div className='text-xs font-medium text-zinc-200'>{day}</div>
      <div className='flex items-center gap-2'>
        <div className={cx("text-xs", muted ? "text-zinc-600" : "text-zinc-300")}>{hours}</div>
        <span
          className={cx(
            "rounded-full border px-2 py-0.5 text-[11px]",
            muted
              ? "border-white/5 bg-white/5 text-zinc-600"
              : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          )}
        >
          {state}
        </span>
      </div>
    </div>
  );
}
