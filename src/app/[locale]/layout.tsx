import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "../globals.css";

// Header のインポートは不要になるので削除してもOKです
// import Header from "@/components/layout/Header";

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
            {/* ヘッダー部分（<Header /> を含んでいた div）を削除 */}
            
            <main>{children}</main>

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