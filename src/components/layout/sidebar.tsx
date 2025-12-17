"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import {
    LayoutDashboard,
    Route,
    Users,
    Truck,
    Receipt,
    Settings,
    Moon,
    Sun,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/routes", label: "Routes", icon: Route },
    { href: "/drivers", label: "Drivers", icon: Users },
    { href: "/trips", label: "Trips", icon: Truck },
    { href: "/settlements", label: "Settlements", icon: Receipt },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder or default state until mounted
    // However, for the sidebar structure to remain consistent (avoid layout shift), 
    // we only gate the theme toggle text/icon if needed, or just accept the flicker.
    // Better: Render the button but ensure the ICON matches server or empty until mounted.
    // Actually, simple way: return null until mounted? No, that causes layout shift.
    // We will standardly render the sidebar, but for the Theme Button, we check mounted.

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] border-r bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]">
            {/* Logo */}
            <div className="flex h-14 items-center px-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-twilight-blue-600 to-twilight-green-500">
                        <Truck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[15px] font-semibold text-white">Twilight</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150",
                                isActive
                                    ? "bg-[var(--sidebar-active)] text-white"
                                    : "text-[var(--sidebar-text-muted)] hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive
                                        ? "text-[var(--sidebar-accent)]"
                                        : "text-[var(--sidebar-text-muted)] group-hover:text-white"
                                )}
                            />
                            {item.label}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--sidebar-accent)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-[var(--sidebar-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
                >
                    {mounted ? (
                        <>
                            {resolvedTheme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                        </>
                    ) : (
                        <>
                            <Sun className="h-4 w-4 opacity-0" />
                            <span className="opacity-0">Toggle Theme</span>
                        </>
                    )}
                </button>

                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-[var(--sidebar-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
