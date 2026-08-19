import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import type { PortfolioContent } from "../shared/portfolio";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const portfolioContentVersions = mysqlTable("portfolio_content_versions", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
  contentJson: json("contentJson").$type<PortfolioContent>().notNull(),
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type PortfolioContentVersion = typeof portfolioContentVersions.$inferSelect;
export type InsertPortfolioContentVersion = typeof portfolioContentVersions.$inferInsert;

export const portfolioDrafts = mysqlTable("portfolio_drafts", {
  id: int("id").autoincrement().primaryKey(),
  draftKey: varchar("draftKey", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  isPublic: boolean("isPublic").notNull().default(false),
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const portfolioDraftVersions = mysqlTable("portfolio_draft_versions", {
  id: int("id").autoincrement().primaryKey(),
  draftId: int("draftId").notNull(),
  versionNumber: int("versionNumber").notNull(),
  contentJson: json("contentJson").$type<PortfolioContent>().notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioDraft = typeof portfolioDrafts.$inferSelect;
export type PortfolioDraftVersion = typeof portfolioDraftVersions.$inferSelect;
