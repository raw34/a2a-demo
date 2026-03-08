import type { FastifyReply } from 'fastify';

export function writeSseEvent(reply: FastifyReply, event: unknown) {
  reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
}
