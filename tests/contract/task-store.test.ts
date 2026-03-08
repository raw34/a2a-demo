import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SQLiteTaskStore } from '../../src/store/sqlite.js';

test('task store create/get/list/cancel transitions', () => {
  const store = new SQLiteTaskStore(':memory:');

  const created = store.createTask({ id: 'task_1', inputText: 'hello' });
  assert.equal(created.id, 'task_1');
  assert.equal(created.state, 'submitted');

  const fetched = store.getTask('task_1');
  assert.ok(fetched);
  assert.equal(fetched?.inputText, 'hello');

  const completed = store.completeTask('task_1', 'done');
  assert.equal(completed?.state, 'completed');
  assert.equal(completed?.outputText, 'done');

  const listed = store.listTasks();
  assert.equal(listed.length, 1);

  const canceled = store.cancelTask('task_1');
  assert.equal(canceled?.state, 'canceled');
  assert.equal(canceled?.canceled, true);

  store.close();
});
