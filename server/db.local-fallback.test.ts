import { afterEach, describe, expect, it, vi } from "vitest";

const originalDatabaseUrl = process.env.DATABASE_URL;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.DATABASE_URL = originalDatabaseUrl;
  process.env.NODE_ENV = originalNodeEnv;
  vi.resetModules();
});

describe("local development database fallback", () => {
  it("creates an ephemeral PostgreSQL workspace when no usable URL is configured", async () => {
    delete process.env.DATABASE_URL;
    process.env.NODE_ENV = "development";
    vi.resetModules();

    const { getDb, isLocalMemoryDatabase } = await import("./db");
    const db = await getDb();

    expect(db).not.toBeNull();
    expect(isLocalMemoryDatabase()).toBe(true);
  });
});
