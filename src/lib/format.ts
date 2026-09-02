const MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];


export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`;
}

export function readingLabel(minutes: number): string {
  return `${minutes} min de leitura`;
}
