"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Banknote, CheckCircle2, AlertTriangle } from "lucide-react";

interface SettleButtonProps {
    type: "batta" | "salary";
    amount: number;
    periodLabel: string;
    onSettle: () => Promise<void>;
    disabled?: boolean;
}

export function SettleButton({
    type,
    amount,
    periodLabel,
    onSettle,
    disabled,
}: SettleButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSettle = async () => {
        setIsLoading(true);
        try {
            await onSettle();
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
            }, 1500);
        } catch (error) {
            console.error("Settlement failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const typeLabel = type === "batta" ? "Batta" : "Salary";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={amount > 0 ? "default" : "secondary"}
                    size="sm"
                    className="gap-1.5"
                    disabled={disabled || amount === 0}
                >
                    <Banknote className="h-3.5 w-3.5" />
                    Settle {typeLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="mt-4 text-[15px] font-semibold">
                            Settlement Complete
                        </h3>
                        <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
                            {formatCurrency(amount)} processed
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Confirm {typeLabel} Settlement</DialogTitle>
                            <DialogDescription>
                                Process {typeLabel.toLowerCase()} payments for {periodLabel}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-5">
                            <div className="rounded-lg bg-[var(--background-hover)] border p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] text-[var(--foreground-muted)]">Amount</span>
                                    <span className="text-[20px] font-semibold tabular-nums">
                                        {formatCurrency(amount)}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-[12px]">
                                    <span className="text-[var(--foreground-muted)]">Type</span>
                                    <span>{typeLabel}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[12px]">
                                    <span className="text-[var(--foreground-muted)]">Period</span>
                                    <span>{periodLabel}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 text-[12px] text-amber-400">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    This will mark all pending earnings as settled.
                                </span>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSettle}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Confirm Settlement"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
