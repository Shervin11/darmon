import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корти тиббӣ",
  robots: { index: false },
};

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
