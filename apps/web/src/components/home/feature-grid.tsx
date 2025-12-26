import { Calendar, Clock, Code2, Shield, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function FeatureGrid() {
  const items = [
    {
      icon: <Calendar className='h-5 w-5' />,
      title: "Beautiful availability",
      desc: "Rules that make sense: buffers, working hours, holidays, and smart overrides.",
    },
    {
      icon: <Clock className='h-5 w-5' />,
      title: "Instant timezones",
      desc: "Guests see times in their locale automatically — no back-and-forth, no mistakes.",
    },
    {
      icon: <Zap className='h-5 w-5' />,
      title: "Fast booking flow",
      desc: "Optimized UX that reduces drop-off and gets meetings confirmed quickly.",
    },
    {
      icon: <Shield className='h-5 w-5' />,
      title: "Privacy-first",
      desc: "Control data retention, use signed links, and host where you want.",
    },
    {
      icon: <Code2 className='h-5 w-5' />,
      title: "Developer-friendly",
      desc: "Webhooks, API-first architecture, and easy customization.",
    },
    {
      icon: <Sparkles className='h-5 w-5' />,
      title: "Brandable",
      desc: "Your logo, colors, and domain — polished booking pages that feel premium.",
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((it) => (
        <Card key={it.title} className='rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl'>
          <CardHeader className='space-y-2'>
            <div className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/40 text-emerald-300 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'>
              {it.icon}
            </div>
            <CardTitle className='text-base text-zinc-50'>{it.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed text-zinc-300'>{it.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
