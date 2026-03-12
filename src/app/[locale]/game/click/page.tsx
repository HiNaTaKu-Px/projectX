// app/[locale]/game/click/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ClickGamePage from "./ClickGameClientPage"; // 下記のクライアントコンポーネントを読み込む

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ログインしていればDBの値、していなければ0
  const initialCoins = session?.user.coins ?? 0;

  return <ClickGamePage initialCoins={initialCoins} />;
}