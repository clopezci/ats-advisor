export type AppSettings = {
  pricing: { carrera: number; plus: number; out09_extra: number; currency: string };
  ai_limits: {
    free_ats_per_day: number;
    out09_included_carrera: number;
    out09_included_plus: number;
    quality_threshold: number;
  };
  features: { ads: boolean; whatsapp: boolean; telegram: boolean };
  promotions: { name: string; percent: number; amount: number; starts: string; ends: string }[];
};

const g = globalThis as unknown as { __atsSettings?: AppSettings };

export function defaultSettings(): AppSettings {
  return {
    pricing: { carrera: 79000, plus: 99000, out09_extra: 22000, currency: "COP" },
    ai_limits: {
      free_ats_per_day: 5,
      out09_included_carrera: 1,
      out09_included_plus: 2,
      quality_threshold: 0.72,
    },
    features: { ads: true, whatsapp: false, telegram: true },
    promotions: [],
  };
}

export function readSettings(): AppSettings {
  return g.__atsSettings ? { ...defaultSettings(), ...g.__atsSettings } : defaultSettings();
}

export function writeSettings(settings: AppSettings) {
  g.__atsSettings = settings;
}
