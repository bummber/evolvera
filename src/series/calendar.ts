import { workDateSchema } from '../art/schema/config';

// Effective-date policy: existing artwork dates keep their original schedule.
export const scheduleChangeDate = '2026-11-06';
export const dailyTime = '01:17';
export const dailyTimezone = 'Europe/Berlin';
export function scheduledTime(id: string) {
  workDateSchema.parse(id);
  return id < scheduleChangeDate ? '04:00' : dailyTime;
}
// Same policy for titles: works dated before the change keep lexicon 0.1.0.
export const lexiconChangeDate = '2026-11-14';
export function lexiconVersionFor(id: string) {
  workDateSchema.parse(id);
  return id < lexiconChangeDate ? ('0.1.0' as const) : ('0.2.0' as const);
}
// EP-01, operator decision 1: dated generator change inside the running
// series. `null` means not activated: every work date keeps generator 0.2.0.
// A date is set only with the operator's explicit approval of the activation
// and must lie after the last archived work.
export const generatorChangeDate: string | null = null;
export function generatorVersionFor(
  id: string,
  changeDate: string | null = generatorChangeDate,
) {
  workDateSchema.parse(id);
  if (changeDate !== null) workDateSchema.parse(changeDate);
  return changeDate !== null && id >= changeDate
    ? ('0.3.0' as const)
    : ('0.2.0' as const);
}
export function addDay(id: string) {
  workDateSchema.parse(id);
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
export function berlinDateTime(value: string) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: dailyTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(value));
}
export function cycleDate(now: string) {
  const local = berlinDateTime(now);
  const id = local.slice(0, 10);
  if (local >= `${id} ${scheduledTime(id)}:00`) return id;
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
export function scheduledFor(id: string) {
  const time = scheduledTime(id);
  // 01:17 precedes both DST transitions. At 00:00 UTC Berlin still has the
  // offset of that local 01:17; the historical 04:00 is after the transition.
  const probe = time === dailyTime ? '00:00' : '04:00';
  const offset = new Intl.DateTimeFormat('en', {
    timeZone: dailyTimezone,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(new Date(`${id}T${probe}:00Z`))
    .find((part) => part.type === 'timeZoneName')!.value;
  const hours = Number(offset.replace('GMT', ''));
  return `${id}T${time}:00+${String(hours).padStart(2, '0')}:00`;
}
export function isCatchUp(workDate: string, runStartedAt: string) {
  return Date.parse(runStartedAt) >= Date.parse(scheduledFor(addDay(workDate)));
}
