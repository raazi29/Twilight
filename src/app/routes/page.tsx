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
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, MapPin, AlertCircle, Route as RouteIcon, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Route {
    id: string;
    name: string;
    origin: string;
    destination: string;
    batta_per_trip: number;
    salary_per_trip: number;
}

const emptyRoute = {
    name: "",
    origin: "",
    destination: "",
    batta_per_trip: "",
    salary_per_trip: "",
};

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [formData, setFormData] = useState(emptyRoute);

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/routes");
            if (!res.ok) throw new Error("Failed to fetch routes");
            const { data } = await res.json();
            setRoutes(data || []);
        } catch (err) {
            console.error("Error fetching routes:", err);
            setError("Failed to load routes");
            toast({ variant: "error", title: "Error", description: "Failed to load routes" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    // Add route
    const handleAddRoute = async () => {
        if (!formData.origin.trim() || !formData.destination.trim()) {
            toast({ variant: "error", title: "Validation", description: "Origin and destination are required" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/routes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name || `${formData.origin} → ${formData.destination}`,
                    origin: formData.origin,
                    destination: formData.destination,
                    batta_per_trip: Number(formData.batta_per_trip) || 0,
                    salary_per_trip: Number(formData.salary_per_trip) || 0,
                }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to add route");
            }

            const { data } = await res.json();
            setRoutes([...routes, data]);
            setIsAddDialogOpen(false);
            setFormData(emptyRoute);
            toast({ variant: "success", title: "Success", description: "Route added successfully" });
        } catch (err: any) {
            toast({ variant: "error", title: "Error", description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    // Edit route
    const openEditDialog = (route: Route) => {
        setSelectedRoute(route);
        setFormData({
            name: route.name,
            origin: route.origin,
            destination: route.destination,
            batta_per_trip: String(route.batta_per_trip),
            salary_per_trip: String(route.salary_per_trip),
        });
        setIsEditDialogOpen(true);
    };

    const handleEditRoute = async () => {
        if (!selectedRoute || !formData.origin.trim() || !formData.destination.trim()) {
            toast({ variant: "error", title: "Validation", description: "Origin and destination are required" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/routes/${selectedRoute.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name || `${formData.origin} → ${formData.destination}`,
                    origin: formData.origin,
                    destination: formData.destination,
                    batta_per_trip: Number(formData.batta_per_trip) || 0,
                    salary_per_trip: Number(formData.salary_per_trip) || 0,
                }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to update route");
            }

            const { data } = await res.json();
            setRoutes(routes.map(r => r.id === selectedRoute.id ? data : r));
            setIsEditDialogOpen(false);
            setSelectedRoute(null);
            setFormData(emptyRoute);
            toast({ variant: "success", title: "Updated", description: "Route updated successfully" });
        } catch (err: any) {
            toast({ variant: "error", title: "Error", description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    // Delete route
    const openDeleteDialog = (route: Route) => {
        setSelectedRoute(route);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteRoute = async () => {
        if (!selectedRoute) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/routes/${selectedRoute.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete route");

            setRoutes(routes.filter((r) => r.id !== selectedRoute.id));
            setIsDeleteDialogOpen(false);
            setSelectedRoute(null);
            toast({ variant: "success", title: "Deleted", description: "Route removed" });
        } catch (err) {
            toast({ variant: "error", title: "Error", description: "Failed to delete route" });
        } finally {
            setSubmitting(false);
        }
    };

    // Shared form component with improved spacing
    const RouteForm = () => (
        <div className="grid gap-6 py-4">
            <div className="grid gap-2">
                <Label className="text-sm font-medium">Route Name <span className="text-slate-400 font-normal">(Auto-generated if empty)</span></Label>
                <Input
                    placeholder="e.g., Hyderabad - Tirupati Express"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Origin <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="City"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            className="pl-9 h-10"
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Destination <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="City"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="pl-9 h-10"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <Label className="text-sm font-medium mb-3 block">Earnings Configuration per Trip</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Batta Amount</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.batta_per_trip}
                                onChange={(e) => setFormData({ ...formData, batta_per_trip: e.target.value })}
                                className="pl-9 h-10 bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Salary Amount</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.salary_per_trip}
                                onChange={(e) => setFormData({ ...formData, salary_per_trip: e.target.value })}
                                className="pl-9 h-10 bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardShell>
            <Header title="Routes" subtitle={loading ? "Loading..." : `${routes.length} routes configured`} />

            <div className="p-6 space-y-6 animate-fade-in pb-24 md:pb-6">
                {/* Actions */}
                <div className="flex justify-end">
                    <Button onClick={() => { setFormData(emptyRoute); setIsAddDialogOpen(true); }} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Route
                    </Button>
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
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && routes.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <RouteIcon className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-base font-medium text-slate-900 dark:text-slate-200">No routes yet</p>
                            <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">Add routes to define origin, destination, and earning rates.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Add Route
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Routes Table */}
                {!loading && !error && routes.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <TableHead className="w-[300px]">Route</TableHead>
                                        <TableHead>Origin</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead className="text-right">Batta</TableHead>
                                        <TableHead className="text-right">Salary</TableHead>
                                        <TableHead className="text-right">Total Per Trip</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {routes.map((route) => (
                                        <TableRow key={route.id} className="group">
                                            <TableCell>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{route.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">ID: {route.id.slice(0, 8)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <MapPin className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                                    <span>{route.origin}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                                    <span>{route.destination}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="warning" className="font-mono text-xs">{formatCurrency(route.batta_per_trip)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="info" className="font-mono text-xs">{formatCurrency(route.salary_per_trip)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium tabular-nums text-slate-900 dark:text-white">
                                                {formatCurrency(route.batta_per_trip + route.salary_per_trip)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                        onClick={() => openEditDialog(route)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        onClick={() => openDeleteDialog(route)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>Configure batta and salary per trip for this route.</DialogDescription>
                    </DialogHeader>
                    <RouteForm />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddRoute} disabled={submitting}>
                            {submitting ? "Adding..." : "Add Route"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Route</DialogTitle>
                        <DialogDescription>Update route details and earnings configuration.</DialogDescription>
                    </DialogHeader>
                    <RouteForm />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditRoute} disabled={submitting}>
                            {submitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Delete Route
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete <strong>{selectedRoute?.name}</strong>? This will affect historical trip data reports.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteRoute}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {submitting ? "Deleting..." : "Delete Route"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
