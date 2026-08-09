export const EXPERT_SPECIALTIES = [
  { id: "cv", label: "Revisión de CV / ATS" },
  { id: "entrevista", label: "Preparación de entrevistas" },
  { id: "negociacion", label: "Negociación salarial / oferta" },
  { id: "carrera", label: "Orientación de carrera" },
  { id: "bienestar", label: "Bienestar en la transición" },
  { id: "remoto", label: "Empleo remoto / CV EN" },
  { id: "emprendimiento", label: "Freelance / emprendimiento" },
] as const;

export type ExpertSpecialtyId = (typeof EXPERT_SPECIALTIES)[number]["id"];

export function specialtyLabel(id: string) {
  return EXPERT_SPECIALTIES.find((s) => s.id === id)?.label || id;
}
