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
  };
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
