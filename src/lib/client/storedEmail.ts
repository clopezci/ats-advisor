/** Email del perfil local (para APIs que verifican plan cloud). */
export function storedProfileEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
    return typeof p?.email === "string" ? p.email.trim().toLowerCase() : "";
  } catch {
    return "";
  }
}
