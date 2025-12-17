"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Calendar, Filter, AlertCircle, Truck, MapPin, User, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Driver {
    id: string;
    name: string;
    vehicle_number?: string;
    payment_preference: 'batta_only' | 'salary_only' | 'split';
}

interface Route {
    id: string;
    name: string;
    batta_per_trip: number;
    salary_per_trip: number;
}

interface Trip {
    id: string;
    driver_id: string;
    driver: Driver | null;
    route_id: string;
    route: Route | null;
    vehicle_number: string | null;
    trip_date: string;
    trip_count: number;
    batta_earned: number;
    salary_earned: number;
    created_at?: string;
}

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [filterDriver, setFilterDriver] = useState<string>("all");
    const [newTrip, setNewTrip] = useState({
        driver_id: "",
        route_id: "",
        vehicle_number: "",
        trip_date: new Date().toISOString().split("T")[0],
        trip_count: "1",
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tripsRes, driversRes, routesRes] = await Promise.all([
                fetch("/api/trips"),
                fetch("/api/drivers"),
                fetch("/api/routes"),
            ]);

            if (!tripsRes.ok || !driversRes.ok || !routesRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const [tripsData, driversData, routesData] = await Promise.all([
                tripsRes.json(),
                driversRes.json(),
                routesRes.json(),
            ]);

            setTrips(tripsData.data || []);
            setDrivers(driversData.data || []);
            setRoutes(routesData.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
            toast({ variant: "error", title: "Error", description: "Failed to load trips" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddTrip = async () => {
        if (!newTrip.driver_id || !newTrip.route_id) {
            toast({ variant: "error", title: "Validation", description: "Driver and route are required" });
            return;
        }

        const driver = drivers.find(d => d.id === newTrip.driver_id);
        const route = routes.find(r => r.id === newTrip.route_id);
        const tripCount = Number(newTrip.trip_count) || 1;

        // Calculate earnings based on driver preference
        let battaEarned = 0;
        let salaryEarned = 0;
        if (route && driver) {
            const totalBatta = route.batta_per_trip * tripCount;
            const totalSalary = route.salary_per_trip * tripCount;

            if (driver.payment_preference === 'batta_only') {
                battaEarned = totalBatta + totalSalary;
            } else if (driver.payment_preference === 'salary_only') {
                salaryEarned = totalBatta + totalSalary;
            } else {
                battaEarned = totalBatta;
                salaryEarned = totalSalary;
            }
        }

        const tempId = `temp-${Date.now()}`;
        const optimisticTrip: Trip = {
            id: tempId,
            driver_id: newTrip.driver_id,
            route_id: newTrip.route_id,
            vehicle_number: newTrip.vehicle_number || null,
            trip_date: newTrip.trip_date,
            trip_count: tripCount,
            batta_earned: battaEarned,
            salary_earned: salaryEarned,
            created_at: new Date().toISOString(),
            driver: driver || null,
            route: route || null,
        };

        setTrips(prev => [optimisticTrip, ...prev]);
        setIsAddDialogOpen(false);
        setNewTrip({
            driver_id: "",
            route_id: "",
            vehicle_number: "",
            trip_date: new Date().toISOString().split("T")[0],
            trip_count: "1",
        });
        toast({ variant: "success", title: "Success", description: "Trip recorded successfully" });

        try {
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    driver_id: newTrip.driver_id,
                    route_id: newTrip.route_id,
                    vehicle_number: newTrip.vehicle_number || null,
                    trip_date: newTrip.trip_date,
                    trip_count: tripCount,
                }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to add trip");
            }

            // Refresh to get server-calculated values
            await fetchData();
        } catch (err: any) {
            setTrips(prev => prev.filter(t => t.id !== tempId));
            toast({ variant: "error", title: "Error", description: err.message });
        }
    };

    const filteredTrips = filterDriver === "all"
        ? trips
        : trips.filter((t) => t.driver_id === filterDriver);

    const getDriverName = (trip: Trip) => trip.driver?.name || `Driver #${trip.driver_id}`;
    const getRouteName = (trip: Trip) => trip.route?.name || `Route #${trip.route_id}`;

    return (
        <DashboardShell>
            <Header title="Trips" subtitle={loading ? "Loading..." : `${filteredTrips.length} trips recorded`} />

            <div className="p-6 space-y-6 animate-fade-in pb-24 md:pb-6">
                {/* Filters & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <Select value={filterDriver} onValueChange={setFilterDriver}>
                            <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm">
                                <SelectValue placeholder="All Drivers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Drivers</SelectItem>
                                {drivers.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto gap-2 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Plus className="h-4 w-4" />
                                Record Trip
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Record New Trip</DialogTitle>
                                <DialogDescription>Enter trip details to calculate earnings automatically.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-5 pt-4">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Driver <span className="text-red-500">*</span></Label>
                                    <Select value={newTrip.driver_id} onValueChange={(v) => setNewTrip({ ...newTrip, driver_id: v })}>
                                        <SelectTrigger className="h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:ring-[var(--accent)]">
                                            <SelectValue placeholder="Search or select driver..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Route <span className="text-red-500">*</span></Label>
                                    <Select value={newTrip.route_id} onValueChange={(v) => setNewTrip({ ...newTrip, route_id: v })}>
                                        <SelectTrigger className="h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:ring-[var(--accent)]">
                                            <SelectValue placeholder="Select route..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((r) => (
                                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Trip Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="date"
                                                value={newTrip.trip_date}
                                                onChange={(e) => setNewTrip({ ...newTrip, trip_date: e.target.value })}
                                                className="pl-9 h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of Trips</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={newTrip.trip_count}
                                            onChange={(e) => setNewTrip({ ...newTrip, trip_count: e.target.value })}
                                            className="h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Number <span className="text-slate-400 font-normal">(Optional)</span></Label>
                                    <Input
                                        placeholder="TS09AB1234"
                                        value={newTrip.vehicle_number}
                                        onChange={(e) => setNewTrip({ ...newTrip, vehicle_number: e.target.value })}
                                        className="h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddTrip} disabled={submitting} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md">
                                    {submitting ? "Recording..." : "Record Trip"}
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
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && filteredTrips.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Truck className="h-16 w-16 text-slate-100 dark:text-slate-800 mb-4" />
                            <p className="text-base font-medium text-slate-900 dark:text-slate-200">No trips recorded</p>
                            <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">Record your first trip to start tracking daily earnings and performance.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Record Trip
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Trips Table */}
                {!loading && !error && filteredTrips.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead className="text-center">Trips</TableHead>
                                        <TableHead className="text-right">Batta</TableHead>
                                        <TableHead className="text-right">Salary</TableHead>
                                        <TableHead className="text-right">Total Earnings</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTrips.map((trip) => (
                                        <TableRow key={trip.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatDate(trip.trip_date)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{getDriverName(trip)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {getRouteName(trip)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-xs font-normal">
                                                    {trip.vehicle_number || "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {trip.trip_count}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {trip.batta_earned > 0 ? (
                                                    <span className="text-amber-600 dark:text-amber-400 font-medium tabular-nums">{formatCurrency(trip.batta_earned)}</span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {trip.salary_earned > 0 ? (
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium tabular-nums">{formatCurrency(trip.salary_earned)}</span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900 dark:text-white tabular-nums">
                                                {formatCurrency(trip.batta_earned + trip.salary_earned)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardShell>
    );
}
