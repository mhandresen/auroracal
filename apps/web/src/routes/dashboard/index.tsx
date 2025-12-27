import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../../components/custom/button";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

async function me() {
  const res = await fetch("/_api/v1/auth/me", { credentials: "include" });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

async function logout() {
  await fetch("/_api/v1/auth/logout", { method: "POST", credentials: "include" });
}

function RouteComponent() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: me,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: "/auth/login" });
    },
  });

  if (meQuery.isLoading) return <div className='p-6'>Loading...</div>;

  if (meQuery.isError) {
    navigate({ to: "/auth/login" });
    return null;
  }

  const data = meQuery.data;

  return (
    <div className='p-6 space-y-4'>
      <div className='rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4'>
        <div className='text-lg font-semibold'>App Debug</div>
        <div className='mt-3 space-y-1 text-sm text-zinc-200'>
          <div>
            <span className='text-zinc-400'>Email:</span> {data.user.email}
          </div>
          <div>
            <span className='text-zinc-400'>User slug:</span> {data.user.slug}
          </div>
          <div>
            <span className='text-zinc-400'>TenantId:</span> {data.tenantId}
          </div>
          <div>
            <span className='text-zinc-400'>Role:</span> {data.role}
          </div>
        </div>

        <Button className='mt-4' onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          Logout
        </Button>
      </div>
    </div>
  );
}
