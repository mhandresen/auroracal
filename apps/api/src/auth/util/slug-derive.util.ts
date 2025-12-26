function baseFromName(name?: string) {
  if (!name) return null;
  return name.trim();
}

function baseFromEmail(email: string) {
  return email.split('@')[0];
}

function baseFromNameOrEmail(name: string | undefined, email: string) {
  return name?.trim() ? name.trim() : baseFromEmail(email);
}

export function defaultTenantName(name: string | undefined, email: string) {
  const base = baseFromNameOrEmail(name, email);
  return `${base}'s workspace`;
}

export function deriveBaseSlug(opts: { name?: string; email: string }) {
  return baseFromName(opts.name) ?? baseFromEmail(opts.email) ?? 'user';
}
