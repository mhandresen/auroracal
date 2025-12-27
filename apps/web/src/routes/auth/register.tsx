import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "../../components/auth/auth-shell";
import { Input } from "../../components/custom/input";
import { Button } from "../../components/custom/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(80).optional().or(z.literal("")),
  email: z.email().trim(),
  password: z.string().min(8).max(200),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

async function registerRequest(input: { name?: string; email: string; password: string; timezone: string }) {
  const res = await fetch("/_api/v1/auth/register", {
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
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate({ to: "/app" });
  }

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => navigate({ to: "/app" }),
  });

  const onSubmit = (values: RegisterForm) => {
    mutation.mutate({
      name: values.name?.trim() ? values.name.trim() : undefined,
      email: values.email.trim(),
      password: values.password,
      timezone,
    });
  };

  const { register, handleSubmit, formState } = form;
  const disabled = mutation.isPending;
  return (
    <AuthShell
      title='Create account'
      subtitle={
        <>
          Already have an account?{" "}
          <button onClick={() => navigate({ to: "/auth/login" })} className='text-emerald-300 hover:underline'>
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
        <div>
          <Input placeholder='Name' autoComplete='name' disabled={disabled} {...register("name")} />
          {formState.errors.name ? (
            <div className='mt-1 text-xs text-red-400'>{formState.errors.name.message}</div>
          ) : null}
        </div>

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
            autoComplete='new-password'
            disabled={disabled}
            {...register("password")}
          />
          {formState.errors.password ? (
            <div className='mt-1 text-xs text-red-400'>{formState.errors.password.message}</div>
          ) : null}
        </div>
        <Button className='w-full rounded-2xl' type='submit' disabled={disabled}>
          {disabled ? "Creating..." : "Create account"}
        </Button>
        {mutation.isError ? <div className='text-sm text-red-400'>{(mutation.error as Error).message}</div> : null}
        <div className='text-xs text-zinc-500'>By continuing you agree to the Terms and Privacy.</div>
      </form>
    </AuthShell>
  );
}
