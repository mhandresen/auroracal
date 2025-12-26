function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);
}

export async function ensureUniqueMeetingTypeSlug(opts: {
  desired: string;
  userId: string;
  isTaken: (slug: string) => Promise<boolean>;
}) {
  const base = slugify(opts.desired);
  if (!base) throw new Error('Invalid slug');

  if (!(await opts.isTaken(base))) return base;

  for (let i = 2; i <= 20; i++) {
    const s = `${base}-${i}`;
    if (!(await opts.isTaken(s))) return s;
  }

  // fallback random-ish suffix
  const rand = () => Math.random().toString(36).slice(2, 6);
  while (true) {
    const s = `${base}-${rand()}`;
    if (!(await opts.isTaken(s))) return s;
  }
}
