export async function authorizedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg = data?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
