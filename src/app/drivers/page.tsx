"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Plus, Pencil, Trash2, User, Phone, Bus, AlertCircle, Camera, X, IndianRupee } from "lucide-react";
import { PAYMENT_PREFERENCES } from "@/lib/earnings-calculator";
import { PaymentPreference } from "@/lib/supabase/types";
import { toast } from "@/hooks/use-toast";

interface Driver {
    id: string;
    name: string;
    phone: string | null;
    vehicle_number: string | null;
    payment_preference: PaymentPreference;
    profile_image?: string | null;
}

const emptyDriver = {
    name: "",
    phone: "",
    vehicle_number: "",
    payment_preference: "split" as PaymentPreference,
    profile_image: "" as string,
};

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [formData, setFormData] = useState(emptyDriver);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/drivers");
            if (!res.ok) throw new Error("Failed to fetch drivers");
            const { data } = await res.json();
            setDrivers(data || []);
        } catch (err) {
            console.error("Error fetching drivers:", err);
            setError("Failed to load drivers");
            toast({ variant: "error", title: "Error", description: "Failed to load drivers" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    // Handle image upload with compression
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Compress image before storing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Max dimensions 150x150 for avatar
                const maxSize = 150;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to JPEG at 70% quality
                const compressed = canvas.toDataURL('image/jpeg', 0.7);
                setFormData({ ...formData, profile_image: compressed });
            };

            img.src = URL.createObjectURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, profile_image: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Add driver with optimistic update
    const handleAddDriver = async () => {
        if (!formData.name.trim()) {
            toast({ variant: "error", title: "Validation", description: "Driver name is required" });
            return;
        }

        // Optimistic update - close dialog and show immediately
        const tempId = `temp-${Date.now()}`;
        const optimisticDriver: Driver = {
            id: tempId,
            name: formData.name,
            phone: formData.phone || null,
            vehicle_number: formData.vehicle_number || null,
            payment_preference: formData.payment_preference,
            profile_image: formData.profile_image || null,
            created_at: new Date().toISOString(),
        };

        setDrivers(prev => [optimisticDriver, ...prev]);
        setIsAddDialogOpen(false);
        setFormData(emptyDriver);
        toast({ variant: "success", title: "Success", description: "Driver added successfully" });

        try {
            const res = await fetch("/api/drivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to add driver");
            }

            const { data } = await res.json();
            // Replace temp driver with real one
            setDrivers(prev => prev.map(d => d.id === tempId ? data : d));
        } catch (err: any) {
            // Rollback on error
            setDrivers(prev => prev.filter(d => d.id !== tempId));
            toast({ variant: "error", title: "Error", description: err.message });
        }
    };

    // Edit driver
    const openEditDialog = (driver: Driver) => {
        setSelectedDriver(driver);
        setFormData({
            name: driver.name,
            phone: driver.phone || "",
            vehicle_number: driver.vehicle_number || "",
            payment_preference: driver.payment_preference,
            profile_image: driver.profile_image || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleEditDriver = async () => {
        if (!selectedDriver || !formData.name.trim()) {
            toast({ variant: "error", title: "Validation", description: "Driver name is required" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/drivers/${selectedDriver.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to update driver");
            }

            const { data } = await res.json();
            setDrivers(drivers.map(d => d.id === selectedDriver.id ? data : d));
            setIsEditDialogOpen(false);
            setSelectedDriver(null);
            setFormData(emptyDriver);
            toast({ variant: "success", title: "Updated", description: "Driver updated successfully" });
        } catch (err: any) {
            toast({ variant: "error", title: "Error", description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    // Delete driver
    const openDeleteDialog = (driver: Driver) => {
        setSelectedDriver(driver);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteDriver = async () => {
        if (!selectedDriver) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/drivers/${selectedDriver.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete driver");

            setDrivers(drivers.filter((d) => d.id !== selectedDriver.id));
            setIsDeleteDialogOpen(false);
            setSelectedDriver(null);
            toast({ variant: "success", title: "Deleted", description: "Driver removed" });
        } catch (err) {
            toast({ variant: "error", title: "Error", description: "Failed to delete driver" });
        } finally {
            setSubmitting(false);
        }
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

    // Form content as a variable (not a component) to prevent re-creation on state changes
    const driverFormContent = (
        <div className="grid gap-4">
            {/* Compact Profile Photo */}
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {formData.profile_image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={formData.profile_image} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-6 w-6 text-slate-400" />
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        title="Upload driver profile photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <div className="flex-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 text-xs"
                    >
                        <Camera className="h-3 w-3 mr-1" />
                        {formData.profile_image ? "Change" : "Add Photo"}
                    </Button>
                    {formData.profile_image && (
                        <Button variant="ghost" size="sm" onClick={removeImage} className="h-8 text-xs text-red-500 hover:text-red-600 ml-1">
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="driver-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Driver Name <span className="text-red-500">*</span></Label>
                <Input
                    id="driver-name"
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                    <Label htmlFor="driver-phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-sm font-medium">+91</span>
                        <Input
                            id="driver-phone"
                            placeholder="98765 43210"
                            value={formData.phone?.replace(/^\+?91\s?/, '') || ''}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: digits ? `+91 ${digits}` : '' });
                            }}
                            className="pl-12 h-10"
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="driver-vehicle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Number</Label>
                    <Input
                        id="driver-vehicle"
                        placeholder="TS 09 AB 1234"
                        value={formData.vehicle_number}
                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value.toUpperCase() })}
                        className="h-10 uppercase"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Preference</Label>
                <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_PREFERENCES.map((pref) => (
                        <div
                            key={pref.value}
                            onClick={() => setFormData({ ...formData, payment_preference: pref.value as PaymentPreference })}
                            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.payment_preference === pref.value
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-400"
                                }`}
                        >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.payment_preference === pref.value
                                ? "bg-white text-emerald-600"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                }`}>
                                <IndianRupee className="h-4 w-4" />
                            </div>
                            <p className={`text-xs font-semibold ${formData.payment_preference === pref.value
                                ? "text-white"
                                : "text-slate-600 dark:text-slate-300"}`}>{pref.label}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500">
                    {PAYMENT_PREFERENCES.find(p => p.value === formData.payment_preference)?.description}
                </p>
            </div>
        </div>
    );

    return (
        <DashboardShell>
            <Header title="Drivers" subtitle={loading ? "Loading..." : `${drivers.length} drivers registered`} />

            <div className="p-6 space-y-6 animate-fade-in pb-24 md:pb-6">
                {/* Actions */}
                <div className="flex justify-end">
                    <Button onClick={() => { setFormData(emptyDriver); setIsAddDialogOpen(true); }} className="gap-2 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4" />
                        Add Driver
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
                {!loading && !error && drivers.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <User className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-base font-medium text-slate-900 dark:text-slate-200">No drivers yet</p>
                            <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">Add your first driver to start managing trips and payments.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="mt-4 gap-2">
                                <Plus className="h-4 w-4" /> Add Driver
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Drivers Table */}
                {!loading && !error && drivers.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <TableHead className="w-[300px]">Driver</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Preference</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {drivers.map((driver) => (
                                        <TableRow key={driver.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                                        {driver.profile_image ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={driver.profile_image} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <User className="h-5 w-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-900 dark:text-white block">{driver.name}</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">ID: {driver.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                    {driver.phone || <span className="text-slate-400 italic">Not provided</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Bus className="h-3.5 w-3.5 text-slate-400" />
                                                    {driver.vehicle_number ? (
                                                        <Badge variant="outline" className="font-mono text-xs">{driver.vehicle_number}</Badge>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-sm">No vehicle</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getPreferenceBadge(driver.payment_preference)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                        onClick={() => openEditDialog(driver)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        onClick={() => openDeleteDialog(driver)}
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
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Driver</DialogTitle>
                        <DialogDescription>Register a new driver with their details and payment preference.</DialogDescription>
                    </DialogHeader>
                    {driverFormContent}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddDriver} disabled={submitting} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md">
                            {submitting ? "Adding..." : "Add Driver"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Driver</DialogTitle>
                        <DialogDescription>Update driver details and payment preference.</DialogDescription>
                    </DialogHeader>
                    {driverFormContent}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditDriver} disabled={submitting} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md">
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
                            Delete Driver
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete <strong>{selectedDriver?.name}</strong>? This will remove all their trip history and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteDriver}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {submitting ? "Deleting..." : "Delete Driver"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
