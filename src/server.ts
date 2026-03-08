import fs from 'node:fs';
import path from 'node:path';
import Fastify from 'fastify';

import { requireApiKey } from './auth/api-key.js';
import { loadConfig } from './config.js';
import { SQLiteTaskStore } from './store/sqlite.js';
import { writeSseEvent } from './stream/sse.js';
import { registerJsonRpc } from './transport/jsonrpc.js';
import { registerRest } from './transport/rest.js';

function loadAgentCard() {
  const p = path.resolve(process.cwd(), 'agent-card/agent-card.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw) as Record<string, unknown>;
}

export function createServer(dbPath = ':memory:', apiKey = 'dev-api-key') {
  const app = Fastify({ logger: true });
  const store = new SQLiteTaskStore(dbPath);

  app.addHook('onRequest', requireApiKey(apiKey));

  app.get('/healthz', async () => ({ ok: true }));

  app.get('/.well-known/agent-card.json', async () => loadAgentCard());

  registerJsonRpc(app, store);
  registerRest(app, store);

  app.get('/a2a/rest/tasks/:id/stream', async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const task = store.getTask(id);
    if (!task) {
      return reply.code(404).send({ error: 'Task not found' });
    }

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    writeSseEvent(reply, { taskId: task.id, state: task.state });
    reply.raw.end();
    return reply;
  });

  app.addHook('onClose', async () => {
    store.close();
  });

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const app = createServer(config.dbPath, config.apiKey);
  app.listen({ host: config.host, port: config.port }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}
