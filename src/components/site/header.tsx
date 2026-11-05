"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, QrCode } from "lucide-react";
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

const navigation = [
  { href: "/#instagram", label: "Instagram gallery" },
  { href: "/services", label: "Services & prices" },
  { href: "/#about", label: "Meet Elisabeth" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="site-container flex h-16 items-center justify-between gap-2">
        <Wordmark className="text-xl [&>img]:hidden sm:text-2xl sm:[&>img]:block" />
        <div className="flex items-center gap-1 sm:gap-3 lg:gap-5">
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
          <Button
            render={<Link href="/card" />}
            nativeButton={false}
            variant="outline"
            className="h-10 gap-1.5 rounded-sm px-2.5 text-[10px] sm:px-3 sm:text-xs"
          >
            <QrCode aria-hidden="true" /> QR Code
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 lg:hidden"
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
                {[
                  ...navigation,
                  { href: "/card", label: "QR Code" },
                  { href: "/contact", label: "Say hello" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-sm px-3 py-4 text-sm font-medium hover:bg-muted"
                  >
                    {label}
                  </Link>
                ))}
                <Button
                  render={<Link href="/quote" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                  className="mt-4 h-12 rounded-sm"
                >
                  Build your service wish list{" "}
                  <ArrowUpRight aria-hidden="true" />
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
