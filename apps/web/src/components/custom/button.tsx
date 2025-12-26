import cx from "classnames";
type ButtonVariant = "default" | "secondary" | "outline" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  focusStyle?: boolean;
};

export function Button({ className, variant = "default", type = "button", focusStyle = true, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition  disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    default: "bg-emerald-500/90 text-black hover:bg-emerald-400 shadow-[0_18px_60px_-30px_rgba(16,185,129,0.8)]",
    secondary: "bg-white/10 text-zinc-50 hover:bg-white/15",
    outline: "border border-white/10 bg-white/5 text-zinc-50 hover:bg-white/10",
    ghost: "bg-transparent text-zinc-50 hover:bg-white/10",
  };

  return (
    <button
      type={type}
      className={cx(
        base,
        variants[variant],
        className,
        focusStyle ? "focus:outline-none focus:ring-2 focus:ring-emerald-400" : undefined
      )}
      {...props}
    />
  );
}
