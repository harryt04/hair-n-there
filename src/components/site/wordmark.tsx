import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HairnThere home"
      className={cn(
        "inline-flex shrink-0 items-center gap-2 font-display text-2xl leading-none font-semibold tracking-[-0.04em] sm:gap-2.5 sm:text-[1.85rem]",
        className,
      )}
    >
      <Image
        src="/brand/logo.png"
        width={600}
        height={600}
        sizes="36px"
        alt=""
        className="size-8 shrink-0 rounded-full sm:size-9"
      />
      <span>
        Hair<span className="text-secondary">n</span>There
      </span>
    </Link>
  );
}
