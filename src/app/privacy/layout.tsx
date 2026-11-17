import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сиёсати махфият",
  description: "Чӣ гуна DARMON маълумоти шахсӣ ва тиббии беморонро ҷамъ, нигоҳ ва ҳифз мекунад.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
