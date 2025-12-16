"use client";

import { useState, useEffect } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme-provider";
import {
    Sun,
    Moon,
    Monitor,
    Bell,
    BellRing,
    Calendar,
    Clock,
    Wallet,
    Bus,
    Check,
    Save,
    AlertCircle,
} from "lucide-react";

// Settings interface
interface AppSettings {
    notifications: {
        enabled: boolean;
        weeklyBattaReminder: boolean;
        monthlySalaryReminder: boolean;
        settlementAlerts: boolean;
    };
    company: {
        name: string;
        email: string;
        phone: string;
    };
}

const DEFAULT_SETTINGS: AppSettings = {
    notifications: {
        enabled: false,
        weeklyBattaReminder: true,
        monthlySalaryReminder: true,
        settlementAlerts: true,
    },
    company: {
        name: "Twilight SmartBus",
        email: "support@twilight.com",
        phone: "+91 1800-XXX-XXXX",
    },
};

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

    // Load settings from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("twilight-settings");
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse settings:", e);
            }
        }
        // Check notification permission
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // Request notification permission
    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications");
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
            // Enable notifications in settings
            const newSettings = {
                ...settings,
                notifications: { ...settings.notifications, enabled: true },
            };
            setSettings(newSettings);
            localStorage.setItem("twilight-settings", JSON.stringify(newSettings));

            // Send test notification
            new Notification("Twilight SmartBus", {
                body: "Notifications enabled! You'll receive payment reminders.",
                icon: "/logo.png",
            });
        }
    };

    // Send test notification
    const sendTestNotification = () => {
        if (notificationPermission === "granted") {
            new Notification("Batta Reminder", {
                body: "You have ₹2,100 in unsettled Batta payments this week.",
                icon: "/logo.png",
            });
        }
    };

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem("twilight-settings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Toggle notification settings
    const toggleNotification = (key: keyof AppSettings["notifications"]) => {
        if (key === "enabled" && !settings.notifications.enabled && notificationPermission !== "granted") {
            requestNotificationPermission();
            return;
        }

        const newSettings = {
            ...settings,
            notifications: {
                ...settings.notifications,
                [key]: !settings.notifications[key],
            },
        };
        setSettings(newSettings);
        localStorage.setItem("twilight-settings", JSON.stringify(newSettings));
    };

    // Update company settings
    const updateCompany = (key: keyof AppSettings["company"], value: string) => {
        setSettings({
            ...settings,
            company: { ...settings.company, [key]: value },
        });
    };

    if (!mounted) {
        return (
            <DashboardShell>
                <Header title="Settings" />
                <div className="p-6 animate-pulse">
                    <div className="h-48 bg-[var(--background-hover)] rounded-xl" />
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <Header title="Settings" subtitle="Manage your preferences" />

            <div className="p-6 space-y-8 animate-fade-in max-w-4xl">
                {/* Theme Selection */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Appearance</h2>
                        <p className="text-[12px] text-[var(--foreground-muted)]">Choose your preferred theme</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: "light", label: "Light", icon: Sun, desc: "Bright & clear", color: "bg-amber-500" },
                            { id: "dark", label: "Dark", icon: Moon, desc: "Easy on eyes", color: "bg-twilight-blue-500" },
                            { id: "system", label: "System", icon: Monitor, desc: "Auto-detect", color: "bg-gray-500" },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id as "light" | "dark" | "system")}
                                className={`relative p-5 rounded-2xl border-2 transition-all text-left ${theme === t.id
                                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                                        : "border-transparent bg-[var(--background-card)] hover:border-[var(--border)]"
                                    }`}
                            >
                                {theme === t.id && (
                                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                )}
                                <div className={`h-10 w-10 rounded-xl ${t.color} flex items-center justify-center mb-3`}>
                                    <t.icon className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-[14px] font-semibold">{t.label}</p>
                                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{t.desc}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notifications */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Notifications</h2>
                            <p className="text-[12px] text-[var(--foreground-muted)]">Get payment reminders</p>
                        </div>
                        {notificationPermission === "granted" && (
                            <Button variant="outline" size="sm" onClick={sendTestNotification} className="gap-2">
                                <BellRing className="h-3.5 w-3.5" />
                                Test
                            </Button>
                        )}
                    </div>

                    {/* Permission Banner */}
                    {notificationPermission !== "granted" && (
                        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-[13px] font-medium text-amber-600 dark:text-amber-400">
                                    Enable browser notifications
                                </p>
                                <p className="text-[12px] text-[var(--foreground-muted)] mt-0.5">
                                    Allow notifications to receive payment reminders
                                </p>
                            </div>
                            <Button size="sm" onClick={requestNotificationPermission} className="gap-2">
                                <Bell className="h-3.5 w-3.5" />
                                Enable
                            </Button>
                        </div>
                    )}

                    <Card className="overflow-hidden">
                        <div className="divide-y divide-[var(--border)]">
                            {[
                                { key: "weeklyBattaReminder", label: "Weekly Batta Reminder", desc: "Every Saturday at 10:00 AM", icon: Calendar },
                                { key: "monthlySalaryReminder", label: "Monthly Salary Reminder", desc: "28th of each month at 10:00 AM", icon: Clock },
                                { key: "settlementAlerts", label: "Settlement Alerts", desc: "When payments are processed", icon: Wallet },
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => toggleNotification(item.key as keyof AppSettings["notifications"])}
                                    disabled={notificationPermission !== "granted"}
                                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--background-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${settings.notifications[item.key as keyof AppSettings["notifications"]] && notificationPermission === "granted"
                                                ? "bg-[var(--accent)]/20"
                                                : "bg-[var(--background-hover)]"
                                            }`}>
                                            <item.icon className={`h-5 w-5 ${settings.notifications[item.key as keyof AppSettings["notifications"]] && notificationPermission === "granted"
                                                    ? "text-[var(--accent)]"
                                                    : "text-[var(--foreground-muted)]"
                                                }`} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[13px] font-medium">{item.label}</p>
                                            <p className="text-[11px] text-[var(--foreground-muted)]">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full p-0.5 transition-colors ${settings.notifications[item.key as keyof AppSettings["notifications"]] && notificationPermission === "granted"
                                            ? "bg-[var(--accent)]"
                                            : "bg-[var(--background-hover)]"
                                        }`}>
                                        <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.notifications[item.key as keyof AppSettings["notifications"]] && notificationPermission === "granted"
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                            }`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* Company Info */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Company Information</h2>
                        <p className="text-[12px] text-[var(--foreground-muted)]">Your organization details</p>
                    </div>
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <div>
                                <Label className="text-[12px] mb-2 block">Company Name</Label>
                                <Input
                                    value={settings.company.name}
                                    onChange={(e) => updateCompany("name", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-[12px] mb-2 block">Email</Label>
                                    <Input
                                        type="email"
                                        value={settings.company.email}
                                        onChange={(e) => updateCompany("email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-[12px] mb-2 block">Phone</Label>
                                    <Input
                                        value={settings.company.phone}
                                        onChange={(e) => updateCompany("phone", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <p className="text-[12px] text-[var(--foreground-muted)]">
                        Driver Payments Module v1.0
                    </p>
                    <Button onClick={saveSettings} className="gap-2">
                        {saved ? (
                            <>
                                <Check className="h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </DashboardShell>
    );
}
