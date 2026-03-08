import type { FastifyRequest, FastifyReply } from 'fastify';

export function requireApiKey(expectedApiKey: string) {
  return async function apiKeyGuard(req: FastifyRequest, reply: FastifyReply) {
    if (!req.url.startsWith('/a2a/')) {
      return;
    }

    const provided = req.headers['x-api-key'];
    const value = Array.isArray(provided) ? provided[0] : provided;
    if (!value || value !== expectedApiKey) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  };
}
