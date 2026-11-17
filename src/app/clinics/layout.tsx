import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Клиникаҳо",
  description: "Клиникаҳои Тоҷикистон дар DARMON: суроға, духтурон ва қайд ба қабул онлайн.",
};

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
