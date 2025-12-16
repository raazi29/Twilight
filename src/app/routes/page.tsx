"use client";

import { useState } from "react";
import { DashboardShell, Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

// Demo data
const DEMO_ROUTES = [
    {
        id: "1",
        name: "Hyderabad - Tirupati Express",
        origin: "Hyderabad",
        destination: "Tirupati",
        batta_per_trip: 500,
        salary_per_trip: 300,
    },
    {
        id: "2",
        name: "Chennai - Bangalore Highway",
        origin: "Chennai",
        destination: "Bangalore",
        batta_per_trip: 800,
        salary_per_trip: 500,
    },
    {
        id: "3",
        name: "Hyderabad - Mumbai Long Route",
        origin: "Hyderabad",
        destination: "Mumbai",
        batta_per_trip: 1500,
        salary_per_trip: 1000,
    },
    {
        id: "4",
        name: "Vizag - Hyderabad",
        origin: "Visakhapatnam",
        destination: "Hyderabad",
        batta_per_trip: 600,
        salary_per_trip: 400,
    },
];

export default function RoutesPage() {
    const [routes, setRoutes] = useState(DEMO_ROUTES);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newRoute, setNewRoute] = useState({
        name: "",
        origin: "",
        destination: "",
        batta_per_trip: "",
        salary_per_trip: "",
    });

    const handleAddRoute = () => {
        const route = {
            id: String(routes.length + 1),
            name: newRoute.name || `${newRoute.origin} - ${newRoute.destination}`,
            origin: newRoute.origin,
            destination: newRoute.destination,
            batta_per_trip: Number(newRoute.batta_per_trip) || 0,
            salary_per_trip: Number(newRoute.salary_per_trip) || 0,
        };
        setRoutes([...routes, route]);
        setIsAddDialogOpen(false);
        setNewRoute({
            name: "",
            origin: "",
            destination: "",
            batta_per_trip: "",
            salary_per_trip: "",
        });
    };

    const handleDeleteRoute = (id: string) => {
        setRoutes(routes.filter((r) => r.id !== id));
    };

    return (
        <DashboardShell>
            <Header title="Routes" subtitle={`${routes.length} routes configured`} />

            <div className="p-6 space-y-4 animate-fade-in">
                {/* Actions */}
                <div className="flex justify-end">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                Add Route
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Route</DialogTitle>
                                <DialogDescription>
                                    Configure batta and salary per trip
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 p-5 pt-0">
                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Route Name</Label>
                                    <Input
                                        placeholder="e.g., Hyderabad - Tirupati Express"
                                        value={newRoute.name}
                                        onChange={(e) =>
                                            setNewRoute({ ...newRoute, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Origin</Label>
                                        <Input
                                            placeholder="Hyderabad"
                                            value={newRoute.origin}
                                            onChange={(e) =>
                                                setNewRoute({ ...newRoute, origin: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Destination</Label>
                                        <Input
                                            placeholder="Tirupati"
                                            value={newRoute.destination}
                                            onChange={(e) =>
                                                setNewRoute({ ...newRoute, destination: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Batta per Trip (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            value={newRoute.batta_per_trip}
                                            onChange={(e) =>
                                                setNewRoute({ ...newRoute, batta_per_trip: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Salary per Trip (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="300"
                                            value={newRoute.salary_per_trip}
                                            onChange={(e) =>
                                                setNewRoute({ ...newRoute, salary_per_trip: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleAddRoute}>
                                    Add Route
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Routes Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route</TableHead>
                                <TableHead>Origin</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead className="text-right">Batta</TableHead>
                                <TableHead className="text-right">Salary</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell className="font-medium">{route.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 text-green-500" />
                                            <span>{route.origin}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 text-red-500" />
                                            <span>{route.destination}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="warning">{formatCurrency(route.batta_per_trip)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="info">{formatCurrency(route.salary_per_trip)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        {formatCurrency(route.batta_per_trip + route.salary_per_trip)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500 hover:text-red-600"
                                                onClick={() => handleDeleteRoute(route.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
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
