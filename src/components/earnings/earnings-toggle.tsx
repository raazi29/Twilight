"use client";

import { cn } from "@/lib/utils";

interface EarningsToggleProps {
    value: "weekly" | "monthly";
    onChange: (value: "weekly" | "monthly") => void;
}

export function EarningsToggle({ value, onChange }: EarningsToggleProps) {
    return (
        <div className="inline-flex rounded-md border bg-[var(--background-secondary)] p-0.5">
            <button
                onClick={() => onChange("weekly")}
                className={cn(
                    "px-3 py-1.5 text-[12px] font-medium rounded transition-all duration-150",
                    value === "weekly"
                        ? "bg-[var(--background-card)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
            >
                Weekly
            </button>
            <button
                onClick={() => onChange("monthly")}
                className={cn(
                    "px-3 py-1.5 text-[12px] font-medium rounded transition-all duration-150",
                    value === "monthly"
                        ? "bg-[var(--background-card)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
            >
                Monthly
            </button>
        </div>
    );
}
