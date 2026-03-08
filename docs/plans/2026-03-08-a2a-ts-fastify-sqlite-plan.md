# A2A TS Fastify SQLite PoC 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 使用 TypeScript + Fastify + SQLite 构建一个可运行的 A2A PoC 服务，外部兼容 v0.3，内部采用 v1 风格抽象。

**Architecture:** 通过兼容层接收 v0.3 请求并映射到内部统一任务/消息模型。任务状态落库 SQLite（通过 `TaskStore` 接口封装），对外提供 JSON-RPC + HTTP 方法，并通过 SSE 输出流式任务更新。

**Tech Stack:** TypeScript、Fastify、SQLite（better-sqlite3 或 sqlite3）、Node test runner + supertest。

---

### Task 1: 项目脚手架与依赖

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/server.ts`
- Create: `src/config.ts`

**Step 1: 先写失败测试**
- Create: `tests/e2e/server-start.test.ts`
- 断言服务可启动，且 `GET /healthz` 返回 `200`。

**Step 2: 运行测试并确认失败**
Run: `npm test -- tests/e2e/server-start.test.ts`
Expected: FAIL（`server.ts` 尚未实现）。

**Step 3: 实现最小服务启动逻辑**
- 创建 Fastify app，并添加 `/healthz` 路由。

**Step 4: 运行测试并确认通过**
Run: `npm test -- tests/e2e/server-start.test.ts`
Expected: PASS。

**Step 5: 提交**
```bash
git add package.json tsconfig.json .gitignore src/server.ts src/config.ts tests/e2e/server-start.test.ts
git commit -m "feat: scaffold fastify a2a service"
```

### Task 2: SQLite 任务存储与表结构

**Files:**
- Create: `src/store/schema.sql`
- Create: `src/store/sqlite.ts`
- Create: `src/store/types.ts`
- Test: `tests/contract/task-store.test.ts`

**Step 1: 先写失败测试**
- 覆盖 `create/get/list/cancel` 状态流转。

**Step 2: 运行测试并确认失败**
Run: `npm test -- tests/contract/task-store.test.ts`
Expected: FAIL（store 未实现）。

**Step 3: 实现最小 TaskStore（SQLite）**
- 表：`tasks`、`messages`、`artifacts`、`task_events`。
- 方法：`createTask`、`getTask`、`listTasks`、`cancelTask`、`appendEvent`。

**Step 4: 运行测试并确认通过**
Run: `npm test -- tests/contract/task-store.test.ts`
Expected: PASS。

**Step 5: 提交**
```bash
git add src/store tests/contract/task-store.test.ts
git commit -m "feat: add sqlite task store"
```

### Task 3: A2A 传输处理（外部 v0.3）

**Files:**
- Create: `src/transport/jsonrpc.ts`
- Create: `src/transport/rest.ts`
- Create: `src/transport/mapper.ts`
- Modify: `src/server.ts`
- Test: `tests/contract/a2a-methods.test.ts`

**Step 1: 先写失败测试**
- 覆盖方法：`message/send`、`tasks/get`、`tasks/list`、`tasks/cancel`。

**Step 2: 运行测试并确认失败**
Run: `npm test -- tests/contract/a2a-methods.test.ts`
Expected: FAIL（handler 未实现）。

**Step 3: 实现最小 handler + mapper**
- 解析 v0.3 请求格式。
- 映射到内部命令并调用 store。

**Step 4: 运行测试并确认通过**
Run: `npm test -- tests/contract/a2a-methods.test.ts`
Expected: PASS。

**Step 5: 提交**
```bash
git add src/transport src/server.ts tests/contract/a2a-methods.test.ts
git commit -m "feat: implement core a2a methods"
```

### Task 4: 流式能力 + 认证

**Files:**
- Create: `src/stream/sse.ts`
- Create: `src/auth/api-key.ts`
- Modify: `src/server.ts`
- Test: `tests/e2e/stream-and-auth.test.ts`

**Step 1: 先写失败测试**
- SSE 能输出任务状态更新。
- 未携带 API Key 的请求被拒绝。

**Step 2: 运行测试并确认失败**
Run: `npm test -- tests/e2e/stream-and-auth.test.ts`
Expected: FAIL。

**Step 3: 实现最小 SSE 与 API Key 中间件**
- API Key 头：`x-api-key`。
- 任务状态变化时推送事件。

**Step 4: 运行测试并确认通过**
Run: `npm test -- tests/e2e/stream-and-auth.test.ts`
Expected: PASS。

**Step 5: 提交**
```bash
git add src/stream src/auth src/server.ts tests/e2e/stream-and-auth.test.ts
git commit -m "feat: add streaming and api key auth"
```

### Task 5: Agent Card 与文档

**Files:**
- Modify: `agent-card/agent-card.json`
- Modify: `README.md`
- Create: `docs/a2a-method-mapping.md`

**Step 1: 先写失败 smoke 测试**
- 测试 `/.well-known/agent-card.json` 可访问且字段齐全。

**Step 2: 运行测试并确认失败**
Run: `npm test -- tests/e2e/agent-card.test.ts`
Expected: FAIL。

**Step 3: 实现 endpoint 与文档**
- 提供 Agent Card 路由。
- 文档说明“外部 v0.3 方法 -> 内部抽象”的映射关系。

**Step 4: 运行全量测试**
Run: `npm test`
Expected: PASS。

**Step 5: 提交**
```bash
git add agent-card README.md docs tests/e2e/agent-card.test.ts
git commit -m "docs: add agent card and protocol mapping"
```

### Task 6: 最终验证与推送

**Files:** 所有改动文件

**Step 1: 最终验证**
Run:
```bash
npm test
npm run lint || true
```
Expected: 测试全部通过。

**Step 2: 推送**
```bash
git push origin main
```
