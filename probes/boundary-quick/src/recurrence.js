'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDate(y, m, d) {
  return new Date(Date.UTC(y, m, d));
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

// Every `interval` weeks from `start`, `count` occurrences.
function expandWeekly(start, count, interval = 1) {
  const first = new Date(start + 'T00:00:00Z');
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(iso(new Date(first.getTime() + i * interval * 7 * DAY_MS)));
  }
  return out;
}

// Legacy monthly rules, e.g. { weekday: 5, nth: 2 } = second Friday,
// { weekday: 1, nth: -1 } = last Monday. Weekday uses 0=Sunday.
// Months without an nth weekday are skipped.
function nthWeekdayOfMonth(year, month, weekday, nth) {
  if (nth > 0) {
    const first = toUtcDate(year, month, 1);
    const offset = (weekday - first.getUTCDay()) % 7;
    const day = 1 + offset + (nth - 1) * 7;
    return toUtcDate(year, month, day);
  }
  const last = toUtcDate(year, month + 1, 0);
  const offset = (last.getUTCDay() - weekday) % 7;
  return toUtcDate(year, month, last.getUTCDate() - offset);
}

function expandMonthlyByDay(start, rule, count) {
  const first = new Date(start + 'T00:00:00Z');
  let year = first.getUTCFullYear();
  let month = first.getUTCMonth();
  const out = [];
  while (out.length < count) {
    const date = nthWeekdayOfMonth(year, month, rule.weekday, rule.nth);
    if (date >= first) out.push(iso(date));
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return out;
}

module.exports = { expandWeekly, expandMonthlyByDay, nthWeekdayOfMonth };
