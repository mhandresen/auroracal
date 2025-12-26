import { Badge } from "../ui/badge";

export function LogoStrip() {
  const logos = ["Nordic teams", "Agencies", "Founders", "Dev shops", "SaaS", "Consultants"];
  return (
    <section className='mt-12 sm:mt-14'>
      <div className='rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='text-xs text-zinc-400'>Trusted by teams who care about UX</div>
          <div className='flex flex-wrap items-center gap-2'>
            {logos.map((l) => (
              <Badge key={l} className='bg-black/20'>
                {l}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
