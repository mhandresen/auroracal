import { useNavigate } from "@tanstack/react-router";

export function NavLink({ to, children, disabled }: { to: string; children: React.ReactNode; disabled?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      type='button'
      onClick={() => !disabled && navigate({ to })}
      className={[
        "w-full rounded-xl px-3 py-2 text-left text-sm",
        disabled ? "cursor-not-allowed text-zinc-600" : "hover:bg-zinc-900/60 text-zinc-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
