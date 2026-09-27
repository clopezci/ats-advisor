const KEY = "ats_save_choice_v1";

export type SaveChoice = "correo" | "navegador";

export function readSaveChoice(): SaveChoice | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "correo" || v === "navegador") return v;
    return null;
  } catch {
    return null;
  }
}

export function writeSaveChoice(choice: SaveChoice) {
  localStorage.setItem(KEY, choice);
}
