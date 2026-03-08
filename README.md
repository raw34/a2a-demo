# a2a-demo

Minimal Agent2Agent (A2A) demo project.

## Layout

- `agent-card/agent-card.json`: discovery metadata (`/.well-known/agent-card.json`)
- `server/`: A2A server handlers and task lifecycle modules
- `client/`: discovery, send, poll, and stream examples
- `tests/`: contract and e2e tests

## Next Steps

1. Implement `SendMessage` in `src/handlers/sendMessage.ts`
2. Add task store in `src/task/store.ts`
3. Add SSE stream endpoint in `src/streaming/sse.ts`
