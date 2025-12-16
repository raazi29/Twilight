"use client";

import { useState } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/utils";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";

const DEMO_SETTLEMENTS = [
    { id: "1", driver_id: "1", driver_name: "Rajesh Kumar", settlement_type: "batta" as const, period_start: "2024-12-09", period_end: "2024-12-15", amount: 8500, status: "paid" as const, settled_at: "2024-12-15", trips: [{ date: "Dec 15", route: "Hyd → Tirupati", count: 2, amount: 1000 }, { date: "Dec 14", route: "Chennai → Blr", count: 1, amount: 800 }, { date: "Dec 13", route: "Vizag → Hyd", count: 3, amount: 1800 }] },
    { id: "2", driver_id: "2", driver_name: "Suresh Reddy", settlement_type: "batta" as const, period_start: "2024-12-09", period_end: "2024-12-15", amount: 6200, status: "paid" as const, settled_at: "2024-12-15", trips: [{ date: "Dec 15", route: "Chennai → Blr", count: 2, amount: 1600 }, { date: "Dec 13", route: "Hyd → Tirupati", count: 3, amount: 1500 }] },
    { id: "3", driver_id: "3", driver_name: "Venkat Rao", settlement_type: "salary" as const, period_start: "2024-11-01", period_end: "2024-11-30", amount: 35000, status: "paid" as const, settled_at: "2024-12-01", trips: [{ date: "Nov 2024", route: "Multiple", count: 28, amount: 35000 }] },
    { id: "4", driver_id: "4", driver_name: "Krishna Murthy", settlement_type: "batta" as const, period_start: "2024-12-09", period_end: "2024-12-15", amount: 4500, status: "pending" as const, settled_at: null, trips: [{ date: "Dec 14", route: "Hyd → Tirupati", count: 3, amount: 1500 }, { date: "Dec 12", route: "Chennai → Blr", count: 2, amount: 1600 }] },
];

interface ExpandedRows { [key: string]: boolean; }

export default function SettlementsPage() {
    const [settlements] = useState(DEMO_SETTLEMENTS);
    const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredSettlements = settlements.filter((s) => {
        if (filterType !== "all" && s.settlement_type !== filterType) return false;
        if (filterStatus !== "all" && s.status !== filterStatus) return false;
        return true;
    });

    const totalPaid = settlements.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
    const totalPending = settlements.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.amount, 0);

    return (
        <DashboardShell>
            <Header title="Settlements" subtitle={`${filteredSettlements.length} settlements`} />

            <div className="p-6 space-y-4 animate-fade-in">
                {/* Summary */}
                <div className="grid gap-3 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">Total Paid</p>
                                <p className="text-[22px] font-semibold text-green-400 tabular-nums">{formatCurrency(totalPaid)}</p>
                            </div>
                            <Badge variant="success">Paid</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">Pending</p>
                                <p className="text-[22px] font-semibold text-amber-400 tabular-nums">{formatCurrency(totalPending)}</p>
                            </div>
                            <Badge variant="warning">Pending</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">Total</p>
                                <p className="text-[22px] font-semibold text-white tabular-nums">{formatCurrency(totalPaid + totalPending)}</p>
                            </div>
                            <span className="text-[11px] text-slate-500">{settlements.length} records</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[120px] h-8 text-[13px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="batta">Batta</SelectItem>
                            <SelectItem value="salary">Salary</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[120px] h-8 text-[13px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Settlements List */}
                <Card>
                    <div className="divide-y divide-white/[0.04]">
                        {filteredSettlements.map((settlement) => (
                            <div key={settlement.id}>
                                <div
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                    onClick={() => toggleRow(settlement.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-500">
                                            {expandedRows[settlement.id] ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-[13px] font-medium text-white">{settlement.driver_name}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant={settlement.settlement_type === "batta" ? "warning" : "info"}>
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
                                            <span className="text-[15px] font-semibold text-white tabular-nums">
                                                {formatCurrency(settlement.amount)}
                                            </span>
                                            <div className="mt-0.5">
                                                <Badge variant={settlement.status === "paid" ? "success" : "warning"}>
                                                    {settlement.status === "paid" ? "Paid" : "Pending"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedRows[settlement.id] && (
                                    <div className="px-4 pb-4 pl-12 animate-slide-down">
                                        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                            <table className="w-full text-[12px]">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        <th className="px-3 py-2 text-left text-slate-500 font-medium">Date</th>
                                                        <th className="px-3 py-2 text-left text-slate-500 font-medium">Route</th>
                                                        <th className="px-3 py-2 text-center text-slate-500 font-medium">Trips</th>
                                                        <th className="px-3 py-2 text-right text-slate-500 font-medium">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {settlement.trips.map((trip, i) => (
                                                        <tr key={i} className="border-b border-white/[0.04] last:border-0">
                                                            <td className="px-3 py-2 text-slate-400">{trip.date}</td>
                                                            <td className="px-3 py-2 text-slate-300">{trip.route}</td>
                                                            <td className="px-3 py-2 text-center text-slate-300">{trip.count}</td>
                                                            <td className="px-3 py-2 text-right text-white tabular-nums">{formatCurrency(trip.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-white/[0.02]">
                                                        <td colSpan={3} className="px-3 py-2 text-right text-slate-400 font-medium">Total</td>
                                                        <td className="px-3 py-2 text-right text-[#84cc16] font-semibold tabular-nums">{formatCurrency(settlement.amount)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardShell>
    );
}
