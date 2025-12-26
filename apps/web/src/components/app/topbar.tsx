import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function logout() {
  await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function Topbar({ title }: { title: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: "/auth/login" });
    },
  });

  return (
    <header className='flex h-14 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6'>
      <h1 className='text-lg font-medium tracking-tight'>{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='rounded-xl'>
            {user?.email}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem disabled>Profile (soon)</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings (soon)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logoutMutation.mutate()} className='text-red-400 focus:text-red-400'>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
