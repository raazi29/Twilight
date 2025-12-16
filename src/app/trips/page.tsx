"use client";

import { useState } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Calendar, Filter } from "lucide-react";

const DEMO_DRIVERS = [
    { id: "1", name: "Rajesh Kumar" },
    { id: "2", name: "Suresh Reddy" },
    { id: "3", name: "Venkat Rao" },
    { id: "4", name: "Krishna Murthy" },
];

const DEMO_ROUTES = [
    { id: "1", name: "Hyderabad → Tirupati" },
    { id: "2", name: "Chennai → Bangalore" },
    { id: "3", name: "Hyderabad → Mumbai" },
    { id: "4", name: "Vizag → Hyderabad" },
];

const DEMO_TRIPS = [
    { id: "1", driver_id: "1", driver_name: "Rajesh Kumar", route_id: "1", route_name: "Hyderabad → Tirupati", vehicle_number: "TS09AB1234", trip_date: "2024-12-15", trip_count: 2, batta_earned: 1000, salary_earned: 600 },
    { id: "2", driver_id: "2", driver_name: "Suresh Reddy", route_id: "2", route_name: "Chennai → Bangalore", vehicle_number: "TN01CD5678", trip_date: "2024-12-14", trip_count: 1, batta_earned: 1300, salary_earned: 0 },
    { id: "3", driver_id: "3", driver_name: "Venkat Rao", route_id: "3", route_name: "Hyderabad → Mumbai", vehicle_number: "TS10EF9012", trip_date: "2024-12-14", trip_count: 1, batta_earned: 0, salary_earned: 2500 },
    { id: "4", driver_id: "1", driver_name: "Rajesh Kumar", route_id: "4", route_name: "Vizag → Hyderabad", vehicle_number: "TS09AB1234", trip_date: "2024-12-13", trip_count: 1, batta_earned: 600, salary_earned: 400 },
    { id: "5", driver_id: "4", driver_name: "Krishna Murthy", route_id: "1", route_name: "Hyderabad → Tirupati", vehicle_number: "AP05GH3456", trip_date: "2024-12-13", trip_count: 3, batta_earned: 1500, salary_earned: 900 },
];

export default function TripsPage() {
    const [trips, setTrips] = useState(DEMO_TRIPS);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [filterDriver, setFilterDriver] = useState<string>("all");
    const [newTrip, setNewTrip] = useState({
        driver_id: "",
        route_id: "",
        vehicle_number: "",
        trip_date: new Date().toISOString().split("T")[0],
        trip_count: "1",
    });

    const handleAddTrip = () => {
        const driver = DEMO_DRIVERS.find((d) => d.id === newTrip.driver_id);
        const route = DEMO_ROUTES.find((r) => r.id === newTrip.route_id);
        const batta = 500 * Number(newTrip.trip_count);
        const salary = 300 * Number(newTrip.trip_count);

        const trip = {
            id: String(trips.length + 1),
            driver_id: newTrip.driver_id,
            driver_name: driver?.name || "",
            route_id: newTrip.route_id,
            route_name: route?.name || "",
            vehicle_number: newTrip.vehicle_number,
            trip_date: newTrip.trip_date,
            trip_count: Number(newTrip.trip_count),
            batta_earned: batta,
            salary_earned: salary,
        };
        setTrips([trip, ...trips]);
        setIsAddDialogOpen(false);
        setNewTrip({ driver_id: "", route_id: "", vehicle_number: "", trip_date: new Date().toISOString().split("T")[0], trip_count: "1" });
    };

    const filteredTrips = filterDriver === "all" ? trips : trips.filter((t) => t.driver_id === filterDriver);

    return (
        <DashboardShell>
            <Header title="Trips" subtitle={`${filteredTrips.length} trips`} />

            <div className="p-6 space-y-4 animate-fade-in">
                {/* Filters & Actions */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Filter className="h-4 w-4" />
                        <Select value={filterDriver} onValueChange={setFilterDriver}>
                            <SelectTrigger className="w-[180px] h-8 text-[13px]">
                                <SelectValue placeholder="All Drivers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Drivers</SelectItem>
                                {DEMO_DRIVERS.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                Add Trip
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Record Trip</DialogTitle>
                                <DialogDescription>Add completed trip for earnings</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 p-5 pt-0">
                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Driver</Label>
                                    <Select value={newTrip.driver_id} onValueChange={(v) => setNewTrip({ ...newTrip, driver_id: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                                        <SelectContent>
                                            {DEMO_DRIVERS.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Route</Label>
                                    <Select value={newTrip.route_id} onValueChange={(v) => setNewTrip({ ...newTrip, route_id: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                                        <SelectContent>
                                            {DEMO_ROUTES.map((r) => (
                                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Vehicle</Label>
                                        <Input placeholder="TS09AB1234" value={newTrip.vehicle_number} onChange={(e) => setNewTrip({ ...newTrip, vehicle_number: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Trips</Label>
                                        <Input type="number" min="1" value={newTrip.trip_count} onChange={(e) => setNewTrip({ ...newTrip, trip_count: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Date</Label>
                                    <Input type="date" value={newTrip.trip_date} onChange={(e) => setNewTrip({ ...newTrip, trip_date: e.target.value })} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button size="sm" onClick={handleAddTrip}>Add Trip</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Trips Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead className="text-center">Trips</TableHead>
                                <TableHead className="text-right">Batta</TableHead>
                                <TableHead className="text-right">Salary</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTrips.map((trip) => (
                                <TableRow key={trip.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(trip.trip_date)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{trip.driver_name}</TableCell>
                                    <TableCell>{trip.route_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" dot={false}>{trip.vehicle_number}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[var(--background-hover)] text-[11px] font-medium">
                                            {trip.trip_count}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {trip.batta_earned > 0 ? (
                                            <span className="text-amber-500 tabular-nums">{formatCurrency(trip.batta_earned)}</span>
                                        ) : (
                                            <span className="text-[var(--foreground-muted)]">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {trip.salary_earned > 0 ? (
                                            <span className="text-blue-500 tabular-nums">{formatCurrency(trip.salary_earned)}</span>
                                        ) : (
                                            <span className="text-[var(--foreground-muted)]">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        {formatCurrency(trip.batta_earned + trip.salary_earned)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </DashboardShell>
    );
}
