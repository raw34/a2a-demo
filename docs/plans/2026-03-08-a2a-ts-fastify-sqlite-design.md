# A2A TS Fastify SQLite 设计文档

## 目标
构建一个可运行的 A2A PoC 服务，外部兼容 v0.3，内部采用统一任务抽象，并支持后续扩展。

## 技术选型
- TypeScript + Fastify
- SQLite 作为首版存储
- API Key 作为首版认证

## 范围
- `message/send`
- `tasks/get`
- `tasks/list`
- `tasks/cancel`
- SSE 流式更新

## 架构思路
- 传输层：处理 v0.3 对外协议
- 领域层：统一任务状态机
- 存储层：`TaskStore` 接口 + SQLite 实现

## 非目标
- 暂不做多语言双实现
- 暂不做 Postgres 与分布式部署
