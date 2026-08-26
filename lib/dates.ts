import { WeekContent, WeekState } from './types';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isPlaceholderDate(value: string | undefined | null): boolean {
  if (!value) return true;
  return !ISO_DATE_RE.test(value);
}

export function parseDate(value: string | undefined | null): Date | null {
  if (isPlaceholderDate(value)) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: string | undefined | null): string {
  const d = parseDate(value);
  if (!d) return 'To be announced';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(value: string | undefined | null): string {
  if (!value || value === 'TBD') return 'To be announced';
  return value;
}

export function displayOrTBD(value: string | undefined | null): string {
  if (!value || value === 'TBD') return 'To be announced';
  return value;
}

export function venueLine(venue: { name: string; address: string }): string {
  if (isPlaceholderVenueField(venue.name)) return 'To be announced';
  return isPlaceholderVenueField(venue.address) ? venue.name : `${venue.name}, ${venue.address}`;
}

function isPlaceholderVenueField(value: string): boolean {
  return !value || value === 'TBD';
}

export function getWeekState(sessionDate: string | undefined | null, today: Date = new Date()): WeekState {
  const d = parseDate(sessionDate);
  if (!d) return 'upcoming';
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sessionMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (sessionMidnight.getTime() === todayMidnight.getTime()) return 'current';
  return sessionMidnight < todayMidnight ? 'past' : 'upcoming';
}

export type CohortPhase = 'pre-start' | 'during' | 'post-end';

export interface CohortStatus {
  phase: CohortPhase;
  currentWeek: WeekContent | null;
  nextWeek: WeekContent | null;
}

export function getCohortStatus(weeks: WeekContent[], today: Date = new Date()): CohortStatus {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const withRealDates = weeks
    .map((w) => ({ week: w, date: parseDate(w.frontmatter.sessionDate) }))
    .filter((w): w is { week: WeekContent; date: Date } => w.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const occurred = withRealDates.filter(({ date }) => date <= todayMidnight);
  const upcoming = withRealDates.filter(({ date }) => date > todayMidnight);

  if (occurred.length === 0) {
    return { phase: 'pre-start', currentWeek: null, nextWeek: upcoming[0]?.week ?? weeks[0] ?? null };
  }
  if (upcoming.length === 0) {
    return { phase: 'post-end', currentWeek: occurred[occurred.length - 1].week, nextWeek: null };
  }
  return { phase: 'during', currentWeek: occurred[occurred.length - 1].week, nextWeek: upcoming[0].week };
}
