import cx from "classnames";
type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cx("rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300", className)}
      {...props}
    />
  );
}
