export type RitualMoment = "morning" | "evening";

export type RitualEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  moment: RitualMoment;
  body_answer?: string;
  mind_answer?: string;
  soul_answer?: string;
  body_won?: boolean;
  mind_won?: boolean;
  soul_won?: boolean;
  body_reason?: string;
  mind_reason?: string;
  soul_reason?: string;
  created_at: string;
  updated_at: string;
};
