"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { getTodayDateKey, isEveningHour } from "@/lib/dates";
import { getEntryForDateMoment, getRituals, upsertRitualEntry } from "@/lib/storage";
import type { RitualEntry } from "@/lib/types";

type BattleSelection = boolean | null;

export function RitualClient() {
  const [entries, setEntries] = useState<RitualEntry[]>(() => getRituals());
  const [message, setMessage] = useState<string>("");

  const [morningBody, setMorningBody] = useState("");
  const [morningMind, setMorningMind] = useState("");
  const [morningSoul, setMorningSoul] = useState("");

  const [bodyWon, setBodyWon] = useState<BattleSelection>(null);
  const [mindWon, setMindWon] = useState<BattleSelection>(null);
  const [soulWon, setSoulWon] = useState<BattleSelection>(null);
  const [bodyReason, setBodyReason] = useState("");
  const [mindReason, setMindReason] = useState("");
  const [soulReason, setSoulReason] = useState("");

  const now = new Date();
  const todayKey = getTodayDateKey(now);
  const unlockedEvening = isEveningHour(now);
  const morningEntry = useMemo(
    () => getEntryForDateMoment(entries, todayKey, "morning"),
    [entries, todayKey],
  );
  const eveningEntry = useMemo(
    () => getEntryForDateMoment(entries, todayKey, "evening"),
    [entries, todayKey],
  );

  const hasMorning = Boolean(morningEntry);
  const hasEvening = Boolean(eveningEntry);
  const shouldShowEvening = unlockedEvening && hasMorning && !hasEvening;
  const showingMorningForm = !hasMorning;
  const showingEveningForm = shouldShowEvening;
  const momentLabel = showingEveningForm ? "Momento nocturno" : "Momento matutino";

  const handleMorningSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!morningBody.trim() || !morningMind.trim() || !morningSoul.trim()) {
      setMessage("Completá las tres respuestas antes de guardar.");
      return;
    }

    upsertRitualEntry({
      date: todayKey,
      moment: "morning",
      body_answer: morningBody.trim(),
      mind_answer: morningMind.trim(),
      soul_answer: morningSoul.trim(),
    });

    const updatedEntries = getRituals();
    setEntries(updatedEntries);
    setMessage("Ritual de la mañana guardado.");
  };

  const handleEveningSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (bodyWon === null || mindWon === null || soulWon === null) {
      setMessage("Elegí si ganaste o perdiste en cada batalla.");
      return;
    }

    upsertRitualEntry({
      date: todayKey,
      moment: "evening",
      body_won: bodyWon,
      mind_won: mindWon,
      soul_won: soulWon,
      body_reason: bodyReason.trim(),
      mind_reason: mindReason.trim(),
      soul_reason: soulReason.trim(),
    });

    const updatedEntries = getRituals();
    setEntries(updatedEntries);
    setMessage("Ritual completo por hoy.");
  };

  const inputClassName =
    "h-20 w-full resize-none border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-3 text-[16px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-text-primary)]";

  if (hasMorning && hasEvening) {
    return (
      <section className="space-y-10">
        <h1 className="font-[family-name:var(--font-libre-caslon-text)] text-[30px] font-normal">
          Ritual de hoy
        </h1>
        <div className="space-y-6">
          <p className="text-[16px]">Ritual completo por hoy.</p>
          <Link href="/history" className="text-[14px] text-[var(--color-text-secondary)] underline">
            Ver historial
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="text-[14px] text-[var(--color-text-secondary)]">{momentLabel}</p>
        <h1 className="font-[family-name:var(--font-libre-caslon-text)] text-[30px] font-normal">
          Ritual de hoy
        </h1>
      </header>

      {showingMorningForm && (
        <form onSubmit={handleMorningSubmit}>
          <div className="flex flex-col gap-16">
            <div className="space-y-4">
            <label className="text-[13px] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
              Cuerpo
            </label>
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-libre-caslon-text)] text-[24px] font-normal text-[var(--color-text-primary)]">
                ¿Qué hago hoy con mi cuerpo?
              </p>
              <textarea
                required
                value={morningBody}
                onChange={(event) => setMorningBody(event.target.value)}
                className={inputClassName}
                rows={3}
                placeholder="Escribí acá..."
              />
            </div>
          </div>

            <div className="space-y-4">
            <label className="text-[13px] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
              Mente
            </label>
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-libre-caslon-text)] text-[24px] font-normal text-[var(--color-text-primary)]">
                ¿Qué necesita mi mente hoy?
              </p>
              <textarea
                required
                value={morningMind}
                onChange={(event) => setMorningMind(event.target.value)}
                className={inputClassName}
                rows={3}
                placeholder="Escribí acá..."
              />
            </div>
          </div>

            <div className="space-y-4">
            <label className="text-[13px] font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
              Alma
            </label>
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-libre-caslon-text)] text-[24px] font-normal text-[var(--color-text-primary)]">
                ¿Qué voy a honrar hoy?
              </p>
              <textarea
                required
                value={morningSoul}
                onChange={(event) => setMorningSoul(event.target.value)}
                className={inputClassName}
                rows={3}
                placeholder="Escribí acá..."
              />
            </div>
          </div>
          </div>

          <button
            type="submit"
            className="mx-auto mt-12 block w-full rounded-[4px] bg-[var(--color-text-primary)] px-6 py-3 text-[15px] font-medium text-[var(--color-bg)] hover:opacity-90 sm:w-auto"
          >
            Guardar ritual
          </button>
        </form>
      )}

      {hasMorning && !shouldShowEvening && !hasEvening && (
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-[16px]">Ya completaste el ritual de la mañana.</p>
            <p className="text-[14px] text-[var(--color-text-secondary)]">
              La revisión nocturna se habilita a las 18:00.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[13px] uppercase tracking-wide text-[var(--color-text-secondary)]">Cuerpo</p>
              <p className="text-[16px]">{morningEntry?.body_answer}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] uppercase tracking-wide text-[var(--color-text-secondary)]">Mente</p>
              <p className="text-[16px]">{morningEntry?.mind_answer}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] uppercase tracking-wide text-[var(--color-text-secondary)]">Alma</p>
              <p className="text-[16px]">{morningEntry?.soul_answer}</p>
            </div>
          </div>
        </div>
      )}

      {showingEveningForm && (
        <form onSubmit={handleEveningSubmit}>
          <div className="flex flex-col gap-16">
            <EveningQuestion
              label="Cuerpo"
              question="¿Gané la batalla del cuerpo?"
              won={bodyWon}
              reason={bodyReason}
              onWonChange={setBodyWon}
              onReasonChange={setBodyReason}
            />
            <EveningQuestion
              label="Mente"
              question="¿Gané la batalla de la mente?"
              won={mindWon}
              reason={mindReason}
              onWonChange={setMindWon}
              onReasonChange={setMindReason}
            />
            <EveningQuestion
              label="Alma"
              question="¿Gané la batalla del alma?"
              won={soulWon}
              reason={soulReason}
              onWonChange={setSoulWon}
              onReasonChange={setSoulReason}
            />
          </div>

          <button
            type="submit"
            className="mx-auto mt-12 block w-full rounded-[4px] bg-[var(--color-text-primary)] px-6 py-3 text-[15px] font-medium text-[var(--color-bg)] hover:opacity-90 sm:w-auto"
          >
            Guardar revisión
          </button>
        </form>
      )}

      {message && <p className="text-[14px] text-[var(--color-text-secondary)]">{message}</p>}
    </section>
  );
}

type EveningQuestionProps = {
  label: string;
  question: string;
  won: BattleSelection;
  reason: string;
  onWonChange: (value: boolean) => void;
  onReasonChange: (value: string) => void;
};

function EveningQuestion({
  label,
  question,
  won,
  reason,
  onWonChange,
  onReasonChange,
}: EveningQuestionProps) {
  const sharedButtonClass = "rounded-[4px] px-6 py-3 text-[15px] font-medium";

  return (
    <div className="space-y-6">
      <label className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </label>

      <p className="font-[family-name:var(--font-libre-caslon-text)] text-[24px] font-normal text-[var(--color-text-primary)]">
        {question}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onWonChange(true)}
          className={`${sharedButtonClass} ${
            won === true
              ? "bg-[var(--color-text-primary)] text-[var(--color-bg)]"
              : "border border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
          } hover:opacity-90`}
        >
          Gané
        </button>
        <button
          type="button"
          onClick={() => onWonChange(false)}
          className={`${sharedButtonClass} ${
            won === false
              ? "bg-[var(--color-text-primary)] text-[var(--color-bg)]"
              : "border border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
          } hover:opacity-90`}
        >
          Perdí
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          ¿Por qué?
        </label>
        <input
          type="text"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          className="w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-3 text-[16px] outline-none focus:border-[var(--color-text-primary)]"
          placeholder="Opcional"
        />
      </div>
    </div>
  );
}
