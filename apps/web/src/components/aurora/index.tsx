export function AuroraBackground() {
  const NOISE_DATA_URI =
    "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22180%22%20height%3D%22180%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22180%22%20height%3D%22180%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.35%22/%3E%3C/svg%3E";
  return (
    <div className='pointer-events-none fixed inset-0 -z-10'>
      {/* Base */}
      <div className='absolute inset-0 bg-black' />

      {/* Subtle grid */}
      <div className='absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]' />

      {/* Aurora blobs */}
      <div className='absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[90px]' />
      <div className='absolute right-[-120px] top-[-80px] h-[560px] w-[560px] rounded-full bg-violet-500/16 blur-[100px]' />
      <div className='absolute left-[25%] top-[40%] h-[520px] w-[520px] rounded-full bg-cyan-400/14 blur-[95px]' />

      {/* Vignette + highlight */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/35 via-black/60 to-black' />
      <div className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_72%)] bg-gradient-to-r from-emerald-400/10 via-cyan-300/5 to-violet-400/10' />

      {/* Fine grain (style prop avoids JSX quoting issues) */}
      <div
        className='absolute inset-0 opacity-[0.08] mix-blend-overlay'
        style={{ backgroundImage: `url(${NOISE_DATA_URI})` }}
      />
    </div>
  );
}
