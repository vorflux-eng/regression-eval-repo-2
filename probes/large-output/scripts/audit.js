'use strict';
// Static audit for src/. Prints a full per-file report and exits non-zero
// while any finding remains.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src');
let findings = 0;
for (const name of fs.readdirSync(dir).sort()) {
  const text = fs.readFileSync(path.join(dir, name), 'utf8');
  const lines = text.split('\n');
  const fns = lines.filter((l) => l.startsWith('function ')).length;
  console.log(`=== ${name} ===`);
  console.log(`  lines: ${lines.length}   functions: ${fns}   bytes: ${text.length}`);
  lines.forEach((line, idx) => {
    const n = String(idx + 1).padStart(3, ' ');
    let status = 'ok';
    if (/console\.(log|debug)/.test(line)) {
      status = 'FINDING: leftover debug statement';
      findings += 1;
    } else if (line.length > 90) {
      status = 'note: long line';
    }
    console.log(`  ${n}  ${status.padEnd(36, ' ')} ${line.slice(0, 28)}`);
  });
}
console.log('');
console.log(findings ? `audit failed: ${findings} finding(s) in the report above` : 'audit passed');
process.exit(findings ? 1 : 0);
