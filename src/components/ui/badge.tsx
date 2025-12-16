import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 text-[11px] font-medium",
    {
        variants: {
            variant: {
                default: "text-[var(--foreground-secondary)]",
                success: "text-[var(--success)]",
                warning: "text-[var(--warning)]",
                error: "text-[var(--error)]",
                info: "text-twilight-blue-600 dark:text-twilight-blue-400",
                outline: "border px-2 py-0.5 rounded text-[var(--foreground-secondary)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
            {dot && variant !== "outline" && (
                <span
                    className={cn("h-1.5 w-1.5 rounded-full", {
                        "bg-[var(--foreground-secondary)]": variant === "default",
                        "bg-[var(--success)]": variant === "success",
                        "bg-[var(--warning)]": variant === "warning",
                        "bg-[var(--error)]": variant === "error",
                        "bg-twilight-blue-600 dark:bg-twilight-blue-400": variant === "info",
                    })}
                />
            )}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };
