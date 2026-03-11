import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// サーバーレス環境（特にEdge）でのデータフェッチを安定させる設定
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL!;

// 開発環境でのホットリロード対策
const globalForDb = global as unknown as {
  conn: ReturnType<typeof neon> | undefined;
};

// 接続の作成
const sql = globalForDb.conn ?? neon(connectionString);

if (process.env.NODE_ENV !== "production") globalForDb.conn = sql;

// Better Auth に渡すための db インスタンス
export const db = drizzle(sql, { schema });