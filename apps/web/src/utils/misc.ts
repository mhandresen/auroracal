export function looksLikeEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function splitTagline(tagline: string) {
  const parts = (tagline ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) {
    return { first: tagline, rest: "" };
  }
  return {
    first: parts.slice(0, 2).join(" "),
    rest: parts.slice(2).join(" "),
  };
}
