import { pgTable, text, timestamp, integer, json } from "drizzle-orm/pg-core";

// --- Users（ユーザー情報とアバター設定） ---
export const appUsers = pgTable("app_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  items: text("items"),
  stockItems: text("stockItems"),
  // ★ 修正: avatar カラムを image 中心に整理
  avatar: json("avatar")
    .$type<{
      mode: "image"; // color モードは廃止
      image: string; // "1", "2", "3" など
    }>()
    .notNull()
    .default({
      mode: "image",
      image: "1", // 初期値はラビィ（ID:1）
    }),
});

// --- Sessions（Lucia Auth用） ---
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// --- Scores（ゲーム別の最大連勝記録） ---
export const scores = pgTable("scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  game: text("game").notNull(), // "highlow", "clash", "bj"
  value: integer("value").default(0).notNull(), // 最大連勝数
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Posts（掲示板・ボード投稿用） ---
export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
