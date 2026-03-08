# PNPM Native Build Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 通过 pnpm build-script allowlist 修复 `better-sqlite3` native binding 构建问题，确保 `pnpm install && pnpm build && pnpm test` 可稳定通过并推送迁移结果。

**Architecture:** 本次不改业务代码路径，仅调整仓库级包管理配置，保证 `pnpm` 在安装阶段为 `better-sqlite3` 与 `esbuild` 执行必要脚本。验证流程覆盖安装、构建、测试三个环节，最终提交并推送。

**Tech Stack:** Node.js >= 20、TypeScript (ESM)、Fastify、SQLite (`better-sqlite3`)、pnpm 10。

---

### Task 1: 配置 pnpm native build allowlist

**Files:**
- Create: `.npmrc`
- Create: `pnpm-workspace.yaml`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Delete: `package-lock.json`

**Step 1: 写入 allowlist 配置**
- 在 `.npmrc` 增加：`onlyBuiltDependencies=better-sqlite3,esbuild`。
- 运行 `pnpm approve-builds` 并选择 `better-sqlite3` 与 `esbuild`，生成 `pnpm-workspace.yaml` 的 `allowBuilds`。

**Step 2: 重新安装依赖并触发构建**
Run: `pnpm install`
Expected: 安装完成，无 `better_sqlite3.node` 缺失相关报错。

**Step 3: 验证 native binding 落地**
Run: `find node_modules -path '*better-sqlite3*' -name 'better_sqlite3.node'`
Expected: 至少返回一个 `.node` 文件路径。

### Task 2: 构建与测试验证

**Files:**
- Test: `tests/**/*.test.ts`

**Step 1: 执行构建**
Run: `pnpm build`
Expected: `tsc` 退出码 0。

**Step 2: 执行测试**
Run: `pnpm test`
Expected: 所有测试通过（0 fail）。

### Task 3: 提交与推送

**Files:**
- `.npmrc`
- `pnpm-workspace.yaml`
- `package.json`
- `pnpm-lock.yaml`
- `package-lock.json` (deleted)
- `docs/plans/2026-03-08-pnpm-migration-native-build-design.md`
- `docs/plans/2026-03-08-pnpm-migration-native-build-plan.md`

**Step 1: 检查变更**
Run: `git status --short`
Expected: 仅包含本次迁移相关文件。

**Step 2: 提交代码**
Run:
```bash
git add .npmrc package.json pnpm-lock.yaml package-lock.json docs/plans/2026-03-08-pnpm-migration-native-build-plan.md
git commit -m "chore: finalize pnpm migration and native build config"
```
Expected: 提交成功。

**Step 3: 推送远端**
Run: `git push origin main`
Expected: 推送成功到 `raw34/a2a-demo`。
