import { addDays } from './calendar';

// Package C (operator decision of 2026-11-20): the series restarts after the
// number of days the operator sets on the settings page (`restartAfterDays`,
// configuration schema 3). The running series starts with its first archived
// work and ends that many days later. On the restart date the daily run
// deletes every work of the series and makes generation 1 of the next one in
// the same archive commit. Missed runs are not caught up: days of the old
// series that were never made stay missing, and a whole series without any
// run is skipped. Favourites live outside the archive and stay untouched.
// Pure: shared by the daily run, the data validation and the operator page.

/**
 * First work date of the next series. `start` is the first work of the
 * running series and `next` its next work date; while the archive is empty
 * both are the configured series start. Never before `next`, so a shorter
 * setting never reaches back into works that were already made.
 */
export function restartDate(start: string, next: string, days: number) {
  const end = addDays(start, days);
  return end > next ? end : next;
}

/**
 * Start of the series a run due through `lastDue` has to begin, or `null`
 * while the running series continues. Whole series without a run are
 * skipped instead of being made and deleted again.
 */
export function restartFor(
  start: string,
  next: string,
  days: number,
  lastDue: string,
) {
  let restart = restartDate(start, next, days);
  if (restart > lastDue) return null;
  while (addDays(restart, days) <= lastDue) restart = addDays(restart, days);
  return restart;
}

/** The running series: first and last archived work, or the configured start while the archive is empty. */
export type RunningSeries = { start: string | null; last: string | null };
export function runningSeries(
  ids: readonly string[],
  configured: string | null,
): RunningSeries {
  if (!ids.length) return { start: configured, last: null };
  const sorted = [...ids].sort();
  return { start: sorted[0]!, last: sorted.at(-1)! };
}

/** Next restart date as the operator pages show it, or `null` without restart. */
export function nextRestart(series: RunningSeries, days: number | null) {
  if (days === null || series.start === null) return null;
  return restartDate(
    series.start,
    series.last ? addDays(series.last, 1) : series.start,
    days,
  );
}
