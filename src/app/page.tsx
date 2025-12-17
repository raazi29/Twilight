"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { EarningsCard, EarningsToggle } from "@/components/earnings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { Users, Route, Truck, ArrowRight, Banknote, AlertCircle, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

// Stats Interface
interface DashboardStats {
    driversCount: number;
    routesCount: number;
    todaysTripsCount: number;
    earnings: {
        total_batta: number;
        total_salary: number;
        period: "weekly" | "monthly";
    };
    recentTrips: any[];
}

interface Driver {
    id: string;
    name: string;
    payment_preference: "batta_only" | "salary_only" | "split";
}

export default function DashboardPage() {
    const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
    const [stats, setStats] = useState<DashboardStats>({
        driversCount: 0,
        routesCount: 0,
        todaysTripsCount: 0,
        earnings: { total_batta: 0, total_salary: 0, period: "weekly" },
        recentTrips: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Settlement Dialog State
    const [isSettleOpen, setIsSettleOpen] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [settleLoading, setSettleLoading] = useState(false);

    // Default dates
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - (period === "weekly" ? 7 : 30));

    const [formData, setFormData] = useState({
        driver_id: "",
        settlement_type: period === "weekly" ? "batta" : "salary",
        period_start: defaultStart.toISOString().split("T")[0],
        period_end: new Date().toISOString().split("T")[0],
        notes: ""
    });

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [driversRes, routesRes, tripsRes, earningsRes] = await Promise.all([
                fetch("/api/drivers"),
                fetch("/api/routes"),
                fetch("/api/trips"),
                fetch(`/api/earnings?period=${period}`)
            ]);

            const driversData = await driversRes.json();
            const routes = await routesRes.json();
            const trips = await tripsRes.json();
            const earnings = await earningsRes.json();

            // Store drivers for settlement dialog
            setDrivers(driversData.data || []);

            const today = new Date().toISOString().split('T')[0];
            const todaysTrips = (trips.data || []).filter((t: any) => t.trip_date === today);
            const recentTrips = (trips.data || []).slice(0, 5);

            setStats({
                driversCount: (driversData.data || []).length,
                routesCount: (routes.data || []).length,
                todaysTripsCount: todaysTrips.length,
                earnings: {
                    total_batta: earnings.data?.total_batta || 0,
                    total_salary: earnings.data?.total_salary || 0,
                    period: period
                },
                recentTrips
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
            toast({
                variant: "error",
                title: "Error",
                description: "Failed to load dashboard statistics"
            });
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Update form when period changes
    useEffect(() => {
        const start = new Date();
        start.setDate(start.getDate() - (period === "weekly" ? 7 : 30));
        setFormData(prev => ({
            ...prev,
            settlement_type: period === "weekly" ? "batta" : "salary",
            period_start: start.toISOString().split("T")[0],
            period_end: new Date().toISOString().split("T")[0]
        }));
    }, [period]);

    const handleDriverChange = (driverId: string) => {
        const driver = drivers.find(d => d.id === driverId);
        let newType = formData.settlement_type;

        if (driver) {
            if (driver.payment_preference === "batta_only") newType = "batta";
            else if (driver.payment_preference === "salary_only") newType = "salary";
        }

        setFormData(prev => ({
            ...prev,
            driver_id: driverId,
            settlement_type: newType
        }));
    };

    const handleCreateSettlement = async () => {
        if (!formData.driver_id || !formData.period_start || !formData.period_end) {
            toast({ variant: "error", title: "Validation Error", description: "Please select a driver and dates" });
            return;
        }

        setSettleLoading(true);
        try {
            const res = await fetch("/api/settlements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create settlement");
            }

            toast({ variant: "success", title: "Success", description: "Settlement created successfully" });
            setIsSettleOpen(false);
            fetchDashboardData(); // Refresh

            // Reset form
            setFormData(prev => ({ ...prev, driver_id: "", notes: "" }));
        } catch (err: any) {
            console.error("Error creating settlement:", err);
            toast({ variant: "error", title: "Error", description: err.message });
        } finally {
            setSettleLoading(false);
        }
    };

    return (
        <DashboardShell>
            <Header title="Dashboard" subtitle="Overview of your transport operations" />

            <div className="p-6 space-y-6 animate-fade-in pb-24 md:pb-6">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <EarningsToggle value={period} onChange={setPeriod} />

                    <Dialog open={isSettleOpen} onOpenChange={setIsSettleOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1.5 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md text-white">
                                <Banknote className="h-3.5 w-3.5" />
                                Settle {period === "weekly" ? "Batta" : "Salary"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Create Settlement</DialogTitle>
                                <DialogDescription className="text-[14px]">
                                    Calculate and record {period === "weekly" ? "batta" : "salary"} payment for a driver.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-5 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="driver" className="text-sm font-medium">Driver</Label>
                                    <Select
                                        value={formData.driver_id}
                                        onValueChange={handleDriverChange}
                                    >
                                        <SelectTrigger id="driver" className="h-11">
                                            <SelectValue placeholder="Select driver to settle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map(driver => (
                                                <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Payment Type</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.settlement_type === 'batta' ? 'border-twilight-green-500 bg-twilight-green-500/5 ring-1 ring-twilight-green-500' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, settlement_type: 'batta' }))}
                                        >
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.settlement_type === 'batta' ? 'border-twilight-green-500' : 'border-slate-400'}`}>
                                                {formData.settlement_type === 'batta' && <div className="h-2 w-2 rounded-full bg-twilight-green-500" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Batta</p>
                                                <p className="text-xs text-slate-500">Weekly</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.settlement_type === 'salary' ? 'border-twilight-green-500 bg-twilight-green-500/5 ring-1 ring-twilight-green-500' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, settlement_type: 'salary' }))}
                                        >
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.settlement_type === 'salary' ? 'border-twilight-green-500' : 'border-slate-400'}`}>
                                                {formData.settlement_type === 'salary' && <div className="h-2 w-2 rounded-full bg-twilight-green-500" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Salary</p>
                                                <p className="text-xs text-slate-500">Monthly</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start" className="text-sm font-medium">Start Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="start"
                                                type="date"
                                                className="pl-10 h-11"
                                                value={formData.period_start}
                                                onChange={(e) => setFormData(prev => ({ ...prev, period_start: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end" className="text-sm font-medium">End Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="end"
                                                type="date"
                                                className="pl-10 h-11"
                                                value={formData.period_end}
                                                onChange={(e) => setFormData(prev => ({ ...prev, period_end: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Add any notes..."
                                        className="resize-none min-h-[80px]"
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setIsSettleOpen(false)} className="h-10">Cancel</Button>
                                <Button
                                    onClick={handleCreateSettlement}
                                    disabled={settleLoading}
                                    className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                >
                                    {settleLoading ? "Creating..." : "Create Settlement"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                        </div>
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="flex items-center gap-3 p-4">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="text-[13px] text-red-400">{error}</p>
                            <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Dashboard Content */}
                {!loading && !error && (
                    <>
                        {/* Earnings Summary */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <EarningsCard
                                title="Batta Payable"
                                amount={stats.earnings.total_batta}
                                periodLabel={period === "weekly" ? "This week" : "This month"}
                                variant="batta"
                            />
                            <EarningsCard
                                title="Salary Payable"
                                amount={stats.earnings.total_salary}
                                periodLabel={period === "weekly" ? "This week" : "This month"}
                                variant="salary"
                            />
                            <EarningsCard
                                title="Total Payable"
                                amount={stats.earnings.total_batta + stats.earnings.total_salary}
                                periodLabel="Total Earnings"
                                variant="total"
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid gap-3 md:grid-cols-3">
                            <Link href="/drivers">
                                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-twilight-blue-500/30">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-twilight-blue-50 dark:bg-twilight-blue-900/20 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-twilight-blue-600 dark:text-twilight-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Drivers</p>
                                                <p className="text-[20px] font-bold text-slate-900 dark:text-white tabular-nums">{stats.driversCount}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-400" />
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="/routes">
                                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-twilight-green-500/30">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-twilight-green-50 dark:bg-twilight-green-900/20 flex items-center justify-center">
                                                <Route className="h-5 w-5 text-twilight-green-600 dark:text-twilight-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Routes</p>
                                                <p className="text-[20px] font-bold text-slate-900 dark:text-white tabular-nums">{stats.routesCount}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-400" />
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="/trips">
                                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-amber-500/30">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                                <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Today&apos;s Trips</p>
                                                <p className="text-[20px] font-bold text-slate-900 dark:text-white tabular-nums">{stats.todaysTripsCount}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-400" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        {/* Recent Trips */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">Recent Trips</h3>
                                    <Link href="/trips">
                                        <Button variant="ghost" size="sm" className="text-[12px] gap-1">
                                            View All <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                                {stats.recentTrips.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-[13px]">
                                        No recent trips found
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {stats.recentTrips.map((trip: any) => (
                                            <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="h-8 w-8 rounded-full bg-twilight-blue-100 dark:bg-twilight-blue-900/30 flex items-center justify-center shrink-0">
                                                        <Truck className="h-4 w-4 text-twilight-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
                                                            {trip.driver?.name || "Unknown Driver"}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 truncate">
                                                            {trip.route?.name || "Unknown Route"} • {trip.trip_date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-3">
                                                    <p className="text-[13px] font-bold text-green-600 dark:text-green-400 tabular-nums">
                                                        {formatCurrency((trip.batta_earned || 0) + (trip.salary_earned || 0))}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </DashboardShell>
    );
}
