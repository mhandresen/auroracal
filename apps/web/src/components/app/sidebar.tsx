import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  to: string;
  disabled?: boolean;
};

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/app" },
  { label: "Meeting types", to: "/app/meeting-types" },
  { label: "Availability", to: "/app/availability" },
  { label: "Bookings", to: "/app/bookings", disabled: true },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  return (
    <aside className='flex h-screen w-64 flex-col border-r border-zinc-900 bg-zinc-950'>
      {/* Brand */}
      <div className='px-5 py-4'>
        <div className='text-sm font-semibold tracking-tight'>AuroraCal</div>
        <div className='mt-1 text-xs text-zinc-500'>Scheduling</div>
      </div>

      <div className='h-px w-full bg-zinc-900' />

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-3 py-3 space-y-1'>
        {NAV.map((item) => (
          <Button
            key={item.to}
            variant='ghost'
            disabled={item.disabled}
            className={[
              "w-full justify-start rounded-xl px-3",
              item.disabled ? "text-zinc-600" : "text-zinc-200 hover:bg-zinc-900/60",
            ].join(" ")}
            onClick={() => navigate({ to: item.to })}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      <div className='h-px w-full bg-zinc-900' />

      {/* User / workspace */}
      <div className='px-4 py-4'>
        <div className='rounded-xl border border-zinc-900 bg-zinc-950/60 px-3 py-2 text-xs'>
          <div className='text-zinc-500'>Signed in as</div>
          <div className='mt-1 truncate font-medium text-zinc-200'>{user?.email}</div>
          <div className='mt-1 text-zinc-500'>Role: {role}</div>
        </div>
      </div>
    </aside>
  );
}
