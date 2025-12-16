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
import { Plus, Pencil, Trash2, User, Phone, Bus } from "lucide-react";
import { PAYMENT_PREFERENCES } from "@/lib/earnings-calculator";
import { PaymentPreference } from "@/lib/supabase/types";

// Demo data
const DEMO_DRIVERS = [
    { id: "1", name: "Rajesh Kumar", phone: "+91 98765 43210", vehicle_number: "TS09AB1234", payment_preference: "split" as PaymentPreference },
    { id: "2", name: "Suresh Reddy", phone: "+91 87654 32109", vehicle_number: "TN01CD5678", payment_preference: "batta_only" as PaymentPreference },
    { id: "3", name: "Venkat Rao", phone: "+91 76543 21098", vehicle_number: "TS10EF9012", payment_preference: "salary_only" as PaymentPreference },
    { id: "4", name: "Krishna Murthy", phone: "+91 65432 10987", vehicle_number: "AP05GH3456", payment_preference: "split" as PaymentPreference },
];

export default function DriversPage() {
    const [drivers, setDrivers] = useState(DEMO_DRIVERS);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newDriver, setNewDriver] = useState({
        name: "",
        phone: "",
        vehicle_number: "",
        payment_preference: "split" as PaymentPreference,
    });

    const handleAddDriver = () => {
        setDrivers([...drivers, { id: String(drivers.length + 1), ...newDriver }]);
        setIsAddDialogOpen(false);
        setNewDriver({ name: "", phone: "", vehicle_number: "", payment_preference: "split" });
    };

    const handleDeleteDriver = (id: string) => {
        setDrivers(drivers.filter((d) => d.id !== id));
    };

    const getPreferenceBadge = (preference: PaymentPreference) => {
        switch (preference) {
            case "batta_only":
                return <Badge variant="warning">Batta Only</Badge>;
            case "salary_only":
                return <Badge variant="info">Salary Only</Badge>;
            case "split":
                return <Badge variant="success">Split</Badge>;
        }
    };

    return (
        <DashboardShell>
            <Header title="Drivers" subtitle={`${drivers.length} drivers registered`} />

            <div className="p-6 space-y-4 animate-fade-in">
                {/* Actions */}
                <div className="flex justify-end">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                Add Driver
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Driver</DialogTitle>
                                <DialogDescription>
                                    Register driver with payment preference
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 p-5 pt-0">
                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Driver Name</Label>
                                    <Input
                                        placeholder="Enter full name"
                                        value={newDriver.name}
                                        onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Phone</Label>
                                        <Input
                                            placeholder="+91 XXXXX XXXXX"
                                            value={newDriver.phone}
                                            onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[12px]">Vehicle Number</Label>
                                        <Input
                                            placeholder="TS09AB1234"
                                            value={newDriver.vehicle_number}
                                            onChange={(e) => setNewDriver({ ...newDriver, vehicle_number: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-[12px]">Payment Preference</Label>
                                    <div className="grid gap-2">
                                        {PAYMENT_PREFERENCES.map((pref) => (
                                            <label
                                                key={pref.value}
                                                className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${newDriver.payment_preference === pref.value
                                                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
                                                    : "hover:bg-[var(--background-hover)]"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_preference"
                                                    value={pref.value}
                                                    checked={newDriver.payment_preference === pref.value}
                                                    onChange={(e) =>
                                                        setNewDriver({ ...newDriver, payment_preference: e.target.value as PaymentPreference })
                                                    }
                                                    className="accent-[var(--accent)]"
                                                />
                                                <div>
                                                    <p className="text-[13px] font-medium">{pref.label}</p>
                                                    <p className="text-[11px] text-[var(--foreground-muted)]">{pref.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleAddDriver}>
                                    Add Driver
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Drivers Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Driver</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Preference</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]">
                                                <User className="h-4 w-4 text-[var(--accent-foreground)]" />
                                            </div>
                                            <span className="font-medium">{driver.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-3 w-3" />
                                            {driver.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Bus className="h-3 w-3" />
                                            <Badge variant="outline" dot={false}>{driver.vehicle_number}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPreferenceBadge(driver.payment_preference)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500 hover:text-red-600"
                                                onClick={() => handleDeleteDriver(driver.id)}
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
