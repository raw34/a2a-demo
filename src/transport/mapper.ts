import type { TaskRecord } from '../store/types.js';

export function extractInputText(message: unknown): string {
  if (!message || typeof message !== 'object') {
    return '';
  }
  const parts = (message as { parts?: Array<{ type?: string; text?: string }> }).parts;
  if (!Array.isArray(parts)) {
    return '';
  }
  return parts
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text!.trim())
    .filter(Boolean)
    .join('\n');
}

export function toV03Task(task: TaskRecord) {
  return {
    id: task.id,
    status: { state: task.state },
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    artifacts: task.outputText
      ? [{ parts: [{ type: 'text', text: task.outputText }] }]
      : []
  };
}
