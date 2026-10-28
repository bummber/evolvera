import { workDateSchema } from '../art/schema/config';
export function addDay(id: string) {
  workDateSchema.parse(id);
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
export function cycleDate(now: string) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(now));
  const part = (name: Intl.DateTimeFormatPartTypes) =>
    parts.find((value) => value.type === name)!.value;
  const id = `${part('year')}-${part('month')}-${part('day')}`;
  if (Number(part('hour')) >= 4) return id;
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
export function scheduledFor(id: string) {
  workDateSchema.parse(id);
  const offset = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Berlin',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(new Date(`${id}T04:00:00Z`))
    .find((part) => part.type === 'timeZoneName')!.value;
  const hours = Number(offset.replace('GMT', ''));
  return `${id}T04:00:00+${String(hours).padStart(2, '0')}:00`;
}
