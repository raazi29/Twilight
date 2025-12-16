import { SignUp } from "@clerk/nextjs";
import { Truck } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen bg-[var(--sidebar-bg)]">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 border-r border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-twilight-blue-600 to-twilight-green-500">
                        <Truck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white">Twilight</span>
                </div>

                <div>
                    <h1 className="text-3xl font-semibold text-white mb-3">
                        Driver Payments Module
                    </h1>
                    <p className="text-slate-400 text-[15px] leading-relaxed max-w-md">
                        Manage driver earnings, settlements, and payment preferences.
                        Track Batta and Salary components with full transparency.
                    </p>
                </div>

                <div className="text-[12px] text-slate-500">
                    © 2024 Twilight SmartBus. IntrCity Operations.
                </div>
            </div>

            {/* Right side - Sign Up */}
            <div className="flex flex-1 items-center justify-center p-6 bg-[var(--background)]">
                <div className="w-full max-w-[380px]">
                    <div className="lg:hidden mb-8 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-twilight-blue-600 to-twilight-green-500">
                            <Truck className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-[var(--foreground)]">Twilight</span>
                    </div>

                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-[var(--background-card)] border shadow-none",
                                headerTitle: "text-[var(--foreground)] text-lg",
                                headerSubtitle: "text-[var(--foreground-secondary)]",
                                socialButtonsBlockButton: "bg-[var(--background-hover)] border text-[var(--foreground)] hover:opacity-80",
                                socialButtonsBlockButtonText: "text-[var(--foreground)]",
                                dividerLine: "bg-[var(--border)]",
                                dividerText: "text-[var(--foreground-muted)]",
                                formFieldLabel: "text-[var(--foreground-secondary)] text-[12px]",
                                formFieldInput: "bg-[var(--background)] border text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]",
                                formButtonPrimary: "bg-[var(--accent)] hover:opacity-90 text-[var(--accent-foreground)]",
                                footerActionLink: "text-[var(--accent)]",
                                footer: "hidden",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
