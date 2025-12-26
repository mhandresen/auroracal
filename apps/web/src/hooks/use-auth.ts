import { useQuery } from "@tanstack/react-query";

async function fetchMe() {
  const res = await fetch("/api/v1/auth/me", { credentials: "include" });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error("Auth check failed");
  }

  return res.json();
}

export function useAuth() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    user: query.data?.user ?? null,
    tenantId: query.data?.tenantId ?? null,
    role: query.data?.role ?? null,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
