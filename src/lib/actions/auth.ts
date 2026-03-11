"use server";

import { revalidatePath } from "next/cache";

export async function refreshSessionAction() {
  // セッション情報が含まれるページや、レイアウトのキャッシュを更新
  revalidatePath("/", "layout"); 
}