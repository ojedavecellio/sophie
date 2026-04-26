import type { RitualEntry, RitualMoment } from "./types";

const STORAGE_KEY = "sophie_rituals";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getRituals(): RitualEntry[] {
  if (!canUseStorage()) return [];

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue) as RitualEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRituals(entries: RitualEntry[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function upsertRitualEntry(
  input: Omit<RitualEntry, "id" | "created_at" | "updated_at">,
): RitualEntry {
  const entries = getRituals();
  const now = new Date().toISOString();
  const index = entries.findIndex(
    (entry) => entry.date === input.date && entry.moment === input.moment,
  );

  if (index >= 0) {
    const updatedEntry: RitualEntry = {
      ...entries[index],
      ...input,
      updated_at: now,
    };
    entries[index] = updatedEntry;
    saveRituals(entries);
    return updatedEntry;
  }

  const newEntry: RitualEntry = {
    ...input,
    id: Date.now().toString(),
    created_at: now,
    updated_at: now,
  };

  entries.push(newEntry);
  saveRituals(entries);
  return newEntry;
}

export function getEntryForDateMoment(
  entries: RitualEntry[],
  date: string,
  moment: RitualMoment,
): RitualEntry | undefined {
  return entries.find((entry) => entry.date === date && entry.moment === moment);
}
