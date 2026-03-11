import { pgTable, text, timestamp, boolean, integer, index, jsonb } from "drizzle-orm/pg-core";

// --- Better Auth: User Table ---
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    avatar: jsonb("avatar").$type<{ mode: string; image: string }>(), 
    // ★ 崩さず追加：全ゲーム共通の所持金
    coins: integer("coins").notNull().default(0), 
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

// --- Better Auth: Session Table ---
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// --- Better Auth: Account Table ---
export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

// --- Better Auth: Verification Table ---
export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt"),
});

// --- Board: Posts Table ---
export const posts = pgTable("posts", {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// --- 拡張: Game Scores Table ---
// ★ 今後ゲームが増えても「metadata」の中に何でも入れられるように拡張
export const gameScores = pgTable("game_scores", {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    gameType: text("gameType").notNull(), 
    score: integer("score").notNull().default(0),
    // ★ 追加：ゲームごとの「所持アイテム」や「進捗」を自由に保存できる箱
    metadata: jsonb("metadata").$type<any>().notNull().default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => {
    return {
        scoreIdx: index("score_idx").on(table.gameType, table.score),
        // ★ 追加：ユーザーごとのデータ取得を高速化
        userGameIdx: index("user_game_idx").on(table.userId, table.gameType),
    };
});