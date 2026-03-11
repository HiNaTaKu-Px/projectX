import { auth } from "@/lib/auth"; // 先ほど作成した auth インスタンス
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);