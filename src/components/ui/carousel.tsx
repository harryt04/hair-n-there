"use client";

import * as Primitive from "@ui-sdk/react/carousel";
import { cn } from "cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

function Carousel({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Carousel>) {
  return (
    <Primitive.Carousel
      className={cn("relative block max-w-none", className)}
      {...props}
    />
  );
}

function CarouselViewport({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.CarouselViewport>) {
  return (
    <Primitive.CarouselViewport
      className={cn("overflow-auto", className)}
      {...props}
    />
  );
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.CarouselContent>) {
  return (
    <Primitive.CarouselContent
      className={cn(
        "flex gap-4 data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function CarouselItem({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.CarouselItem>) {
  return (
    <Primitive.CarouselItem
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
}

type StepProps = Omit<
  React.ComponentProps<typeof Primitive.CarouselNext>,
  "className"
> &
  Pick<Parameters<typeof buttonVariants>[0] & {}, "size" | "variant"> & {
    className?: string;
  };

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  children = <ChevronLeftIcon aria-hidden="true" />,
  ...props
}: StepProps) {
  return (
    <Primitive.CarouselPrevious
      aria-label="Previous slide"
      className={cn(
        buttonVariants({ variant, size }),
        "touch-manipulation rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </Primitive.CarouselPrevious>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  children = <ChevronRightIcon aria-hidden="true" />,
  ...props
}: StepProps) {
  return (
    <Primitive.CarouselNext
      aria-label="Next slide"
      className={cn(
        buttonVariants({ variant, size }),
        "touch-manipulation rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </Primitive.CarouselNext>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
};
