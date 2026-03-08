import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../../src/server.js';

test('server starts and /healthz returns 200', async () => {
  const app = createServer(':memory:');
  const res = await app.inject({ method: 'GET', url: '/healthz' });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { ok: true });
  await app.close();
});
