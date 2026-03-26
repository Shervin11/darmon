import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent/LayoutContent";

export const metadata: Metadata = {
  title: "DARMON — Платформаи тиббии онлайн",
  description: "Ҷустуҷӯ ва қайд ба қабули духтурони касбӣ дар Тоҷикистон",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tj">
      <body className="antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}