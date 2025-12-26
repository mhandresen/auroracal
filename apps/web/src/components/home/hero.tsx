import { ArrowRight, Clock, Code2, Globe, Shield, Sparkles, Zap } from "lucide-react";
import { splitTagline } from "../../utils/misc";
import { motion } from "framer-motion";
import { MiniStat } from "./mini-stat";
import { MockBookingUI } from "./mock-booking-ui";
import { Button } from "../custom/button";
import AvailabilityIntelligenceSnapshot from "./availability-intelligence";

export function Hero({ tagline, subtagline }: { tagline: string; subtagline: string }) {
  const { first, rest } = splitTagline(tagline);

  return (
    <section className='relative'>
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12'>
        <div className='pt-6 sm:pt-10'>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1'
          >
            <Sparkles className='h-4 w-4 text-emerald-300' />
            <span className='text-xs text-zinc-300'>Built for speed, clarity, and conversion</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className='mt-6 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl'
          >
            {first}{" "}
            {rest ? (
              <span className='relative'>
                <span className='bg-gradient-to-r from-emerald-300 via-emerald-200 to-cyan-200 bg-clip-text text-transparent'>
                  {rest}
                </span>
                <span className='pointer-events-none absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent' />
              </span>
            ) : null}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className='mt-4 max-w-xl text-base leading-relaxed text-zinc-300'
          >
            {subtagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className='mt-8 flex flex-wrap items-center gap-3'
          >
            <Button className='rounded-2xl px-5'>
              View demo
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
            <Button variant='outline' className='rounded-2xl border-white/10 bg-white/5'>
              How it works
            </Button>

            <div className='mt-2 flex w-full items-center gap-4 text-xs text-zinc-400 sm:mt-0 sm:w-auto'>
              <div className='inline-flex items-center gap-2'>
                <Shield className='h-4 w-4 text-zinc-300' />
                SOC2-ready patterns
              </div>
              <div className='inline-flex items-center gap-2'>
                <Code2 className='h-4 w-4 text-zinc-300' />
                Self-hostable
              </div>
            </div>
          </motion.div>

          <div className='mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3'>
            <MiniStat label='Setup' value='< 10 min' icon={<Zap className='h-4 w-4' />} />
            <MiniStat label='Timezone' value='Auto' icon={<Globe className='h-4 w-4' />} />
            <MiniStat label='Routing' value='Smart' icon={<Clock className='h-4 w-4' />} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
          className='relative'
        >
          <div className='absolute -inset-6 rounded-[36px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-violet-500/10 blur-2xl' />
          <div className='relative rounded-[28px] border border-white/10 bg-zinc-950/50 p-4 shadow-[0_30px_120px_-60px_rgba(16,185,129,0.45)] backdrop-blur-xl'>
            <AvailabilityIntelligenceSnapshot />
          </div>
        </motion.div>
      </div>

      <div className='pointer-events-none mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent' />
      <div className='pointer-events-none absolute inset-x-0 -bottom-10 mx-auto h-24 max-w-6xl bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent blur-2xl' />
    </section>
  );
}
