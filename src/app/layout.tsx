import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent/LayoutContent";

export const metadata: Metadata = {
  title: { default: "DARMON — Платформаи тиббии онлайн", template: "%s — DARMON" },
  description: "Ҷустуҷӯ ва қайд ба қабули духтурони касбӣ дар Тоҷикистон",
  openGraph: {
    siteName: "DARMON",
    type: "website",
    locale: "tg_TJ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tj" suppressHydrationWarning>
      <body className="antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}