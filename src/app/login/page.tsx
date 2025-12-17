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
import Link from "next/link";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full h-12 text-[15px] font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all duration-200 text-white"
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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <Image
                    src="/hero.png"
                    alt="Twilight SmartBus Fleet"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />

                {/* Logo overlay */}
                <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Twilight"
                        width={48}
                        height={48}
                        className="rounded-xl shadow-lg"
                    />
                    <span className="text-xl font-bold text-white drop-shadow-lg">Twilight</span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                        Driver Payment<br />
                        <span className="text-emerald-400">Management System</span>
                    </h1>
                    <p className="text-slate-200 text-lg max-w-md">
                        Streamline driver settlements and track earnings in real-time.
                    </p>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-[480px] xl:w-[520px] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-slate-950 min-h-screen lg:min-h-0">
                <div className="w-full max-w-[380px] space-y-6">
                    {/* Mobile Logo */}
                    <div className="flex flex-col items-center gap-3 lg:hidden">
                        <Image
                            src="/logo.png"
                            alt="Twilight"
                            width={72}
                            height={72}
                            className="rounded-2xl shadow-xl"
                        />
                        <span className="text-xl font-bold text-slate-900 dark:text-white">Twilight</span>
                    </div>

                    <Card className="border-0 shadow-none lg:shadow-2xl lg:shadow-slate-300/30 dark:lg:shadow-slate-900/50 bg-transparent lg:bg-white dark:lg:bg-slate-900 lg:border">
                        <CardHeader className="space-y-4 pb-2 pt-6 lg:pt-8 px-0 lg:px-8">
                            <div className="hidden lg:flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Twilight"
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
                                        autoComplete="email"
                                        className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all rounded-xl backdrop-blur-sm"
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
                                        autoComplete="current-password"
                                        className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all rounded-xl backdrop-blur-sm"
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
                                Secure Login
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-xs text-slate-400 space-y-2">
                        <p>© 2024 Twilight SmartBus. All rights reserved.</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
