'use strict';

function handle(req) {
  return { status: 200, body: 'ok:' + req.path };
}

module.exports = { handle };
