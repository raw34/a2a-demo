import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

import type { CreateTaskInput, TaskRecord, TaskStore } from './types.js';

function nowIso() {
  return new Date().toISOString();
}

export class SQLiteTaskStore implements TaskStore {
  private readonly db: Database.Database;

  constructor(dbPath: string, schemaPath?: string) {
    if (dbPath !== ':memory:') {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.db = new Database(dbPath);
    const schema = fs.readFileSync(
      schemaPath ?? new URL('./schema.sql', import.meta.url),
      'utf8'
    );
    this.db.exec(schema);
  }

  createTask(input: CreateTaskInput): TaskRecord {
    const ts = nowIso();
    const stmt = this.db.prepare(`
      INSERT INTO tasks (id, context_id, state, input_text, output_text, canceled, created_at, updated_at)
      VALUES (@id, @contextId, 'submitted', @inputText, NULL, 0, @ts, @ts)
    `);
    stmt.run({
      id: input.id,
      contextId: input.contextId ?? null,
      inputText: input.inputText,
      ts
    });
    return this.getTask(input.id)!;
  }

  getTask(id: string): TaskRecord | null {
    const row = this.db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(id) as Record<string, unknown> | undefined;
    if (!row) {
      return null;
    }
    return this.rowToTask(row);
  }

  listTasks(limit = 50): TaskRecord[] {
    const rows = this.db
      .prepare('SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?')
      .all(limit) as Array<Record<string, unknown>>;
    return rows.map((row) => this.rowToTask(row));
  }

  completeTask(id: string, outputText: string): TaskRecord | null {
    const ts = nowIso();
    const info = this.db
      .prepare("UPDATE tasks SET state = 'completed', output_text = ?, updated_at = ? WHERE id = ?")
      .run(outputText, ts, id);
    if (info.changes === 0) {
      return null;
    }
    return this.getTask(id);
  }

  cancelTask(id: string): TaskRecord | null {
    const ts = nowIso();
    const info = this.db
      .prepare("UPDATE tasks SET state = 'canceled', canceled = 1, updated_at = ? WHERE id = ?")
      .run(ts, id);
    if (info.changes === 0) {
      return null;
    }
    return this.getTask(id);
  }

  close() {
    this.db.close();
  }

  private rowToTask(row: Record<string, unknown>): TaskRecord {
    return {
      id: String(row.id),
      contextId: row.context_id ? String(row.context_id) : null,
      state: String(row.state) as TaskRecord['state'],
      inputText: String(row.input_text ?? ''),
      outputText: row.output_text ? String(row.output_text) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      canceled: Boolean(row.canceled)
    };
  }
}
