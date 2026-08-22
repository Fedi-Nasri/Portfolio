import { newDb } from "pg-mem";
import { vi } from "vitest";

const memory = newDb({ autoCreateForeignKeyIndices: true });

memory.public.none(`
  CREATE TYPE user_role AS ENUM ('user', 'admin');
  CREATE TYPE portfolio_content_status AS ENUM ('draft', 'published');

  CREATE TABLE users (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "openId" varchar(64) NOT NULL UNIQUE,
    "name" text,
    "email" varchar(320),
    "loginMethod" varchar(64),
    "role" user_role NOT NULL DEFAULT 'user',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "lastSignedIn" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE portfolio_content_versions (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "status" portfolio_content_status NOT NULL DEFAULT 'draft',
    "contentJson" jsonb NOT NULL,
    "createdBy" integer NOT NULL,
    "updatedBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "publishedAt" timestamp with time zone
  );

  CREATE TABLE portfolio_drafts (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "draftKey" varchar(64) NOT NULL UNIQUE,
    "name" varchar(120) NOT NULL,
    "isPublic" boolean NOT NULL DEFAULT false,
    "createdBy" integer NOT NULL,
    "updatedBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE portfolio_draft_versions (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "draftId" integer NOT NULL,
    "versionNumber" integer NOT NULL,
    "contentJson" jsonb NOT NULL,
    "note" varchar(500),
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now()
  );
`);

const adapter = memory.adapters.createPg();
process.env.DATABASE_URL = "postgresql://portfolio-test:portfolio-test@localhost:5432/portfolio_test";

class TestPool extends adapter.Pool {
  query(query: unknown, ...args: unknown[]) {
    const needsArrayRows = Boolean(query && typeof query === "object" && (query as Record<string, unknown>).rowMode === "array");
    const normalizeRows = (result: { rows?: unknown[] }) => {
      if (needsArrayRows && Array.isArray(result.rows)) {
        result.rows = result.rows.map((row) => (Array.isArray(row) ? row : Object.values(row as Record<string, unknown>)));
      }
      return result;
    };

    if (query && typeof query === "object") {
      const { types: _types, rowMode: _rowMode, ...compatibleQuery } = query as Record<string, unknown>;
      return (super.query(compatibleQuery as never, ...args as never[]) as Promise<{ rows?: unknown[] }>).then(normalizeRows);
    }
    return super.query(query as never, ...args as never[]);
  }
}

vi.mock("pg", () => ({ Pool: TestPool }));
