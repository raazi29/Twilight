"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { EarningsCard, EarningsToggle, SettleButton } from "@/components/earnings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Users, Route, Truck, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface EarningsData {
    total_batta: number;
    total_salary: number;
    unsettled_batta: number;
    unsettled_salary: number;
    trip_count: number;
    period_start: string;
    period_end: string;
}

export default function DashboardPage() {
    const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [stats, setStats] = useState({ drivers: 0, routes: 0, trips: 0 });
    const [recentTrips, setRecentTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [earningsRes, driversRes, routesRes, tripsRes] = await Promise.all([
                fetch(`/api/earnings?period=${period}`),
                fetch("/api/drivers"),
                fetch("/api/routes"),
                fetch("/api/trips"),
            ]);

            const earningsData = await earningsRes.json();
            const driversData = await driversRes.json();
            const routesData = await routesRes.json();
            const tripsData = await tripsRes.json();

            if (earningsData.data) setEarnings(earningsData.data);
            setStats({
                drivers: driversData.data?.length || 0,
                routes: routesData.data?.length || 0,
                trips: tripsData.data?.length || 0,
            });
            setRecentTrips((tripsData.data || []).slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSettle = async () => {
        // Refetch data after settlement
        await fetchData();
    };

    const periodLabel = period === "weekly"
        ? `${earnings?.period_start || ''} - ${earnings?.period_end || ''}`
        : "This month";

    return (
        <DashboardShell>
            <Header title="Dashboard" />

            <div className="p-6 space-y-6 animate-fade-in">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <EarningsToggle value={period} onChange={setPeriod} />

                    {earnings && (
                        <SettleButton
                            type={period === "weekly" ? "batta" : "salary"}
                            amount={period === "weekly" ? earnings.unsettled_batta : earnings.unsettled_salary}
                            periodLabel={periodLabel}
                            onSettle={handleSettle}
                            disabled={loading}
                        />
                    )}
                </div>

                {/* Earnings Summary */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--foreground-muted)]" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        <EarningsCard
                            title="Batta Payable"
                            amount={earnings?.unsettled_batta || 0}
                            periodLabel={period === "weekly" ? "This week" : "This month"}
                            variant="batta"
                        />
                        <EarningsCard
                            title="Salary Payable"
                            amount={earnings?.unsettled_salary || 0}
                            periodLabel={period === "weekly" ? "This week" : "This month"}
                            variant="salary"
                        />
                        <EarningsCard
                            title="Total Payable"
                            amount={(earnings?.unsettled_batta || 0) + (earnings?.unsettled_salary || 0)}
                            periodLabel={`${earnings?.trip_count || 0} trips`}
                            variant="total"
                        />
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid gap-3 md:grid-cols-3">
                    <Link href="/drivers">
                        <Card className="group cursor-pointer hover:border-[var(--border-strong)] transition-colors">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-twilight-blue-100 dark:bg-twilight-blue-600/20">
                                        <Users className="h-4 w-4 text-twilight-blue-600 dark:text-twilight-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
                                            {stats.drivers}
                                        </p>
                                        <p className="text-[11px] text-[var(--foreground-muted)]">Active Drivers</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/routes">
                        <Card className="group cursor-pointer hover:border-[var(--border-strong)] transition-colors">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-600/20">
                                        <Route className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
                                            {stats.routes}
                                        </p>
                                        <p className="text-[11px] text-[var(--foreground-muted)]">Routes</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/trips">
                        <Card className="group cursor-pointer hover:border-[var(--border-strong)] transition-colors">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-twilight-green-100 dark:bg-twilight-green-600/20">
                                        <Truck className="h-4 w-4 text-twilight-green-600 dark:text-twilight-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
                                            {stats.trips}
                                        </p>
                                        <p className="text-[11px] text-[var(--foreground-muted)]">Total Trips</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Trips */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[13px] font-medium text-[var(--foreground-secondary)]">Recent Trips</h2>
                        <Link href="/trips" className="text-[12px] text-[var(--accent)] hover:underline">
                            View all
                        </Link>
                    </div>

                    <Card>
                        <div className="divide-y divide-[var(--border)]">
                            {recentTrips.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-[13px] text-[var(--foreground-muted)]">
                                        No trips recorded yet. <Link href="/trips" className="text-[var(--accent)] hover:underline">Add your first trip</Link>
                                    </p>
                                </div>
                            ) : (
                                recentTrips.map((trip) => (
                                    <div key={trip.id} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] text-[var(--foreground)]">
                                                {trip.driver?.name || "Unknown Driver"}
                                            </span>
                                            <span className="text-[11px] text-[var(--foreground-muted)]">
                                                {trip.route?.name || "Unknown Route"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                                                    {formatCurrency((trip.batta_earned || 0) + (trip.salary_earned || 0))}
                                                </span>
                                                <div className="flex items-center gap-2 justify-end mt-0.5">
                                                    {trip.batta_earned > 0 && <Badge variant="warning">B: {formatCurrency(trip.batta_earned)}</Badge>}
                                                    {trip.salary_earned > 0 && <Badge variant="info">S: {formatCurrency(trip.salary_earned)}</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}
