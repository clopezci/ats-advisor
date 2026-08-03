const KEY = "ats_network_contacts";

export type ContactStatus = "por_contactar" | "escrito" | "hablado" | "seguimiento" | "cerrado";

export type NetworkContact = {
  id: string;
  name: string;
  company: string;
  role?: string;
  channel: "linkedin" | "email" | "otro";
  status: ContactStatus;
  nextStep: string;
  nextDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export const CONTACT_STATUS_LABEL: Record<ContactStatus, string> = {
  por_contactar: "Por contactar",
  escrito: "Mensaje enviado",
  hablado: "Conversamos",
  seguimiento: "Seguimiento",
  cerrado: "Cerrado",
};

export function listContacts(): NetworkContact[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
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
    channel: input.channel,
    status: input.status,
    nextStep: input.nextStep,
    nextDate: input.nextDate,
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

/** Plantillas locales (sin IA). */
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
