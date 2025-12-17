import { Sidebar, MobileSidebar } from "./sidebar";
import Image from "next/image";

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Header - Floating Island Style */}
            <div className="md:hidden fixed top-3 left-3 right-3 z-30 flex items-center justify-between p-3 rounded-xl border bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/60 dark:border-slate-800/60 shadow-lg ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                    <MobileSidebar />
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="T"
                                width={20}
                                height={20}
                                className="invert brightness-0"
                            />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Twilight</span>
                    </div>
                </div>
                {/* Optional: Add a profile or notification icon here if needed/requested */}
            </div>

            {/* Main Content */}
            <main className="md:ml-[220px] min-h-screen pt-24 md:pt-0 bg-[#F6F8FA] dark:bg-[#0B1120]">
                {children}
            </main>
        </div>
    );
}
