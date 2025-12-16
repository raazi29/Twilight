import { SignUp } from "@clerk/nextjs";
import { Bus, Shield, Clock, Wallet } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Premium Branding */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-twilight-blue-950 via-twilight-blue-900 to-twilight-blue-800">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-twilight-green-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-twilight-blue-400 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-twilight-green-400 to-twilight-green-600 shadow-lg shadow-twilight-green-500/25">
                            <Bus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">Twilight</span>
                            <span className="text-xl font-light text-white/80 ml-1">SmartBus</span>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                                Join the
                                <br />
                                <span className="text-twilight-green-400">Smart Fleet</span>
                            </h1>
                            <p className="text-lg text-white/70 max-w-md leading-relaxed">
                                Get started with transparent driver payment management in minutes.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 max-w-md">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-twilight-green-500/20">
                                    <Wallet className="h-5 w-5 text-twilight-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Weekly Batta</h3>
                                    <p className="text-xs text-white/60 mt-0.5">Daily expense tracking</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-twilight-blue-500/20">
                                    <Clock className="h-5 w-5 text-twilight-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Monthly Salary</h3>
                                    <p className="text-xs text-white/60 mt-0.5">Fixed settlements</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                    <Shield className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Secure</h3>
                                    <p className="text-xs text-white/60 mt-0.5">Enterprise-grade</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                                    <Bus className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Fleet Ready</h3>
                                    <p className="text-xs text-white/60 mt-0.5">Any scale</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-white/40 text-sm">
                        <span>© 2024 Twilight SmartBus</span>
                        <span>IntrCity Operations</span>
                    </div>
                </div>
            </div>

            {/* Right side - Sign Up */}
            <div className="flex flex-1 items-center justify-center p-8 bg-[var(--background)]">
                <div className="w-full max-w-[400px] space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-twilight-green-400 to-twilight-green-600">
                                <Bus className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                                <span className="text-xl font-bold text-[var(--foreground)]">Twilight</span>
                                <span className="text-xl font-light text-[var(--foreground-muted)] ml-1">SmartBus</span>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">Create account</h2>
                        <p className="text-[var(--foreground-muted)] mt-2">Start managing driver payments today</p>
                    </div>

                    {/* Clerk SignUp */}
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none p-0 border-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-[var(--background-card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-hover)] transition-colors rounded-lg h-11",
                                socialButtonsBlockButtonText: "text-[var(--foreground)] font-medium",
                                dividerLine: "bg-[var(--border)]",
                                dividerText: "text-[var(--foreground-muted)] text-sm",
                                formFieldLabel: "text-[var(--foreground-secondary)] text-sm font-medium",
                                formFieldInput: "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] rounded-lg h-11 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent",
                                formButtonPrimary: "bg-[var(--accent)] hover:opacity-90 text-[var(--accent-foreground)] rounded-lg h-11 font-semibold transition-all",
                                footerActionLink: "text-[var(--accent)] font-medium hover:underline",
                                footer: "pt-4",
                                identityPreviewText: "text-[var(--foreground)]",
                                identityPreviewEditButton: "text-[var(--accent)]",
                            },
                        }}
                    />

                    {/* Help Link */}
                    <div className="text-center pt-4 border-t border-[var(--border)]">
                        <p className="text-sm text-[var(--foreground-muted)]">
                            Need help?{" "}
                            <a href="mailto:support@twilight.com" className="text-[var(--accent)] hover:underline font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
