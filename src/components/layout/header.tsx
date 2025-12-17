"use client";

import { logout } from "@/lib/auth-actions";

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-[var(--background)]/80 backdrop-blur-md px-6">
            <div>
                <h1 className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h1>
                {subtitle && (
                    <p className="text-[12px] text-[var(--foreground-muted)]">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[12px] text-[var(--foreground-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-accent)] animate-pulse" />
                    <span>Live</span>
                </div>

                <form action={logout}>
                    <button
                        type="submit"
                        className="text-[13px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </header>
    );
}
