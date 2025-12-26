import { AuroraBackground } from "../aurora";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-black text-zinc-100'>
      <AuroraBackground />
      <div className='relative flex min-h-screen items-center justify-center px-4 py-10'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-black' />
        <Card className='relative w-full max-w-md rounded-[32px] border-white/10 bg-white/5 backdrop-blur-xl'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-xl text-zinc-50'>{title}</CardTitle>
            <div className='text-sm text-zinc-400'>{subtitle}</div>
          </CardHeader>
          <CardContent className='space-y-3'>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
