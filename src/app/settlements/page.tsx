"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { ChevronDown, ChevronRight, Filter, AlertCircle, Plus, Calendar, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";

interface Trip {
    date: string;
    route: string;
    count: number;
    amount: number;
}

interface Settlement {
    id: string;
    driver_id: string;
    driver: { name: string } | null;
    settlement_type: "batta" | "salary";
    period_start: string;
    period_end: string;
    amount: number;
    status: "pending" | "paid";
    settled_at: string | null;
    trips: Trip[];
}

interface Driver {
    id: string;
    name: string;
    payment_preference: "batta_only" | "salary_only" | "split";
}

interface ExpandedRows { [key: string]: boolean; }

// Wrapper with Suspense for useSearchParams
export default function SettlementsPage() {
    return (
        <Suspense fallback={
            <DashboardShell>
                <Header title="Settlements" subtitle="Loading..." />
                <div className="p-6 space-y-4 animate-fade-in pb-24 md:pb-6">
                    <div className="grid gap-3 md:grid-cols-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                    </div>
                </div>
            </DashboardShell>
        }>
            <SettlementsContent />
        </Suspense>
    );
}

function SettlementsContent() {
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    // ... (rest of state)

    // Helper to auto-select type based on driver
    const handleDriverChange = (driverId: string) => {
        const driver = drivers.find(d => d.id === driverId);
        let newType = formData.settlement_type;

        if (driver) {
            if (driver.payment_preference === "batta_only") newType = "batta";
            else if (driver.payment_preference === "salary_only") newType = "salary";
            // If split, keep current or default to batta
        }

        setFormData(prev => ({
            ...prev,
            driver_id: driverId,
            settlement_type: newType
        }));
    };

    // ... (rest of component, replacing setFormData in Select with handleDriverChange)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Create Settlement State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Default start date to first day of current month, or 30 days ago to be safe
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 30);

    const [formData, setFormData] = useState({
        driver_id: "",
        settlement_type: "batta",
        period_start: defaultStart.toISOString().split("T")[0],
        period_end: new Date().toISOString().split("T")[0],
        notes: ""
    });

    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize from URL params
    useEffect(() => {
        const type = searchParams.get("type");
        const openCreate = searchParams.get("open_create");

        if (type) {
            setFormData(prev => ({ ...prev, settlement_type: type }));
        }
        if (openCreate === "true") {
            setIsCreateOpen(true);
            // Default period start to 7 days ago if opening fresh
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            setFormData(prev => ({
                ...prev,
                period_start: lastWeek.toISOString().split("T")[0]
            }));
        }
    }, [searchParams]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch settlements and drivers in parallel
            const settlementsParams = new URLSearchParams();
            if (filterType !== "all") settlementsParams.append("type", filterType);
            if (filterStatus !== "all") settlementsParams.append("status", filterStatus);

            const [settlementsRes, driversRes] = await Promise.all([
                fetch(`/api/settlements?${settlementsParams.toString()}`),
                fetch("/api/drivers")
            ]);

            if (!settlementsRes.ok) throw new Error("Failed to fetch settlements");
            const settlementsData = await settlementsRes.json();

            // Transform API response
            const transformed = (settlementsData.data || []).map((s: any) => ({
                ...s,
                trips: s.trips || [],
                amount: s.amount || (s.trips || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
            }));
            setSettlements(transformed);

            if (driversRes.ok) {
                const driversData = await driversRes.json();
                setDrivers(driversData.data || []);
            }

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
            toast({ variant: "error", title: "Error", description: "Failed to load settlements" });
        } finally {
            setLoading(false);
        }
    }, [filterType, filterStatus]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateSettlement = async () => {
        if (!formData.driver_id || !formData.period_start || !formData.period_end) {
            toast({ variant: "error", title: "Validation Error", description: "Please fill all required fields" });
            return;
        }

        setCreateLoading(true);
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
            setIsCreateOpen(false);
            fetchData(); // Refresh list

            // Clear URL params
            router.push("/settlements");
        } catch (err: any) {
            console.error("Error creating settlement:", err);
            toast({ variant: "error", title: "Error", description: err.message });
        } finally {
            setCreateLoading(false);
        }
    };

    // ... existing functions

    const handleMarkAsPaid = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row toggle

        try {
            const res = await fetch(`/api/settlements/${id}`, {
                method: 'PATCH',
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast({ variant: "success", title: "Success", description: "Settlement marked as paid" });
            fetchData(); // Refresh list
        } catch (err) {
            toast({ variant: "error", title: "Error", description: "Failed to update settlement" });
        }
    };

    // Helper to toggle expanded rows
    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Calculate totals for summary cards
    const totalPaid = settlements.filter(s => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
    const totalPending = settlements.filter(s => s.status === "pending").reduce((sum, s) => sum + s.amount, 0);

    // Helper to get driver name from settlement
    const getDriverName = (settlement: Settlement) => {
        if (settlement.driver?.name) return settlement.driver.name;
        const driver = drivers.find(d => d.id === settlement.driver_id);
        return driver?.name || "Unknown Driver";
    };

    return (
        <DashboardShell>
            <Header title="Settlements" subtitle={loading ? "Loading..." : `${settlements.length} settlements`} />

            <div className="p-6 space-y-4 animate-fade-in pb-24 md:pb-6">
                {/* Summary */}
                <div className="grid gap-3 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Total Paid</p>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <p className="text-[24px] font-bold text-green-600 dark:text-green-400 tabular-nums">{formatCurrency(totalPaid)}</p>
                                )}
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <Badge variant="success" className="h-2 w-2 p-0 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Pending</p>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <p className="text-[24px] font-bold text-amber-600 dark:text-amber-400 tabular-nums">{formatCurrency(totalPending)}</p>
                                )}
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <Badge variant="warning" className="h-2 w-2 p-0 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Total Value</p>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <p className="text-[24px] font-bold text-slate-900 dark:text-white tabular-nums">{formatCurrency(totalPaid + totalPending)}</p>
                                )}
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-500">{settlements.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[110px] h-9 text-[13px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="batta">Batta</SelectItem>
                                <SelectItem value="salary">Salary</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[110px] h-9 text-[13px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto gap-1.5 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 shadow-md shadow-lime-500/20 text-white">
                                <Plus className="h-4 w-4" />
                                New Settlement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Create Settlement</DialogTitle>
                                <DialogDescription className="text-[14px]">
                                    Calculate and record payment for drivers based on their trips.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6" id="create-settlement-form">
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
                                    <Label htmlFor="type" className="text-sm font-medium">Payment Type</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.settlement_type === 'batta' ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, settlement_type: 'batta' }))}
                                        >
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.settlement_type === 'batta' ? 'border-[var(--accent)]' : 'border-slate-400'}`}>
                                                {formData.settlement_type === 'batta' && <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-[var(--foreground)]">Batta</p>
                                                <p className="text-xs text-[var(--foreground-muted)]">Weekly expenses</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.settlement_type === 'salary' ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, settlement_type: 'salary' }))}
                                        >
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.settlement_type === 'salary' ? 'border-[var(--accent)]' : 'border-slate-400'}`}>
                                                {formData.settlement_type === 'salary' && <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-[var(--foreground)]">Salary</p>
                                                <p className="text-xs text-[var(--foreground-muted)]">Monthly earnings</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
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
                                        placeholder="Add any additional notes for this settlement..."
                                        className="resize-none min-h-[100px]"
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0 pt-2 pb-2">
                                <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="h-11">Cancel</Button>
                                <Button
                                    onClick={() => {
                                        console.log("Submitting settlement:", formData);
                                        handleCreateSettlement();
                                    }}
                                    disabled={createLoading}
                                    className="h-11 px-8 bg-[var(--accent)] hover:opacity-90 text-[var(--accent-foreground)] shadow-md"
                                >
                                    {createLoading ? "Calculating..." : "Calculate & Create"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Error State */}
                {error && (
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="flex items-center gap-3 p-4">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="text-[13px] text-red-400">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {loading && (
                    <Card>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="px-4 py-3">
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && settlements.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <Calculator className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 dark:text-slate-200">No settlements found</p>
                            <p className="text-[13px] text-slate-500 mt-1 max-w-xs text-center">
                                Create your first settlement by clicking the &quot;New Settlement&quot; button above.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Settlements List */}
                {!loading && !error && settlements.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {settlements.map((settlement) => (
                                <div key={settlement.id} className="bg-white dark:bg-slate-900">
                                    <div
                                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        onClick={() => toggleRow(settlement.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-slate-400">
                                                {expandedRows[settlement.id] ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-[14px] font-medium text-slate-900 dark:text-slate-100 block">
                                                    {getDriverName(settlement)}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={settlement.settlement_type === "batta" ? "warning" : "info"} className="text-[10px] h-5 px-1.5">
                                                        {settlement.settlement_type === "batta" ? "Batta" : "Salary"}
                                                    </Badge>
                                                    <span className="text-[11px] text-slate-500">
                                                        {formatDateRange(settlement.period_start, settlement.period_end)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-[15px] font-bold text-slate-900 dark:text-white tabular-nums block">
                                                    {formatCurrency(settlement.amount)}
                                                </span>
                                                <div className="mt-1 flex items-center justify-end gap-2">
                                                    <Badge variant={settlement.status === "paid" ? "success" : "default"} className="text-[10px] h-5 px-1.5">
                                                        {settlement.status === "paid" ? "Paid" : "Pending"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRows[settlement.id] && (
                                        <div className="px-4 pb-4 pl-12 animate-in slide-in-from-top-2 duration-200">
                                            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
                                                {settlement.trips.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-[12px]">
                                                            <thead>
                                                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50">
                                                                    <th className="px-3 py-2 text-left text-slate-500 font-semibold">Date</th>
                                                                    <th className="px-3 py-2 text-left text-slate-500 font-semibold">Route</th>
                                                                    <th className="px-3 py-2 text-center text-slate-500 font-semibold">Trips</th>
                                                                    <th className="px-3 py-2 text-right text-slate-500 font-semibold">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                                {settlement.trips.map((trip, i) => (
                                                                    <tr key={i}>
                                                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{trip.date}</td>
                                                                        <td className="px-3 py-2 text-slate-900 dark:text-slate-300 font-medium">{trip.route}</td>
                                                                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{trip.count}</td>
                                                                        <td className="px-3 py-2 text-right text-slate-900 dark:text-slate-200 tabular-nums">{formatCurrency(trip.amount)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr className="bg-slate-100 dark:bg-slate-800">
                                                                    <td colSpan={3} className="px-3 py-2 text-right text-slate-500 font-semibold">Total</td>
                                                                    <td className="px-3 py-2 text-right text-green-600 dark:text-green-400 font-bold tabular-nums">{formatCurrency(settlement.amount)}</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-slate-500 text-[12px]">
                                                        No trip details available for this settlement
                                                    </div>
                                                )}

                                                {/* Mark as Paid Action */}
                                                {settlement.status === 'pending' && (
                                                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={(e) => handleMarkAsPaid(settlement.id, e)}
                                                        >
                                                            Mark as Paid
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </DashboardShell>
    );
}
