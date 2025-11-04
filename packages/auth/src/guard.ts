export function isAllowlisted(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const allowlist = (process.env.ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  
  return allowlist.includes(email.toLowerCase());
}

export function requireStaff(email?: string | null): void {
  if (!isAllowlisted(email)) {
    throw new Error("Access denied: not allowlisted");
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
