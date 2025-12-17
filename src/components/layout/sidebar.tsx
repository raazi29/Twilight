"use client";

import Link from "next/link";
import Image from "next/image";
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
    Menu,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/routes", label: "Routes", icon: Route },
    { href: "/drivers", label: "Drivers", icon: Users },
    { href: "/trips", label: "Trips", icon: Truck },
    { href: "/settlements", label: "Settlements", icon: Receipt },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

function SidebarContent() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-full flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]">
            {/* Logo */}
            <div className="flex h-14 items-center px-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Twilight"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
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
            <div className="mt-auto p-3 border-t border-white/10">
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
        </div>
    );
}

export function Sidebar({ className }: SidebarProps) {
    return (
        <aside className={cn("fixed left-0 top-0 z-40 h-screen w-[220px] border-r border-r-slate-200 dark:border-r-slate-800", className)}>
            <SidebarContent />
        </aside>
    );
}

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Close on path change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={cn("text-slate-600 hover:text-slate-900 dark:text-slate-400", isOpen && "bg-slate-100 dark:bg-slate-800")}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop - full screen fixed */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu - Fixed position below header */}
                    <div className="fixed left-3 right-3 top-[70px] z-50 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</span>
                        </div>
                        <nav className="grid gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-emerald-500 text-white shadow-md"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 text-slate-500 dark:text-slate-400 font-normal hover:text-slate-900 px-4 py-3"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </Button>
                    </div>
                </>
            )}
        </>
    );
}
