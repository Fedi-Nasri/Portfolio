import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import vercelApi from "./vercel-api-handler";

let server: ReturnType<typeof createServer>;
let baseUrl = "";

beforeAll(async () => {
  server = createServer(vercelApi);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Vercel API test server did not expose a TCP address");
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  server.close();
  await once(server, "close");
});

describe("Vercel API bridge", () => {
  it("routes an API request into the shared Express/tRPC application", async () => {
    const response = await fetch(`${baseUrl}/api/trpc/auth.me`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("keeps Vercel file-system routes ahead of the SPA fallback", async () => {
    const configPath = path.resolve(import.meta.dirname, "..", "vercel.json");
    const config = JSON.parse(await readFile(configPath, "utf8")) as {
      routes?: Array<{ handle?: string; src?: string; dest?: string }>;
      buildCommand?: string;
    };

    expect(config.buildCommand).toBe("pnpm exec vite build");
    expect(config.routes?.[0]).toEqual({ src: "/api/(.*)", dest: "/api/[...path].js" });
    expect(config.routes?.[1]).toEqual({ handle: "filesystem" });
    expect(config.routes?.at(-1)).toEqual({ src: "/(.*)", dest: "/index.html" });
  });

  it("uses a CommonJS Vercel bundle so Express dependencies can load in Node", async () => {
    const bundlePath = path.resolve(import.meta.dirname, "..", "api", "[...path].js");
    const packagePath = path.resolve(import.meta.dirname, "..", "api", "package.json");
    const bundle = await readFile(bundlePath, "utf8");
    const packageMetadata = JSON.parse(await readFile(packagePath, "utf8")) as { type?: string };

    expect(bundle).toContain("module.exports");
    expect(bundle).not.toContain('Dynamic require of "');
    expect(packageMetadata.type).toBe("commonjs");
  });
});
