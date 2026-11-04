"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";
import { launchNotice } from "@/data/availability";

const navigation = [
  { href: "/#work", label: "The inspiration" },
  { href: "/services", label: "Services & prices" },
  { href: "/#about", label: "Meet Elisabeth" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-border/80">
      <div className="site-container flex h-22 items-center justify-between gap-4 md:h-26">
        <Wordmark />
        <div className="flex items-center gap-2 md:gap-6">
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            {navigation.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            className="hidden h-11 rounded-lg px-5 text-xs sm:inline-flex"
          >
            Let’s talk hair <ArrowUpRight aria-hidden="true" />
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 lg:hidden"
                />
              }
              aria-label="Open navigation"
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent className="w-[min(88vw,360px)] p-6">
              <SheetHeader className="px-0 pt-8">
                <SheetTitle className="font-display text-3xl">
                  Great Hair Travels.
                </SheetTitle>
                <SheetDescription className="mt-2 leading-relaxed">
                  A little mountain spirit. A lot of good hair.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="mt-6 flex flex-col gap-2"
              >
                {navigation.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-4 text-sm font-medium hover:bg-muted"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-4 text-sm font-medium hover:bg-muted"
                >
                  Say hello
                </Link>
                <Button
                  render={<Link href="/quote" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                  className="mt-4 h-12"
                >
                  Build your service wish list{" "}
                  <ArrowUpRight aria-hidden="true" />
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="border-t border-border/60 bg-muted/65 px-5 py-2.5 text-center text-[10px] leading-5 text-muted-foreground">
        <span
          className="mr-2 inline-block size-1 rounded-full bg-gold align-middle"
          aria-hidden="true"
        />
        {launchNotice}
      </div>
    </header>
  );
}
