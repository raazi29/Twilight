"use client";

import { useState, createContext, useContext, useCallback, ReactNode } from "react";

interface ToastProps {
    variant?: "default" | "success" | "error" | "warning";
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: (ToastProps & { id: string })[];
    toast: (props: ToastProps) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

    const toast = useCallback((props: ToastProps) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...props, id }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, props.duration || 3000);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        return {
            toast: (props: ToastProps) => {
                console.log(`[Toast ${props.variant || "default"}]`, props.title, props.description);
            },
            toasts: [] as (ToastProps & { id: string })[],
            dismiss: () => { },
        };
    }
    return context;
}

// Standalone toast function for convenience
export const toast = (props: ToastProps) => {
    const variantStyles: Record<string, string> = {
        success: "color: #22c55e",
        error: "color: #ef4444",
        warning: "color: #f59e0b",
        default: "color: #6b7280",
    };
    console.log(
        `%c[Toast] ${props.title}`,
        variantStyles[props.variant || "default"],
        props.description || ""
    );
};
