"use client";

import { useState, useEffect } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme-provider";
import {
    Sun,
    Moon,
    Bell,
    Shield,
    Database,
    ExternalLink,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [healthStatus, setHealthStatus] = useState<{
        clerk: boolean;
        supabase: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/health")
            .then((res) => res.json())
            .then((data) => {
                setHealthStatus(data.checks);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <DashboardShell>
            <Header title="Settings" subtitle="Configure your preferences" />

            <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize the look and feel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-[12px]">Theme</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === "light" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme("light")}
                                    className="gap-1.5"
                                >
                                    <Sun className="h-3.5 w-3.5" />
                                    Light
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme("dark")}
                                    className="gap-1.5"
                                >
                                    <Moon className="h-3.5 w-3.5" />
                                    Dark
                                </Button>
                                <Button
                                    variant={theme === "system" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme("system")}
                                >
                                    System
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            System Status
                        </CardTitle>
                        <CardDescription>Service connections and health</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-[13px] text-[var(--foreground-muted)]">Checking services...</p>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-[var(--foreground-muted)]" />
                                        <span className="text-[13px]">Clerk Authentication</span>
                                    </div>
                                    {healthStatus?.clerk ? (
                                        <Badge variant="success" className="gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Connected
                                        </Badge>
                                    ) : (
                                        <Badge variant="error" className="gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Disconnected
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-4 w-4 text-[var(--foreground-muted)]" />
                                        <span className="text-[13px]">Supabase Database</span>
                                    </div>
                                    {healthStatus?.supabase ? (
                                        <Badge variant="success" className="gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Connected
                                        </Badge>
                                    ) : (
                                        <Badge variant="error" className="gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Disconnected
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">About</CardTitle>
                        <CardDescription>Driver Payments Module v1.0</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-[13px] text-[var(--foreground-secondary)]">
                            A comprehensive solution for managing driver earnings with Batta (weekly) and Salary (monthly) components.
                        </p>
                        <div className="flex gap-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] border rounded-md hover:bg-[var(--background-hover)] transition-colors"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Documentation
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
