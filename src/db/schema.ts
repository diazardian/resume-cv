import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const newsletterSubscriptions = sqliteTable("newsletter_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  subscribed: integer("subscribed", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const pageViews = sqliteTable("page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
  device: text("device"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
