import cx from "classnames";
export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-dark-700/20 dark:border-dark-300",
        "bg-[#FAFAFA]/90 dark:bg-dark-200/90",
        "p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]",
        "ring-1 ring-black/5 dark:ring-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}
