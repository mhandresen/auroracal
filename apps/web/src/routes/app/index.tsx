import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, role, tenantId } = useAuth();
  return (
    <div className='space-y-3'>
      <h1 className='text-xl font-semibold'>Dashboard</h1>
      <div className='rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 text-sm'>
        <div>
          <span className='text-zinc-400'>Email:</span> {user?.email}
        </div>
        <div>
          <span className='text-zinc-400'>Tenant:</span> {tenantId}
        </div>
        <div>
          <span className='text-zinc-400'>Role:</span> {role}
        </div>
      </div>
    </div>
  );
}
