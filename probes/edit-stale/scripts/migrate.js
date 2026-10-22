'use strict';
// Team style codemod: 4-space indentation, double quotes, no semicolons.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src');
let changed = 0;
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith('.js')) continue;
  const file = path.join(dir, name);
  const before = fs.readFileSync(file, 'utf8');
  if (before.startsWith('"use strict"')) continue;
  const after = before
    .split('\n')
    .map((line) => {
      const indent = line.match(/^ */)[0].length;
      let body = line.slice(indent).replace(/'/g, '"');
      if (body.endsWith(';')) body = body.slice(0, -1);
      return ' '.repeat(indent * 2) + body;
    })
    .join('\n');
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}
console.log(`migrate: ok (${changed})`);
