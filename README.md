# a2a-demo

Minimal Agent2Agent (A2A) demo project.

## Layout

- `agent-card/agent-card.json`: discovery metadata (`/.well-known/agent-card.json`)
- `src/server.ts`: Fastify entrypoint
- `src/transport/`: JSON-RPC + REST handlers
- `src/store/`: SQLite TaskStore and schema
- `src/auth/`: API key guard
- `src/stream/`: SSE helper
- `src/client/`: client-side placeholders
- `tests/`: contract and e2e tests

## Run

```bash
npm install
npm run build
npm test
```
