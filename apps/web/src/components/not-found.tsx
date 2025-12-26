import { Link } from "@tanstack/react-router";

export function NotFound({
  title = "Page not found",
  message = "This booking page does not exist",
  styled = true,
}: {
  title?: string;
  message?: string;
  styled?: boolean;
}) {
  if (styled) {
    return (
      <main className='min-h-screen bg-white dark:bg-dark-100 grid place-items-center px-6'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-semibold text-black dark:text-white'>{title}</h1>
          <p className='text-black/70 dark:text-white/60'>{message}</p>
          <Link
            to='/'
            className='inline-block mt-4 rounded-lg border border-black/10 dark:border-white/10 px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
          >
            Go home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className='text-center space-y-4'>
      <h1 className='text-2xl font-semibold text-black dark:text-white'>{title}</h1>
      <p className='text-black/70 dark:text-white/60'>{message}</p>
      <Link
        to='/'
        className='inline-block mt-4 rounded-lg border border-black/10 dark:border-white/10 px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
      >
        Go home
      </Link>
    </div>
  );
}
