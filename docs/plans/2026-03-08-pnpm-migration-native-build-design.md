# PNPM Migration Native Build Design

## Goal
修复 `pnpm` 环境下 `better-sqlite3` native binding 缺失导致的测试全挂问题，并保证仓库可稳定执行 `pnpm install && pnpm build && pnpm test`。

## Context
当前仓库已完成 `npm` 到 `pnpm` 的迁移中间态（`packageManager` 与 `pnpm-lock.yaml` 已存在，`package-lock.json` 已移除）。
在 `pnpm test` 时，`better-sqlite3` 报错找不到 `better_sqlite3.node`，表明安装阶段未执行（或未允许执行）native build 脚本。

## Options Considered

### Option A (Recommended): Commit pnpm build-script allowlist in `.npmrc`
- 在仓库级 `.npmrc` 中声明：`onlyBuiltDependencies=better-sqlite3,esbuild`。
- 让 `pnpm` 仅允许这两个依赖在安装时执行 build/install scripts。
- 保持安全收敛（不是全量放开），同时修复 native binding。

### Option B: Force rebuild via `postinstall`
- 在 `package.json` 新增 `postinstall` 执行 `pnpm rebuild better-sqlite3 esbuild`。
- 缺点是语义偏补丁，且与安装行为耦合，维护性较差。

### Option C: Replace SQLite driver
- 替换 `better-sqlite3` 规避 native 构建。
- 改动超出本次迁移目标，不采用。

## Final Design
采用 Option A：
1. 新增 `.npmrc` 并配置 `onlyBuiltDependencies=better-sqlite3,esbuild`。
2. 重新执行 `pnpm install` 触发依赖构建。
3. 通过 `pnpm build`、`pnpm test` 验证迁移结果。
4. 提交并推送 pnpm 迁移变更（`package.json`、`pnpm-lock.yaml`、`.npmrc`、删除 `package-lock.json`）。

## Architecture Impact
- 不改变应用运行架构（Fastify/JSON-RPC/REST/SQLite/SSE/API Key）。
- 仅调整包管理与依赖安装策略，确保 native dependency 在 pnpm 下可复现构建。

## Risk & Mitigation
- Risk: 后续新增 native 依赖仍可能被阻止。
- Mitigation: 新增 native 包时同步更新 `onlyBuiltDependencies`，并在 PR 校验中覆盖 `pnpm install && pnpm test`。

## Success Criteria
- `pnpm install` 无 native binding 缺失。
- `pnpm build` 成功。
- `pnpm test` 全部通过。
- 变更已提交并推送到 `raw34/a2a-demo`。
