// lib/validators/auth.ts
import { z } from "zod";

// -----------------------------
// Login
// -----------------------------
export const loginSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// -----------------------------
// Register
// -----------------------------
export const registerSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});
