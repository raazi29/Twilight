
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-lg border px-4 py-2 text-[14px] transition-all duration-200",
                    "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
                    "border-slate-300 dark:border-slate-600",
                    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                    "focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
