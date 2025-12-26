import { Calendar } from "lucide-react";

export function Footer({ productName }: { productName: string }) {
  return (
    <footer className='relative border-t border-white/10 bg-black/30 backdrop-blur-xl'>
      <div className='mx-auto max-w-6xl px-4 py-10'>
        <div className='flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='grid h-9 w-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10'>
                <Calendar className='h-5 w-5 text-emerald-300' />
              </div>
              <div className='text-sm font-semibold text-zinc-100'>{productName}</div>
            </div>
            <p className='mt-3 max-w-sm text-sm text-zinc-400'>
              Modern scheduling for developers, consultants, and teams who want clean UX.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-8 text-sm sm:grid-cols-3'>
            <div className='space-y-2'>
              <div className='text-zinc-200'>Product</div>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#features'>
                Features
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#pricing'>
                Pricing
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#demo'>
                Demo
              </a>
            </div>
            <div className='space-y-2'>
              <div className='text-zinc-200'>Developers</div>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                API
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                Webhooks
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                Self-hosting
              </a>
            </div>
            <div className='space-y-2'>
              <div className='text-zinc-200'>Company</div>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                Security
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                Privacy
              </a>
              <a className='block text-zinc-400 hover:text-zinc-200' href='#'>
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className='mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            © {new Date().getFullYear()} {productName}. All rights reserved.
          </div>
          <div className='flex items-center gap-4'>
            <a className='hover:text-zinc-300' href='#'>
              Terms
            </a>
            <a className='hover:text-zinc-300' href='#'>
              Privacy
            </a>
            <a className='hover:text-zinc-300' href='#'>
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
