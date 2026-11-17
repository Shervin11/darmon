import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clinics/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const clinic = await res.json();
    const title = clinic.clinicName || clinic.fullName;
    const description = [title, clinic.city, clinic.address].filter(Boolean).join(", ").slice(0, 160);
    return { title: { absolute: `${title} — DARMON` }, description, openGraph: { title, description } };
  } catch {
    return {};
  }
}

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
