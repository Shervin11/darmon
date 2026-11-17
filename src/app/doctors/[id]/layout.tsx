import type { Metadata } from "next";

// Title and description from the doctor's public profile (falls back to the default title)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const doctor = await res.json();
    const title = [doctor.fullName, doctor.specialty].filter(Boolean).join(" — ");
    const description = (doctor.bio || `${doctor.fullName}, ${doctor.clinic || ""}`).slice(0, 160);
    // Absolute title: the parent "Духтурон" segment would otherwise drop the site template
    return { title: { absolute: `${title} — DARMON` }, description, openGraph: { title, description } };
  } catch {
    return {};
  }
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
