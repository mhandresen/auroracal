import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { StatChip } from "./stat-chip";
import { RuleRow } from "./rule-row";

export default function AvailabilityIntelligenceSnapshot() {
  return (
    <div className='relative overflow-hidden rounded-[22px] border border-white/10 bg-black/40'>
      <div className='flex items-start justify-center gap-3 border-b border-white/10 px-4 py-3'>
        <div className='flex min-w-0 items-start gap-3'>
          <div className='grid h-9 w-9 flex-none place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10'>
            <Sparkles className='h-4 w-4 text-emerald-300' />
          </div>
          <div className='min-w-0'>
            <div className='text-sm font-semibold text-zinc-50'>Availability intelligence</div>
            <div className='mt-1 text-xs text-zinc-400'>
              Rules, buffers, timezones, and confilict checks — all in one place.
            </div>
          </div>
        </div>
        <div className='hidden flex-none items-center gap-2 sm:flex'>
          <Badge>Conflict-safe</Badge>
          <Badge>Timezone-aware</Badge>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-semibold text-zinc-50'>Event type</div>
            <Badge className='bg-black/20'>Public link</Badge>
          </div>
          <div className='mt-3 rounded-2xl border border-white/10 bg-black/20 p-3'>
            <div className='text-xs text-zinc-400'>Name</div>
            <div className='mt-1 text-sm font-semibold text-zinc-50'>
              Deep-dive strategy session for high-ticket onboarding
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
              <Badge className='bg-black/20'>30 min</Badge>
              <Badge className='bg-black/20'>Video link</Badge>
              <Badge className='bg-black/20'>Europe/Oslo</Badge>
            </div>
          </div>

          <div className='mt-3 grid grid-cols-3 gap-2 text-xs'>
            <StatChip label='Buffer' value='10 min' />
            <StatChip label='Notice' value='2h' />
            <StatChip label='Limit' value='4/day' />
          </div>
        </div>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-semibold text-zinc-50'>Weekly rules</div>
            <div className='text-xs text-zinc-400'>Auto detects conflicts</div>
          </div>

          <div className='mt-3 space-y-2'>
            <RuleRow day='Mon–Thu' hours='09:00–15:00' state='Open' />
            <RuleRow day='Fri' hours='09:00–12:00' state='Open' />
            <RuleRow day='Sat' hours='—' state='Closed' muted />
            <RuleRow day='Sun' hours='—' state='Closed' muted />
          </div>

          <div className='mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400'>
            Guests see times in their locale. You keep your rules.
          </div>
        </div>
      </div>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl' />
        <div className='absolute -right-10 top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl' />
        <div className='absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl' />
      </div>
    </div>
  );
}
