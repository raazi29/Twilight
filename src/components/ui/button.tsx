import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md",
    {
        variants: {
            variant: {
                default: "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90",
                secondary: "bg-[var(--background-hover)] text-[var(--foreground)] hover:opacity-80",
                outline: "border bg-transparent text-[var(--foreground)] hover:bg-[var(--background-hover)]",
                ghost: "text-[var(--foreground-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--foreground)]",
                destructive: "bg-[var(--error)] text-white hover:opacity-90",
                link: "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                default: "h-8 px-3",
                sm: "h-7 px-2.5 text-[12px]",
                lg: "h-9 px-4",
                icon: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
