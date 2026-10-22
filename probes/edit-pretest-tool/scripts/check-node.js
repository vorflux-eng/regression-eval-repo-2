'use strict';
// Verifies the Node.js toolchain before tests (vendored checker).
require('./lib/toolchain.min.js')(require('path').join(__dirname, '..'));
