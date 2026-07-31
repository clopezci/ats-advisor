const KEY = "ats_cv_versions";

export type CvVersion = {
  id: string;
  name: string;
  text: string;
  updatedAt: number;
};

export function listCvVersions(): CvVersion[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCvVersion(name: string, text: string) {
  const all = listCvVersions();
  const item: CvVersion = {
    id: `cv_${Date.now()}`,
    name,
    text,
    updatedAt: Date.now(),
  };
  all.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)));
  return item;
}

export function deleteCvVersion(id: string) {
  localStorage.setItem(KEY, JSON.stringify(listCvVersions().filter((c) => c.id !== id)));
}
