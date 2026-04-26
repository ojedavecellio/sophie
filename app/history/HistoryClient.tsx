"use client";

import { formatSpanishDate, getTodayDateKey } from "@/lib/dates";
import { getRituals } from "@/lib/storage";
import type { RitualEntry } from "@/lib/types";

type GroupedEntries = {
  date: string;
  morning?: RitualEntry;
  evening?: RitualEntry;
};

export function HistoryClient() {
  const today = getTodayDateKey();
  const entries = getRituals().filter((entry) => entry.date !== today);

  const groupedByDate = entries.reduce<Record<string, GroupedEntries>>((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = { date: entry.date };
    }

    if (entry.moment === "morning") {
      acc[entry.date].morning = entry;
    }

    if (entry.moment === "evening") {
      acc[entry.date].evening = entry;
    }

    return acc;
  }, {});

  const orderedGroups = Object.values(groupedByDate).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="text-[14px] text-[var(--color-text-secondary)]">Registro previo</p>
        <h1 className="font-[family-name:var(--font-libre-caslon-text)] text-[30px] font-normal">Historial</h1>
      </header>

      {orderedGroups.length === 0 && (
        <div className="border border-[var(--color-border)] p-6">
          <p className="text-[16px]">Todavía no hay rituales anteriores.</p>
        </div>
      )}

      <div className="space-y-10">
        {orderedGroups.map((group) => (
          <article key={group.date} className="space-y-6 border border-[var(--color-border)] p-6">
            <h2 className="font-[family-name:var(--font-libre-caslon-text)] text-[28px] font-normal">
              {formatSpanishDate(group.date)}
            </h2>

            {group.morning && (
              <div className="space-y-4">
                <p className="text-[13px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Ritual de la mañana
                </p>
                <p className="text-[16px]">
                  Cuerpo: <span className="text-[var(--color-text-secondary)]">{group.morning.body_answer}</span>
                </p>
                <p className="text-[16px]">
                  Mente: <span className="text-[var(--color-text-secondary)]">{group.morning.mind_answer}</span>
                </p>
                <p className="text-[16px]">
                  Alma: <span className="text-[var(--color-text-secondary)]">{group.morning.soul_answer}</span>
                </p>
              </div>
            )}

            {group.evening ? (
              <div className="space-y-4">
                <p className="text-[13px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Revisión nocturna
                </p>
                <p className="text-[16px]">Cuerpo: {group.evening.body_won ? "ganó" : "perdió"}</p>
                <p className="text-[16px]">Mente: {group.evening.mind_won ? "ganó" : "perdió"}</p>
                <p className="text-[16px]">Alma: {group.evening.soul_won ? "ganó" : "perdió"}</p>
              </div>
            ) : (
              <p className="text-[14px] text-[var(--color-text-secondary)]">Sin revisión nocturna</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
