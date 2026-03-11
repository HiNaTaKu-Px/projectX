import { createAuthClient } from "better-auth/react";
// inferAdditionalFields をインポート
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { user } from "@/db/schema"; // schemaからuserの型をインポート

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    // ★ ここを追加：DBにある追加フィールド（coinsなど）をフロントエンドでも認識させる
    plugins: [
        inferAdditionalFields<typeof user>()
    ]
});

export const { 
    signIn, 
    signUp, 
    signOut, 
    useSession 
} = authClient;