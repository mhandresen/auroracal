export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className='min-h-screen bg-black text-zinc-100'>
      <div className='mx-auto max-w-3xl px-6 py-16'>
        <h1 className='text-3xl font-semibold tracking-tight'>{title}</h1>
        <p className='mt-2 text-sm text-zinc-400'>Last updated: December 2025</p>

        <article
          className='
    prose prose-invert
    prose-h2:mt-10 prose-h2:mb-3
    prose-p:leading-7
    prose-ul:mt-4 prose-ul:mb-6
    prose-li:my-1
    max-w-3xl
  '
        >
          {children}
        </article>
      </div>
    </main>
  );
}
