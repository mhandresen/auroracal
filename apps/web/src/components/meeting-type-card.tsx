import { Link } from "@tanstack/react-router";

type MeetingTypeCardProps = {
  title: string;
  description?: string;
  duration: string;
  href: string;
};

export function MeetingTypeCard({ title, description, duration, href }: MeetingTypeCardProps) {
  return (
    <Link
      to={href}
      className='
        group block rounded-xl border border-black/10 dark:border-white/10
        bg-black/5 dark:bg-white/5
        px-5 py-4
        transition
        hover:bg-black/10 dark:hover:bg-white/10
        hover:border-black/20 dark:hover:border-white/20
      '
    >
      <div className='flex items-center justify-between gap-4'>
        {/* Left */}
        <div className='min-w-0'>
          <h3 className='text-base font-medium text-dark-900 dark:text-white'>{title}</h3>
          {description ? <p className='mt-1 text-sm text-dark-600 dark:text-white/60'>{description}</p> : null}
          <p className='mt-1 text-sm text-black/60 dark:text-white/60'>{duration} • Online meeting</p>
        </div>

        {/* Right */}
        <div className='flex items-center gap-3 shrink-0'>
          <span className='rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-sm text-dark-700 dark:text-white/70'>
            {duration}
          </span>

          <span
            className='
              text-sm font-medium text-primary
              opacity-0 translate-x-1
              transition
              group-hover:opacity-100 group-hover:translate-x-0
            '
          >
            Book →
          </span>
        </div>
      </div>
    </Link>
  );
}
