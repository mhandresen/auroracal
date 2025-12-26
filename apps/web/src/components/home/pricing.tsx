import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../custom/button";
import cx from "classnames";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      note: "Perfect to launch",
      features: ["1 booking page", "Basic availability rules", "Unlimited meetings", "Email confirmations"],
      cta: "Start free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      note: "For consultants & teams",
      features: [
        "Multiple event types",
        "Routing & round-robin",
        "Branding + custom domain",
        "Payments (Stripe)",
        "Webhooks + API keys",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Business",
      price: "$29",
      note: "For scale",
      features: ["SSO / SCIM", "Advanced permissions", "Audit logs", "Dedicated environments"],
      cta: "Talk to sales",
      highlighted: false,
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      {tiers.map((t) => (
        <div key={t.name} className='relative'>
          {t.highlighted && (
            <div className='absolute -inset-1 rounded-[28px] bg-gradient-to-r from-emerald-500/30 via-cyan-400/25 to-violet-500/25 blur-xl' />
          )}
          <Card
            className={cx(
              "relative rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl",
              t.highlighted && "ring-1 ring-emerald-400/30"
            )}
          >
            <CardHeader className='space-y-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base text-zinc-50'>{t.name}</CardTitle>
                {t.highlighted && (
                  <span className='rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200'>
                    Most popular
                  </span>
                )}
              </div>
              <div className='flex items-end gap-2'>
                <div className='text-3xl font-semibold tracking-tight text-zinc-50'>{t.price}</div>
                <div className='pb-1 text-sm text-zinc-400'>/mo</div>
              </div>
              <p className='text-sm text-zinc-300'>{t.note}</p>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                {t.features.map((f) => (
                  <div key={f} className='flex items-center gap-2 text-sm'>
                    <span className='grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/5 text-emerald-200'>
                      <Check className='h-3.5 w-3.5' />
                    </span>
                    <span className='text-zinc-300'>{f}</span>
                  </div>
                ))}
              </div>
              <Button
                className={cx("w-full rounded-2xl", !t.highlighted && "bg-white/10 hover:bg-white/15")}
                variant={t.highlighted ? "default" : "secondary"}
              >
                {t.cta}
              </Button>
              <p className='text-xs text-zinc-500'>No hidden fees. Cancel anytime.</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
