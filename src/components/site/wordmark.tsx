import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HairnThere home"
      className={cn(
        "inline-flex shrink-0 items-baseline font-display text-[1.85rem] leading-none font-semibold tracking-[-0.075em] italic",
        className,
      )}
    >
      Hair<span className="text-secondary">n</span>There
      <ArrowUpRight
        aria-hidden="true"
        className="ml-1 size-5 self-start text-secondary"
        strokeWidth={1.6}
      />
    </Link>
  );
}
