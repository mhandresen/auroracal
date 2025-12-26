interface PublicBookingLayoutProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function PublicBookingLayout({ children, maxWidth = "xl" }: PublicBookingLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
  };

  return (
    <main className='relative min-h-screen w-full bg-white dark:bg-dark-100 bg-grid-black/6 dark:bg-grid-white/4 flex items-center justify-center overflow-hidden'>
      {/* Background effects */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.75))] dark:bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.85))]' />

      {/* Content */}
      <section className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} px-6 py-16`}>{children}</section>
    </main>
  );
}
