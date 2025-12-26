// lib/api.ts
export async function api<T>(url: string, init?: RequestInit & { body?: any }): Promise<T> {
  const headers = new Headers(init?.headers);

  // If body is a plain object, JSON stringify it and set header
  let body = init?.body as any;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body && !isFormData && typeof body === "object") {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(url, { ...init, headers, body });

  if (!res.ok) {
    // Keep your current backend behavior (text errors like "Slot already booked!")
    throw new Error(await res.text());
  }

  // Handle 204 No Content safely
  if (res.status === 204) return undefined as unknown as T;

  return res.json();
}
