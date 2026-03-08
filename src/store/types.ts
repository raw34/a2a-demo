export type TaskState = 'submitted' | 'working' | 'completed' | 'failed' | 'canceled';

export interface TaskRecord {
  id: string;
  contextId: string | null;
  state: TaskState;
  inputText: string;
  outputText: string | null;
  createdAt: string;
  updatedAt: string;
  canceled: boolean;
}

export interface CreateTaskInput {
  id: string;
  contextId?: string;
  inputText: string;
}

export interface TaskStore {
  createTask(input: CreateTaskInput): TaskRecord;
  getTask(id: string): TaskRecord | null;
  listTasks(limit?: number): TaskRecord[];
  completeTask(id: string, outputText: string): TaskRecord | null;
  cancelTask(id: string): TaskRecord | null;
}
