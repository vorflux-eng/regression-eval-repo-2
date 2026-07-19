#!/usr/bin/env node
'use strict';

const { greet } = require('../src/greeting');

// Pass all CLI args (after node + script) as the name, joined by spaces.
const name = process.argv.slice(2).join(' ');
console.log(greet(name));
