// app/actions/register.ts
"use server";

import { registerUser } from "@/lib/auth/auth";

export async function registerAction(email: string, password: string) {
  return await registerUser(email, password);
}
