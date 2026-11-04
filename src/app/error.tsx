"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="site-container py-28 text-center">
      <p className="eyebrow">A little detour</p>
      <h1 className="mt-5 text-5xl">Something didn’t go to plan.</h1>
      <p className="mt-5 text-muted-foreground">
        Please try again. If you were sending an inquiry, check for a
        confirmation before resubmitting.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back home
        </Button>
      </div>
    </main>
  );
}
