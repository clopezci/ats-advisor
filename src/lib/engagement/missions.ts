/** Misiones diarias + XP (gamificación ligera sobre outplacement). */

export type Mission = {
  id: string;
  title: string;
  xp: number;
  href: string;
};

const KEY = "ats_missions_v1";

export function missionsForToday(): Mission[] {
  const day = Math.floor(Date.now() / 86400000);
  const pool: Mission[] = [
    { id: "ats", title: "Analiza 1 CV vs oferta", xp: 20, href: "/ats" },
    { id: "capsule", title: "Completa 1 cápsula OUT", xp: 25, href: "/outplacement/ruta" },
    { id: "network", title: "Registra 1 contacto de networking", xp: 15, href: "/outplacement/networking" },
    { id: "filtro", title: "Practica filtro telefónico", xp: 20, href: "/outplacement/filtro" },
    { id: "star", title: "Ensayo STAR (texto o video)", xp: 25, href: "/outplacement/video-entrevista" },
    { id: "tracker", title: "Actualiza 1 postulación en el tracker", xp: 10, href: "/tracker" },
    { id: "riasec", title: "Revisa o completa assessment RIASEC", xp: 15, href: "/outplacement/assessment" },
    { id: "brief", title: "Genera o actualiza Career Brief", xp: 15, href: "/outplacement/career-brief" },
  ];
  // 3 misiones rotativas por día
  const start = day % pool.length;
  return [0, 1, 2].map((i) => pool[(start + i) % pool.length]);
}

export type MissionProgress = {
  day: string;
  done: string[];
  xpTotal: number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function readMissionProgress(): MissionProgress {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || raw.day !== todayKey()) {
      return { day: todayKey(), done: [], xpTotal: Number(localStorage.getItem("ats_xp_total") || 0) };
    }
    return {
      day: raw.day,
      done: raw.done || [],
      xpTotal: Number(localStorage.getItem("ats_xp_total") || raw.xpTotal || 0),
    };
  } catch {
    return { day: todayKey(), done: [], xpTotal: 0 };
  }
}

export function completeMission(mission: Mission): MissionProgress {
  const prog = readMissionProgress();
  if (prog.done.includes(mission.id)) return prog;
  const done = [...prog.done, mission.id];
  const xpTotal = prog.xpTotal + mission.xp;
  localStorage.setItem(KEY, JSON.stringify({ day: todayKey(), done }));
  localStorage.setItem("ats_xp_total", String(xpTotal));
  return { day: todayKey(), done, xpTotal };
}

export function xpRank(xp: number) {
  if (xp >= 500) return "Especialista";
  if (xp >= 250) return "Avanzado";
  if (xp >= 100) return "En marcha";
  if (xp >= 40) return "Aprendiz";
  return "Inicio";
}
