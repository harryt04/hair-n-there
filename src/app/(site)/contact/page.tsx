import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  title: "Let’s plan your visit",
  description:
    "Haircuts, color, and a little more ease. Send your house-call details and Elisabeth or her team will follow up with a personal quote.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <main id="main-content" className="site-container">
      <ContactSection standalone />
    </main>
  );
}
