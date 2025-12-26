import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "../custom/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";
export function NavBar({ productName }: { productName: string }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <header className='sticky top-0 z-50'>
      <div className='absolute inset-0 bg-black/35 backdrop-blur-xl' />
      <div className='relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        <a href='#' className='group inline-flex items-center gap-2'>
          <div className='relative'>
            <div className='grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900/60 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'>
              <Calendar className='h-5 w-5 text-emerald-300' />
            </div>
            <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-emerald-500/20 blur-xl opacity-0 transition group-hover:opacity-100' />
          </div>
          <span className='text-sm font-semibold tracking-tight text-zinc-100'>{productName}</span>
          <Badge>Scheduling without the back-and-forth</Badge>
        </a>

        <nav className='hidden items-center gap-6 text-sm text-zinc-300 md:flex'>
          <a className='hover:text-zinc-100' href='#features'>
            Features
          </a>
          <a className='hover:text-zinc-100' href='#demo'>
            Demo
          </a>
          <a className='hover:text-zinc-100' href='#security'>
            Security
          </a>
          <a className='hover:text-zinc-100' href='#pricing'>
            Pricing
          </a>
        </nav>

        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <Button onClick={() => navigate({ to: "/app" })} className='rounded-2xl'>
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate({ to: "/auth/login" })}
                variant='ghost'
                className='hidden text-zinc-200 hover:text-zinc-50 md:inline-flex'
              >
                Sign in
              </Button>
              <Button onClick={() => navigate({ to: "/auth/register" })} className='rounded-2xl'>
                Get started
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent' />
    </header>
  );
}
