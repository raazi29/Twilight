"use client";

import { login } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full h-12 text-[15px] font-semibold bg-gradient-to-r from-twilight-green-500 to-twilight-green-600 hover:from-twilight-green-600 hover:to-twilight-green-700 shadow-lg shadow-twilight-green-500/30 transition-all duration-200 text-white"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                </>
            ) : (
                "Sign In"
            )}
        </Button>
    );
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setError(null);
        const res = await login(formData);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900">
            {/* Left side - Hero Section */}
            <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden order-2 lg:order-1">
                {/* Animated background */}
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-twilight-green-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-twilight-blue-500/10 rounded-full blur-3xl" />

                {/* Logo - Desktop */}
                <div className="relative z-10 hidden lg:flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Twilight Bus"
                        width={48}
                        height={48}
                        className="rounded-xl shadow-lg"
                    />
                    <span className="text-xl font-bold text-white tracking-tight">Twilight</span>
                </div>

                {/* Main content */}
                <div className="relative z-10 max-w-lg space-y-6 lg:space-y-8 py-8 lg:py-0">
                    <div className="space-y-3 lg:space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Driver Payment
                            <span className="block text-twilight-green-400">Management System</span>
                        </h1>
                        <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
                            Streamline driver settlements, track earnings in real-time,
                            and manage route efficiency with our advanced logistics platform.
                        </p>
                    </div>

                    {/* Features - Desktop only */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {[
                            { label: "Real-time Tracking", desc: "Live trip monitoring" },
                            { label: "Auto Settlements", desc: "Weekly & monthly" },
                            { label: "Route Management", desc: "Optimized payments" },
                            { label: "Driver Analytics", desc: "Performance insights" },
                        ].map((feature, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                                <p className="font-medium text-white text-sm">{feature.label}</p>
                                <p className="text-slate-400 text-xs mt-1">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer - Desktop only */}
                <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-6">
                    <span>© 2024 Twilight SmartBus. All rights reserved.</span>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-slate-300 transition-colors">Privacy</span>
                        <span className="cursor-pointer hover:text-slate-300 transition-colors">Terms</span>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-[480px] xl:w-[520px] flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-white dark:bg-slate-950 order-1 lg:order-2 min-h-[100vh] lg:min-h-0">
                <div className="w-full max-w-[380px] space-y-6">
                    {/* Mobile Logo */}
                    <div className="flex flex-col items-center gap-3 lg:hidden">
                        <Image
                            src="/logo.png"
                            alt="Twilight Bus"
                            width={64}
                            height={64}
                            className="rounded-2xl shadow-xl"
                        />
                        <span className="text-xl font-bold text-slate-900 dark:text-white">Twilight</span>
                    </div>

                    <Card className="border-0 shadow-none lg:shadow-2xl lg:shadow-slate-300/30 dark:lg:shadow-slate-900/50 bg-transparent lg:bg-white dark:lg:bg-slate-900 lg:border">
                        <CardHeader className="space-y-4 pb-2 pt-6 lg:pt-8 px-0 lg:px-8">
                            <div className="hidden lg:flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Twilight Bus"
                                    width={56}
                                    height={56}
                                    className="rounded-xl shadow-lg"
                                />
                            </div>
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Sign in to access your dashboard
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 lg:px-8 pb-4 lg:pb-6">
                            <form action={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@twilightbus.com"
                                        required
                                        className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-twilight-green-500/20 focus:border-twilight-green-500 transition-all rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-twilight-green-500/20 focus:border-twilight-green-500 transition-all rounded-xl"
                                    />
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
                                        <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}
                                <div className="pt-2">
                                    <SubmitButton />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pb-6 lg:pb-8 px-0 lg:px-8">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                            <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                                <Lock className="h-3 w-3" />
                                Secured with Supabase Auth
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Mobile footer */}
                    <p className="text-center text-xs text-slate-400 lg:hidden">
                        © 2024 Twilight SmartBus
                    </p>
                </div>
            </div>
        </div>
    );
}
