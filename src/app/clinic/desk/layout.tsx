import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистратура",
  robots: { index: false },
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
