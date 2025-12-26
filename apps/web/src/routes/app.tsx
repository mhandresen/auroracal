import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className='p-6'>Loading…</div>;

  if (!isAuthenticated) {
    navigate({ to: "/auth/login" });
    return null;
  }

  return (
    <div className='flex h-screen overflow-hidden bg-black text-zinc-100'>
      <Sidebar />

      <div className='flex min-w-0 flex-1 flex-col'>
        <Topbar title='Dashboard' />
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
