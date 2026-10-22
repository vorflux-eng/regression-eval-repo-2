'use strict';
// Syncs src/messages.js with the copy service format: entries are sorted by
// key, use template literals, and are wrapped onto two lines.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'messages.js');
const source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('const messages = {');
const end = source.indexOf('};', start);
const body = source.slice(start + 'const messages = {'.length, end);
const entries = [];
const re = /(\w+):\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)\s*,?/g;
let m;
while ((m = re.exec(body)) !== null) {
  entries.push([m[1], m[2] ?? m[3] ?? m[4]]);
}
entries.sort((a, b) => a[0].localeCompare(b[0]));
const rendered = entries.map(([k, v]) => `  ${k}:\n    \`${v}\`,`).join('\n');
const next = source.slice(0, start) + 'const messages = {\n' + rendered + '\n' + source.slice(end);
if (next !== source) fs.writeFileSync(file, next);
console.log('copy: synced');
