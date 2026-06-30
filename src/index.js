'use strict';

const { greet } = require('./greeting');

const name = process.argv[2] || process.env.GREET_NAME || 'World';
console.log(greet(name));
