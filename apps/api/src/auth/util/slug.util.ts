function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

function rand4() {
  return Math.random().toString(36).slice(2, 6);
}

export async function ensureUniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
) {
  const clean = slugify(base);

  if (!clean) throw new Error('Invalid slug');

  if (!(await isTaken(clean))) return clean;

  for (let i = 2; i <= 20; i++) {
    const candidate = `${clean}-${i}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  while (true) {
    const candidate = `${clean}-${rand4()}`;
    if (!(await isTaken(candidate))) return candidate;
  }
}
