export type SeatStatus = "invited" | "active" | "completed" | "paused";

export type CompanySeat = {
  id: string;
  name: string;
  email: string;
  status: SeatStatus;
  modulesDone: number;
  invitedAt: number;
  updatedAt: number;
};

export type CompanyOrg = {
  name: string;
  contactEmail: string;
  seatsPurchased: number;
  createdAt: number;
  /** Co-branding ligero */
  brandTagline?: string;
  brandAccent?: string; // hex
  logoDataUrl?: string; // data:image/...;base64
};

const ORG_KEY = "ats_b2b_org";
const SEATS_KEY = "ats_b2b_seats";

export function readOrg(): CompanyOrg | null {
  try {
    return JSON.parse(localStorage.getItem(ORG_KEY) || "null");
  } catch {
    return null;
  }
}

export function writeOrg(org: CompanyOrg) {
  localStorage.setItem(ORG_KEY, JSON.stringify(org));
}

export function listSeats(): CompanySeat[] {
  try {
    return JSON.parse(localStorage.getItem(SEATS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSeats(seats: CompanySeat[]) {
  localStorage.setItem(SEATS_KEY, JSON.stringify(seats));
}

export function addSeatsFromEmails(
  rows: { name: string; email: string }[],
  seatsPurchased: number
): { added: number; skipped: number; reason?: string } {
  const seats = listSeats();
  const remaining = seatsPurchased - seats.length;
  if (remaining <= 0) return { added: 0, skipped: rows.length, reason: "Sin cupos libres" };

  let added = 0;
  let skipped = 0;
  const now = Date.now();
  const existing = new Set(seats.map((s) => s.email.toLowerCase()));

  for (const row of rows) {
    if (added >= remaining) {
      skipped += 1;
      continue;
    }
    const email = row.email.trim().toLowerCase();
    if (!email.includes("@") || existing.has(email)) {
      skipped += 1;
      continue;
    }
    seats.push({
      id: `seat_${now}_${added}`,
      name: row.name.trim() || email.split("@")[0],
      email,
      status: "invited",
      modulesDone: 0,
      invitedAt: now,
      updatedAt: now,
    });
    existing.add(email);
    added += 1;
  }
  saveSeats(seats);
  return { added, skipped };
}

export function updateSeatStatus(id: string, status: SeatStatus) {
  const seats = listSeats().map((s) =>
    s.id === id ? { ...s, status, updatedAt: Date.now() } : s
  );
  saveSeats(seats);
}

export function seatStats(seats: CompanySeat[]) {
  const now = Date.now();
  const daysInProgram = seats.map((s) => Math.max(0, Math.floor((now - s.invitedAt) / 86400000)));
  const avgDays =
    seats.length === 0 ? 0 : Math.round(daysInProgram.reduce((a, d) => a + d, 0) / seats.length);
  const engagement =
    seats.length === 0
      ? 0
      : Math.round(
          seats.reduce((a, s) => {
            const statusScore =
              s.status === "completed" ? 100 : s.status === "active" ? 70 : s.status === "paused" ? 40 : 15;
            const modScore = Math.min(100, s.modulesDone * 12);
            return a + (statusScore * 0.5 + modScore * 0.5);
          }, 0) / seats.length
        );
  return {
    total: seats.length,
    invited: seats.filter((s) => s.status === "invited").length,
    active: seats.filter((s) => s.status === "active").length,
    completed: seats.filter((s) => s.status === "completed").length,
    paused: seats.filter((s) => s.status === "paused").length,
    avgModules:
      seats.length === 0
        ? 0
        : Math.round(seats.reduce((a, s) => a + s.modulesDone, 0) / seats.length),
    avgDaysInProgram: avgDays,
    engagementScore: engagement,
  };
}

/** Alertas agregadas para RH (sin contenido de CV). */
export function rhAlerts(seats: CompanySeat[], purchased: number): string[] {
  const s = seatStats(seats);
  const alerts: string[] = [];
  if (purchased > 0 && s.total / purchased < 0.4) {
    alerts.push("Adopción baja: menos del 40% de cupos invitados.");
  }
  if (s.invited > 0 && s.active + s.completed === 0) {
    alerts.push("Nadie ha activado aún: conviene reenviar recordatorio.");
  }
  if (s.paused > s.active && s.paused > 0) {
    alerts.push("Más personas en pausa que activas: revisa seguimiento.");
  }
  if (s.avgModules < 2 && s.total >= 3) {
    alerts.push("Progreso bajo de módulos: promedio bajo 2 cápsulas.");
  }
  if (s.completed >= Math.max(1, Math.floor(s.total * 0.5))) {
    alerts.push("Buen outcome: ≥50% de la cohorte marcada como completada.");
  }
  return alerts;
}

export function boardSummaryText(orgName: string, seats: CompanySeat[], purchased: number): string {
  const s = seatStats(seats);
  const alerts = rhAlerts(seats, purchased);
  return [
    `ATSAdvisor / LOTIC — Resumen RH (${orgName})`,
    `Fecha: ${new Date().toLocaleString("es-CO")}`,
    `Cupos: ${s.total}/${purchased}`,
    `Estados: invitados ${s.invited} · activos ${s.active} · completados ${s.completed} · pausa ${s.paused}`,
    `Módulos promedio: ${s.avgModules}`,
    `Días promedio en programa: ${s.avgDaysInProgram}`,
    `Engagement score (0–100): ${s.engagementScore}`,
    "",
    "Alertas:",
    ...(alerts.length ? alerts.map((a) => `- ${a}`) : ["- Sin alertas"]),
    "",
    "Privacidad: este reporte no incluye CVs ni respuestas personales.",
  ].join("\n");
}

export function parseInviteCsv(text: string): { name: string; email: string }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,;|\t]/).map((p) => p.trim());
      if (parts.length === 1) return { name: "", email: parts[0] };
      return { name: parts[0], email: parts[1] || parts[0] };
    });
}
