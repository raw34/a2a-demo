import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../../src/server.js';

test('request without api key is rejected', async () => {
  const app = createServer(':memory:', 'test-key');
  const res = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    payload: { jsonrpc: '2.0', id: '1', method: 'tasks/list', params: { limit: 10 } }
  });
  assert.equal(res.statusCode, 401);
  await app.close();
});

test('sse endpoint streams task state', async () => {
  const app = createServer(':memory:', 'test-key');

  const sendRes = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    headers: { 'x-api-key': 'test-key' },
    payload: {
      jsonrpc: '2.0',
      id: '1',
      method: 'message/send',
      params: { message: { parts: [{ type: 'text', text: 'ping' }] } }
    }
  });
  const taskId = sendRes.json().result.id;

  const streamRes = await app.inject({
    method: 'GET',
    url: `/a2a/rest/tasks/${taskId}/stream`,
    headers: { 'x-api-key': 'test-key' }
  });

  assert.equal(streamRes.statusCode, 200);
  assert.match(String(streamRes.headers['content-type']), /text\/event-stream/);
  assert.match(streamRes.body, /data:/);

  await app.close();
});
