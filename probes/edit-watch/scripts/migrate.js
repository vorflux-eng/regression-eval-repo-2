'use strict';
// Applies pending schema migrations to data/schema.json (vendored migrator).
require('./lib/migrator.min.js')(require('path').join(__dirname, '..'));
