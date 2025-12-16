"use client";

import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EarningsCardProps {
    title: string;
    amount: number;
    periodLabel: string;
    variant?: "batta" | "salary" | "total";
    trend?: {
        value: number;
        direction: "up" | "down";
    };
}

export function EarningsCard({
    title,
    amount,
    periodLabel,
    variant = "total",
    trend,
}: EarningsCardProps) {
    return (
        <div className="rounded-lg border bg-[var(--background-card)] p-5">
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
                <span
                    className={cn("h-2 w-2 rounded-full", {
                        "bg-[var(--warning)]": variant === "batta",
                        "bg-twilight-blue-600 dark:bg-twilight-blue-400": variant === "salary",
                        "bg-[var(--accent)]": variant === "total",
                    })}
                />
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                    {title}
                </span>
            </div>

            {/* Amount */}
            <div className="flex items-baseline gap-3">
                <span className="text-[32px] font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
                    {formatCurrency(amount)}
                </span>

                {trend && (
                    <span
                        className={cn("flex items-center gap-0.5 text-[12px] font-medium", {
                            "text-[var(--success)]": trend.direction === "up",
                            "text-[var(--error)]": trend.direction === "down",
                        })}
                    >
                        {trend.direction === "up" ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trend.value}%
                    </span>
                )}
            </div>

            {/* Period */}
            <p className="mt-1 text-[12px] text-[var(--foreground-muted)]">{periodLabel}</p>
        </div>
    );
}
