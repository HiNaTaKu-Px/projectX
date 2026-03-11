import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner"; // 追加
import "../globals.css";
import Header from "@/components/layout/Header";

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const locales = ["ja", "en"];
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="m-0 p-0 overflow-auto font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="bg-gray-700">
              <Header />
            </div>
            
            <main>{children}</main>

            {/* Sonner の土台を設置 */}
            {/* richColors: 成功/失敗で色分け, closeButton: 閉じるボタン表示 */}
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}