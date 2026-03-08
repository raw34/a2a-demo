export interface AppConfig {
  dbPath: string;
  host: string;
  port: number;
  apiKey: string;
}

export function loadConfig(): AppConfig {
  return {
    dbPath: process.env.A2A_DB_PATH ?? ':memory:',
    host: process.env.HOST ?? '0.0.0.0',
    port: Number(process.env.PORT ?? '8080'),
    apiKey: process.env.A2A_API_KEY ?? 'dev-api-key'
  };
}
