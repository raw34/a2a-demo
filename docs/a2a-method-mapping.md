# A2A 方法映射（v0.3 -> 内部抽象）

## 映射原则
- 对外采用 v0.3 方法名。
- 对内统一映射为任务命令，避免协议与执行耦合。

## 映射表

- `message/send` -> `createTask + completeTask`
- `tasks/get` -> `getTask`
- `tasks/list` -> `listTasks`
- `tasks/cancel` -> `cancelTask`

## 传输端点
- JSON-RPC: `POST /a2a/jsonrpc`
- REST: `POST /a2a/rest/message/send`
- SSE: `GET /a2a/rest/tasks/:id/stream`

## 认证
- API Key 头：`x-api-key`
- 当前仅保护 `/a2a/*` 路径
