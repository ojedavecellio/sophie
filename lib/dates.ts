const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Argentina/Buenos_Aires",
});

const longDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function getTodayDateKey(date: Date = new Date()): string {
  return dateFormatter.format(date);
}

export function isEveningHour(date: Date = new Date()): boolean {
  return date.getHours() >= 18;
}

export function formatSpanishDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return longDateFormatter.format(date);
}
