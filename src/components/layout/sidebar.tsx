"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import { useState } from "react";
import {
    LayoutDashboard,
    Route,
    Users,
    Truck,
    Receipt,
    Settings,
    Moon,
    Sun,
    Bus,
} from "lucide-react";

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
    const [imageError, setImageError] = useState(false);

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] border-r bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]">
            {/* Logo */}
            <div className="flex h-16 items-center px-4 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    {!imageError ? (
                        <Image
                            src="/logo.png"
                            alt="Twilight"
                            width={36}
                            height={36}
                            className="rounded-lg"
                            onError={() => setImageError(true)}
                            priority
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-twilight-green-500 to-twilight-blue-600">
                            <Bus className="h-5 w-5 text-white" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white tracking-tight">Twilight</span>
                        <span className="text-[10px] text-white/60 font-medium">SmartBus</span>
                    </div>
                </Link>
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
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
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
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--sidebar-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
                >
                    {resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                    {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                        pathname === "/settings"
                            ? "bg-[var(--sidebar-active)] text-white"
                            : "text-[var(--sidebar-text-muted)] hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
