import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дар бораи мо",
  description: "DARMON — платформаи онлайни тиббӣ барои ёфтани духтур ва қайд ба қабул дар Тоҷикистон.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
