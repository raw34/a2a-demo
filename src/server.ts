import Fastify from "fastify";

export function createServer() {
  const app = Fastify({ logger: true });

  app.get("/healthz", async () => ({ ok: true }));

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  app.listen({ host: "0.0.0.0", port: 8080 }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}
