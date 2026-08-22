import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;
let hasWarnedAboutInvalidUrl = false;
let isUsingLocalMemoryDatabase = false;

function isPostgresConnectionUrl(value: string): boolean {
  return value.startsWith("postgres://") || value.startsWith("postgresql://");
}

async function createLocalDevelopmentDatabase() {
  const { newDb } = await import("pg-mem");
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

    CREATE TABLE portfolio_media_assets (
      "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "storageProvider" varchar(40) NOT NULL DEFAULT 'vercel-blob',
      "storageKey" text NOT NULL UNIQUE,
      "url" text NOT NULL,
      "fileName" varchar(255) NOT NULL,
      "contentType" varchar(120) NOT NULL,
      "category" varchar(40) NOT NULL,
      "sizeBytes" integer NOT NULL,
      "createdAt" timestamp with time zone NOT NULL DEFAULT now()
    );
  `);

  const adapter = memory.adapters.createPg();
  class LocalDevelopmentPool extends adapter.Pool {
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

  _pool = new LocalDevelopmentPool() as unknown as Pool;
  _db = drizzle(_pool);
  isUsingLocalMemoryDatabase = true;
  console.warn("[Database] Using development-only in-memory PostgreSQL. Local editor changes reset when the dev server restarts.");
  return _db;
}

// Lazily create the provider-neutral PostgreSQL client so local tooling can run without a database.
export async function getDb() {
  const connectionString = process.env.DATABASE_URL;
  const hasInvalidConnectionString = Boolean(connectionString && !isPostgresConnectionUrl(connectionString));
  if (!_db && hasInvalidConnectionString) {
    if (!hasWarnedAboutInvalidUrl) {
      console.warn("[Database] DATABASE_URL is not a PostgreSQL URL; database-backed portfolio features are disabled.");
      hasWarnedAboutInvalidUrl = true;
    }
    if (process.env.NODE_ENV !== "development") return null;
  }

  if (!_db && connectionString && !hasInvalidConnectionString) {
    try {
      _pool ??= new Pool({ connectionString, max: 5 });
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to configure PostgreSQL:", error);
      _db = null;
    }
  }
  if (!_db && process.env.NODE_ENV === "development") {
    return createLocalDevelopmentDatabase();
  }
  return _db;
}

export function isLocalMemoryDatabase(): boolean {
  return isUsingLocalMemoryDatabase;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Partial<InsertUser> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: { ...updateSet, updatedAt: new Date() },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
