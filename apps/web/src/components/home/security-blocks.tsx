import { Check, Shield, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function SecurityBlocks() {
  const blocks = [
    {
      title: "Your data, your rules",
      desc: "Self-host on your infrastructure. Configure retention, logging, and regions to match your compliance needs.",
      bullets: ["Database encryption", "Signed booking links", "Audit-ready event trails"],
      icon: <Shield className='h-5 w-5' />,
    },
    {
      title: "Sane defaults",
      desc: "Built-in guardrails so you don’t accidentally leak private calendars or overbook your team.",
      bullets: ["Conflict detection", "Rate limiting", "Bot protection"],
      icon: <Sparkles className='h-5 w-5' />,
    },
    {
      title: "Integrations that matter",
      desc: "Google & Microsoft calendars, video links, and webhooks for your workflows.",
      bullets: ["Google/Microsoft", "Teams/Meet/Zoom", "Slack + webhooks"],
      icon: <Zap className='h-5 w-5' />,
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      {blocks.map((b) => (
        <Card key={b.title} className='rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl'>
          <CardHeader className='space-y-2'>
            <div className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/40 text-emerald-300'>
              {b.icon}
            </div>
            <CardTitle className='text-base text-zinc-50'>{b.title}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm leading-relaxed text-zinc-300'>{b.desc}</p>
            <div className='space-y-2'>
              {b.bullets.map((x) => (
                <div key={x} className='flex items-center gap-2 text-sm text-zinc-200'>
                  <span className='grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-emerald-500/10 text-emerald-200'>
                    <Check className='h-3.5 w-3.5' />
                  </span>
                  <span className='text-zinc-300'>{x}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
