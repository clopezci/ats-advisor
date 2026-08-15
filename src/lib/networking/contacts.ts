/** CRM unificado de networking (herramienta + cuadernillo). */

const KEY = "ats_network_contacts";
const MIGRATED_KEY = "ats_network_contacts_migrated_v2";

export type ContactStatus =
  | "por_contactar"
  | "enviado"
  | "respondio"
  | "intro"
  | "escrito"
  | "hablado"
  | "seguimiento"
  | "cerrado";

export type ContactCategory =
  | "cercano"
  | "excolega"
  | "exjefe"
  | "puente"
  | "reclutador"
  | "empresa_objetivo"
  | "conector"
  | "aliado"
  | "otro";

export type NetworkContact = {
  id: string;
  name: string;
  company: string;
  role?: string;
  category: ContactCategory;
  channel: string;
  favorAsked?: string;
  status: ContactStatus;
  nextStep: string;
  nextDate?: string;
  lastTouch?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export const CONTACT_STATUS_LABEL: Record<ContactStatus, string> = {
  por_contactar: "Por contactar",
  enviado: "Mensaje enviado",
  escrito: "Mensaje enviado",
  respondio: "Respondió",
  hablado: "Conversamos",
  intro: "Intro / referido",
  seguimiento: "Seguimiento",
  cerrado: "Cerrado",
};

export const CONTACT_CATEGORY_LABEL: Record<ContactCategory, string> = {
  cercano: "Cercano",
  excolega: "Excolega",
  exjefe: "Exjefe / mentor",
  puente: "Puente",
  reclutador: "Reclutador / HH",
  empresa_objetivo: "Empresa objetivo",
  conector: "Conector",
  aliado: "Aliado",
  otro: "Otro",
};

function normalizeStatus(s: string): ContactStatus {
  if (s === "escrito") return "enviado";
  if ((Object.keys(CONTACT_STATUS_LABEL) as string[]).includes(s)) return s as ContactStatus;
  return "por_contactar";
}

export function listContacts(): NetworkContact[] {
  if (typeof window === "undefined") return [];
  tryMigrateFromWorkbook();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map((c: Partial<NetworkContact> & { id: string }) => ({
      id: c.id,
      name: c.name || "",
      company: c.company || "",
      role: c.role,
      category: (c.category as ContactCategory) || "otro",
      channel: c.channel || "linkedin",
      favorAsked: c.favorAsked,
      status: normalizeStatus(String(c.status || "por_contactar")),
      nextStep: c.nextStep || "",
      nextDate: c.nextDate,
      lastTouch: c.lastTouch,
      notes: c.notes,
      createdAt: c.createdAt || Date.now(),
      updatedAt: c.updatedAt || Date.now(),
    }));
  } catch {
    return [];
  }
}

function tryMigrateFromWorkbook() {
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return;
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    const wb = JSON.parse(localStorage.getItem("ats_workbook_v1") || "null");
    const fromWb: unknown[] = Array.isArray(wb?.network?.contacts) ? wb.network.contacts : [];
    if (!Array.isArray(existing)) return;
    const now = Date.now();
    const migrated: NetworkContact[] = [...existing];
    for (const row of fromWb) {
      const c = row as Record<string, string>;
      if (!c?.name?.trim()) continue;
      const dup = migrated.some(
        (m) => m.name.toLowerCase() === c.name.trim().toLowerCase() && m.company === (c.channel || "")
      );
      if (dup) continue;
      migrated.push({
        id: `net_mig_${now}_${Math.random().toString(36).slice(2, 6)}`,
        name: c.name.trim(),
        company: c.channel || c.notes || "—",
        category: (c.category as ContactCategory) || "otro",
        channel: c.channel || "otro",
        favorAsked: c.favorAsked,
        status: normalizeStatus(c.status || "por_contactar"),
        nextStep: c.nextFollowUp ? `Follow-up ${c.nextFollowUp}` : "Contactar",
        nextDate: c.nextFollowUp,
        lastTouch: c.lastTouch,
        notes: c.notes,
        createdAt: now,
        updatedAt: now,
      });
    }
    localStorage.setItem(KEY, JSON.stringify(migrated.slice(0, 200)));
    localStorage.setItem(MIGRATED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function saveContacts(items: NetworkContact[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200)));
}

export function upsertContact(
  input: Omit<NetworkContact, "id" | "createdAt" | "updatedAt"> & { id?: string }
) {
  const all = listContacts();
  const now = Date.now();
  if (input.id) {
    const idx = all.findIndex((c) => c.id === input.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...input, id: input.id, updatedAt: now };
      saveContacts(all);
      return all[idx];
    }
  }
  const item: NetworkContact = {
    id: `net_${now}_${Math.random().toString(36).slice(2, 6)}`,
    name: input.name,
    company: input.company,
    role: input.role,
    category: input.category || "otro",
    channel: input.channel || "linkedin",
    favorAsked: input.favorAsked,
    status: normalizeStatus(input.status),
    nextStep: input.nextStep,
    nextDate: input.nextDate,
    lastTouch: input.lastTouch,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(item);
  saveContacts(all);
  return item;
}

export function deleteContact(id: string) {
  saveContacts(listContacts().filter((c) => c.id !== id));
}

/** Plantillas locales cortas (sin IA). */
export function messageTemplate(
  kind: "reclutador" | "referido" | "followup",
  vars: { name?: string; role?: string; company?: string }
) {
  const n = vars.name || "[Nombre]";
  const r = vars.role || "[rol]";
  const c = vars.company || "[empresa]";
  if (kind === "referido") {
    return [
      `Hola ${n}, espero estés bien.`,
      `Estoy explorando roles de ${r} (idealmente en ${c} / sector afín).`,
      "Si conoces a alguien abriendo esas posiciones, ¿me presentarías?",
      "Te dejo valor en 3 bullets al final si te sirve. ¡Gracias!",
    ].join("\n");
  }
  if (kind === "followup") {
    return [
      `Hola ${n}, retomo por si se te pasó mi nota sobre ${r}.`,
      "Sigo disponible para 15 minutos esta semana. ¡Gracias!",
    ].join("\n");
  }
  return [
    `Hola ${n}, vi la vacante de ${r} en ${c}.`,
    "En mi trayectoria reciente logré [resultado medible] con [método].",
    "¿Tendrías 15 minutos para validar fit?",
    "Adjunto mi LinkedIn. Gracias.",
  ].join("\n");
}
