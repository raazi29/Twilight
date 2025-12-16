import { Sidebar } from "./sidebar";

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Sidebar />
            <main className="ml-[220px] min-h-screen">{children}</main>
        </div>
    );
}
