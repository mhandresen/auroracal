import { ArrowRight } from "lucide-react";
import { Button } from "../custom/button";

export function FinalCTA({ productName }: { productName: string }) {
  return (
    <section className='mt-16 sm:mt-20'>
      <div className='relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10'>
        <div className='absolute -inset-10 bg-gradient-to-r from-emerald-500/15 via-cyan-400/10 to-violet-500/15 blur-2xl' />
        <div className='relative grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
              Launch-ready
            </div>
            <h3 className='mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl'>
              Ship a premium scheduling experience today
            </h3>
            <p className='mt-2 max-w-xl text-sm leading-relaxed text-zinc-300'>
              {productName} gives you a modern booking flow, routing logic, and integrations — with the clean UI your
              users expect.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
            <Button className='rounded-2xl px-5'>
              Create your booking page
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
            <Button variant='outline' className='rounded-2xl border-white/10 bg-white/5'>
              Read docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
