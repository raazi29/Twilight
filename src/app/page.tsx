"use client";

import { useState } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { EarningsCard, EarningsToggle } from "@/components/earnings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Route, Truck, ArrowRight, Banknote } from "lucide-react";
import Link from "next/link";

// Demo data
const DEMO_EARNINGS = {
    batta: 85000,
    salary: 245000,
    tripCount: 142,
};

const DEMO_STATS = {
    drivers: 4,
    routes: 4,
    trips: 28,
};

const DEMO_TRIPS = [
    { id: "1", driver: "Rajesh Kumar", route: "Hyderabad → Tirupati", batta: 1000, salary: 600 },
    { id: "2", driver: "Suresh Reddy", route: "Chennai → Bangalore", batta: 1300, salary: 0 },
    { id: "3", driver: "Venkat Rao", route: "Hyderabad → Mumbai", batta: 0, salary: 2500 },
    { id: "4", driver: "Krishna Murthy", route: "Vizag → Hyderabad", batta: 600, salary: 400 },
];

export default function DashboardPage() {
    const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

    return (
        <DashboardShell>
            <Header title="Dashboard" />

            <div className="p-6 space-y-6 animate-fade-in">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <EarningsToggle value={period} onChange={setPeriod} />

                    <Button size="sm" className="gap-1.5">
                        <Banknote className="h-3.5 w-3.5" />
                        Settle {period === "weekly" ? "Batta" : "Salary"}
                    </Button>
                </div>

                {/* Earnings Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <EarningsCard
                        title="Batta Payable"
                        amount={DEMO_EARNINGS.batta}
                        periodLabel={period === "weekly" ? "This week" : "This month"}
                        variant="batta"
                        trend={{ value: 12, direction: "up" }}
                    />
                    <EarningsCard
                        title="Salary Payable"
                        amount={DEMO_EARNINGS.salary}
                        periodLabel={period === "weekly" ? "This week" : "This month"}
                        variant="salary"
                        trend={{ value: 8, direction: "up" }}
                    />
                    <EarningsCard
                        title="Total Payable"
                        amount={DEMO_EARNINGS.batta + DEMO_EARNINGS.salary}
                        periodLabel={`${DEMO_EARNINGS.tripCount} trips`}
                        variant="total"
                    />
                </div>

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
                                            {DEMO_STATS.drivers}
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
                                            {DEMO_STATS.routes}
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
                                            {DEMO_STATS.trips}
                                        </p>
                                        <p className="text-[11px] text-[var(--foreground-muted)]">Trips Today</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[13px] font-medium text-[var(--foreground-secondary)]">Recent Trips</h2>
                        <Link href="/trips" className="text-[12px] text-[var(--accent)] hover:underline">
                            View all
                        </Link>
                    </div>

                    <Card>
                        <div className="divide-y divide-[var(--border)]">
                            {DEMO_TRIPS.map((trip) => (
                                <div key={trip.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-[var(--foreground)]">{trip.driver}</span>
                                        <span className="text-[11px] text-[var(--foreground-muted)]">{trip.route}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                                                {formatCurrency(trip.batta + trip.salary)}
                                            </span>
                                            <div className="flex items-center gap-2 justify-end mt-0.5">
                                                {trip.batta > 0 && <Badge variant="warning">B: {formatCurrency(trip.batta)}</Badge>}
                                                {trip.salary > 0 && <Badge variant="info">S: {formatCurrency(trip.salary)}</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}
