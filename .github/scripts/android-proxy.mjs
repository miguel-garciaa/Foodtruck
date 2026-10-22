// TLS terminates only on runner loopback; Android trusts this ephemeral public certificate.
import { createServer } from "node:https";
import { request } from "node:http";
import { readFileSync } from "node:fs";

createServer(
  {
    key: readFileSync(".private/ci-tls/key.pem"),
    cert: readFileSync(".private/ci-tls/cert.pem"),
  },
  (incoming, outgoing) => {
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: 8080,
        path: incoming.url,
        method: incoming.method,
        headers: {
          ...incoming.headers,
          host: "localhost",
          "x-forwarded-proto": "https",
        },
      },
      (response) => {
        outgoing.writeHead(response.statusCode, response.headers);
        response.pipe(outgoing);
      },
    );
    upstream.setTimeout(15000, () => upstream.destroy());
    upstream.on("error", () => {
      if (!outgoing.headersSent) outgoing.writeHead(502);
      outgoing.end();
    });
    incoming.pipe(upstream);
  },
).listen(8443, "127.0.0.1");
