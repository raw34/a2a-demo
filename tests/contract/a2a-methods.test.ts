import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../../src/server.js';

test('jsonrpc message/send + tasks/get/list/cancel', async () => {
  const app = createServer(':memory:');

  const sendRes = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    headers: { 'x-api-key': 'dev-api-key' },
    payload: {
      jsonrpc: '2.0',
      id: '1',
      method: 'message/send',
      params: { message: { parts: [{ type: 'text', text: 'ping' }] } }
    }
  });
  assert.equal(sendRes.statusCode, 200);
  const task = sendRes.json().result;
  assert.ok(task.id);

  const getRes = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    headers: { 'x-api-key': 'dev-api-key' },
    payload: { jsonrpc: '2.0', id: '2', method: 'tasks/get', params: { id: task.id } }
  });
  assert.equal(getRes.statusCode, 200);

  const listRes = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    headers: { 'x-api-key': 'dev-api-key' },
    payload: { jsonrpc: '2.0', id: '3', method: 'tasks/list', params: { limit: 10 } }
  });
  assert.equal(listRes.statusCode, 200);
  assert.ok(Array.isArray(listRes.json().result.tasks));

  const cancelRes = await app.inject({
    method: 'POST',
    url: '/a2a/jsonrpc',
    headers: { 'x-api-key': 'dev-api-key' },
    payload: { jsonrpc: '2.0', id: '4', method: 'tasks/cancel', params: { id: task.id } }
  });
  assert.equal(cancelRes.statusCode, 200);
  assert.equal(cancelRes.json().result.status.state, 'canceled');

  await app.close();
});
