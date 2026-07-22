'use strict';

const { greet } = require('./greeting');

// Use the first CLI argument as the name, defaulting to "World".
const name = process.argv[2] || 'World';
console.log(greet(name));
