import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Заработок",
  description: "AI-чат для Web3/NFT: промпты для Pika, идеи коллекций и тексты продаж.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
