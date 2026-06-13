import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ContactPage from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Juliansyah — a frontend engineer and UI/UX designer open to freelance projects, full-time roles, and Flutter mobile work.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Juliansyah",
    description: "Open to freelance & full-time opportunities — frontend, UI/UX, and Flutter.",
  },
};

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <ContactPage />
    </main>
  );
}
