import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Духтурон",
  description: "Духтурони тасдиқшудаи Тоҷикистон: рейтинг, шарҳҳо, нарх ва қайд ба қабул онлайн.",
};

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
