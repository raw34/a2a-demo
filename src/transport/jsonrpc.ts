import type { FastifyInstance } from 'fastify';

import type { TaskStore } from '../store/types.js';
import { extractInputText, toV03Task } from './mapper.js';

interface JsonRpcReq {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function genTaskId() {
  return `task_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function registerJsonRpc(app: FastifyInstance, store: TaskStore) {
  app.post('/a2a/jsonrpc', async (req, reply) => {
    const body = req.body as JsonRpcReq;
    const id = body?.id ?? null;

    if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
      return reply.code(400).send(jsonRpcError(id, -32600, 'Invalid Request'));
    }

    const params = body.params ?? {};

    switch (body.method) {
      case 'message/send': {
        const message = params.message;
        const contextId = typeof params.contextId === 'string' ? params.contextId : undefined;
        const task = store.createTask({
          id: genTaskId(),
          contextId,
          inputText: extractInputText(message)
        });
        const completed = store.completeTask(task.id, `echo: ${task.inputText || 'ok'}`) ?? task;
        return reply.send({ jsonrpc: '2.0', id, result: toV03Task(completed) });
      }

      case 'tasks/get': {
        const taskId = String(params.id ?? '');
        const task = store.getTask(taskId);
        if (!task) {
          return reply.code(404).send(jsonRpcError(id, -32001, 'Task not found'));
        }
        return reply.send({ jsonrpc: '2.0', id, result: toV03Task(task) });
      }

      case 'tasks/list': {
        const limit = typeof params.limit === 'number' ? params.limit : 50;
        const tasks = store.listTasks(limit).map(toV03Task);
        return reply.send({ jsonrpc: '2.0', id, result: { tasks } });
      }

      case 'tasks/cancel': {
        const taskId = String(params.id ?? '');
        const task = store.cancelTask(taskId);
        if (!task) {
          return reply.code(404).send(jsonRpcError(id, -32001, 'Task not found'));
        }
        return reply.send({ jsonrpc: '2.0', id, result: toV03Task(task) });
      }

      default:
        return reply.code(404).send(jsonRpcError(id, -32601, 'Method not found'));
    }
  });
}
