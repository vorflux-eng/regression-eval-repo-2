'use strict';

// Week number used on invoices and in the weekly report filenames.
function weekNumber(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return Math.floor(dayOfYear / 7) + 1;
}

function reportName(date) {
  return `report-${date.getUTCFullYear()}-W${String(weekNumber(date)).padStart(2, '0')}.csv`;
}

module.exports = { weekNumber, reportName };
