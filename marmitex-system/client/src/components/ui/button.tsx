import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-sm font-semibold transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#4a7fea] disabled:bg-[#e0e0e0] disabled:text-[#424242]",
        destructive:
          "bg-destructive text-white hover:bg-[#d63b2f] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 disabled:bg-[#e0e0e0] disabled:text-[#424242]",
        outline:
          "border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground disabled:border-[#e0e0e0] disabled:text-[#424242] disabled:bg-[#fcfbfb]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-[#e0e0e0] disabled:text-[#424242]",
        ghost:
          "bg-transparent text-primary hover:bg-[#e0e0e0] hover:text-primary disabled:text-[#424242]",
        link:
          "text-primary underline-offset-4 hover:text-[#4a7fea] hover:underline disabled:text-[#424242]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 px-6 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
