# AGENTS Guidelines

## Workflow Constraint (Mandatory)
For any feature or behavior change, two planning documents are required before implementation:

1. Design document: `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. Implementation plan: `docs/plans/YYYY-MM-DD-<topic>-plan.md`

Do not start coding before the design is approved and the implementation plan is written.

## Superpowers Standard Flow (Mandatory)
Follow this exact order:

1. `using-superpowers`: invoke relevant skills before any action.
2. `brainstorming`: complete context exploration, clarifications, 2-3 approaches, and design approval.
3. Commit design doc (`*-design.md`) before implementation.
4. `writing-plans`: produce implementation plan with task-level verification steps.
5. Ask user to choose execution mode:
   - Subagent-Driven (same session)
   - Parallel Session (`executing-plans`)
6. Execute strictly by approved plan; do not mix proposal and implementation in one step.
7. `verification-before-completion`: run fresh verification commands before any completion claim.

## Plan Document Requirements
- Plan file must include:
  - Goal
  - Architecture
  - Tech Stack
  - Explicit task breakdown with file paths
  - Verification command per task
- Use deterministic naming:
  - `docs/plans/YYYY-MM-DD-<topic>-design.md`
  - `docs/plans/YYYY-MM-DD-<topic>-plan.md`

## Current Stack Baseline
- Runtime: Node.js >= 20
- Language: TypeScript (ESM)
- Web framework: Fastify
- Storage: SQLite
