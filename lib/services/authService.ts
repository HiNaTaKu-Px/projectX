// lib/services/authService.ts
"use client";

import { loginAction } from "@/app/actions/login";
import { registerAction } from "@/app/actions/register";
import { getUserAction } from "@/app/actions/getUser";

export const AuthService = {
  async login(email: string, password: string) {
    return await loginAction(email, password);
  },

  async register(email: string, password: string) {
    return await registerAction(email, password);
  },

  async getMe() {
    const token = localStorage.getItem("token");
    if (!token) return { ok: false, error: "No token" };

    return await getUserAction(token);
  },
};
