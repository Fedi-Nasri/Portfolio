import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { PortfolioContent } from "../shared/portfolio";

/**
 * Provider-neutral PostgreSQL schema. The application can use Neon or any
 * standards-compatible PostgreSQL provider through DATABASE_URL.
 */
export const userRole = pgEnum("user_role", ["user", "admin"]);
export const portfolioContentStatus = pgEnum("portfolio_content_status", ["draft", "published"]);

export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const portfolioContentVersions = pgTable("portfolio_content_versions", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  status: portfolioContentStatus("status").notNull().default("draft"),
  contentJson: jsonb("contentJson").$type<PortfolioContent>().notNull(),
  createdBy: integer("createdBy").notNull(),
  updatedBy: integer("updatedBy").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { withTimezone: true }),
});

export type PortfolioContentVersion = typeof portfolioContentVersions.$inferSelect;
export type InsertPortfolioContentVersion = typeof portfolioContentVersions.$inferInsert;

export const portfolioDrafts = pgTable("portfolio_drafts", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  draftKey: varchar("draftKey", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  isPublic: boolean("isPublic").notNull().default(false),
  createdBy: integer("createdBy").notNull(),
  updatedBy: integer("updatedBy").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const portfolioDraftVersions = pgTable("portfolio_draft_versions", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  draftId: integer("draftId").notNull(),
  versionNumber: integer("versionNumber").notNull(),
  contentJson: jsonb("contentJson").$type<PortfolioContent>().notNull(),
  note: varchar("note", { length: 500 }),
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type PortfolioDraft = typeof portfolioDrafts.$inferSelect;
export type PortfolioDraftVersion = typeof portfolioDraftVersions.$inferSelect;
