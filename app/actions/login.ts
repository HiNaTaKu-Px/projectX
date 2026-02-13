// app/actions/login.ts
"use server";

import { loginUser } from "@/lib/auth/auth";

export async function loginAction(email: string, password: string) {
  return await loginUser(email, password);
}
