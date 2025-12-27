import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "../../components/auth/auth-shell";
import { Input } from "../../components/custom/input";
import { Button } from "../../components/custom/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).max(200),
});

type LoginForm = z.infer<typeof LoginSchema>;

async function loginRequest(input: { email: string; password: string }) {
  const res = await fetch("/_api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Registration failed");
  }

  return res.json();
}

function RouteComponent() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate({ to: "/app" });
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
      await qc.refetchQueries({ queryKey: ["me"] });
      navigate({ to: "/app" });
    },
  });

  const onSubmit = (values: LoginForm) => {
    mutation.mutate({
      email: values.email.trim(),
      password: values.password,
    });
  };

  const { register, handleSubmit, formState } = form;
  const disabled = mutation.isPending;

  return (
    <AuthShell
      title='Sign in'
      subtitle={
        <>
          Welcome back. Don’t have an account?{" "}
          <button onClick={() => navigate({ to: "/auth/register" })} className='text-emerald-300 hover:underline'>
            Create one
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
        <div>
          <Input placeholder='Email' type='email' autoComplete='email' disabled={disabled} {...register("email")} />
          {formState.errors.email ? (
            <div className='mt-1 text-xs text-red-400'>{formState.errors.email.message}</div>
          ) : null}
        </div>
        <div>
          <Input
            type='password'
            placeholder='Password'
            autoComplete='current-password'
            disabled={disabled}
            {...register("password")}
          />
          {formState.errors.password ? (
            <div className='mt-1 text-xs text-red-400'>{formState.errors.password.message}</div>
          ) : null}
        </div>
        <Button className='w-full rounded-2xl' type='submit' disabled={disabled}>
          {disabled ? "Signing in..." : "Sign in"}
        </Button>
        <div className='flex items-center justify-between text-xs text-zinc-500'>
          <Link to='/' className='hover:text-zinc-300'>
            ← Back to home
          </Link>
        </div>
        {mutation.isError ? <div className='text-sm text-red-400'>{(mutation.error as Error).message}</div> : null}
      </form>
    </AuthShell>
  );
}
