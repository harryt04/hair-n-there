import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The requested page does not exist on HairnThere.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main-content" className="site-container py-28 text-center">
      <p className="eyebrow">404 — Not found</p>
      <h1 className="mt-5 text-5xl">Page not found</h1>
      <p className="mt-5 text-muted-foreground">
        The page you requested does not exist on this website.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="mt-8 h-11 px-6"
      >
        Back to HairnThere
      </Button>
    </main>
  );
}
