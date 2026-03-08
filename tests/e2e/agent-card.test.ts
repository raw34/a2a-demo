import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../../src/server.js';

test('agent card endpoint serves required fields', async () => {
  const app = createServer(':memory:', 'test-key');
  const res = await app.inject({ method: 'GET', url: '/.well-known/agent-card.json' });

  assert.equal(res.statusCode, 200);
  const card = res.json();
  assert.equal(typeof card.name, 'string');
  assert.equal(typeof card.description, 'string');
  assert.equal(typeof card.url, 'string');

  await app.close();
});
