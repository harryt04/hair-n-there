import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main-content" className="site-container py-28 text-center">
      <p className="eyebrow">A little off the beaten path</p>
      <h1 className="mt-5 text-5xl">Let’s get you back home.</h1>
      <p className="mt-5 text-muted-foreground">
        This page isn’t here, but your next good hair day could be.
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
