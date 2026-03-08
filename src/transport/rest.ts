import type { FastifyInstance } from 'fastify';

import type { TaskStore } from '../store/types.js';
import { extractInputText, toV03Task } from './mapper.js';

function genTaskId() {
  return `task_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function registerRest(app: FastifyInstance, store: TaskStore) {
  app.post('/a2a/rest/message/send', async (req) => {
    const body = (req.body ?? {}) as { message?: unknown; contextId?: string };
    const task = store.createTask({
      id: genTaskId(),
      contextId: body.contextId,
      inputText: extractInputText(body.message)
    });
    const completed = store.completeTask(task.id, `echo: ${task.inputText || 'ok'}`) ?? task;
    return toV03Task(completed);
  });

  app.get('/a2a/rest/tasks/:id', async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const task = store.getTask(id);
    if (!task) {
      return reply.code(404).send({ error: 'Task not found' });
    }
    return toV03Task(task);
  });
}
