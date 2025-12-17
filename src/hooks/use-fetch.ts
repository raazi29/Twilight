"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface UseFetchOptions<T> {
    initialData?: T;
    revalidateOnFocus?: boolean;
    dedupingInterval?: number;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    mutate: (newData?: T) => void;
    refetch: () => Promise<void>;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export function useFetch<T>(
    url: string,
    options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
    const { initialData, revalidateOnFocus = false, dedupingInterval = 2000 } = options;

    const [data, setData] = useState<T | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const lastFetchRef = useRef<number>(0);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async (showLoading = true) => {
        // Dedupe rapid requests
        const now = Date.now();
        if (now - lastFetchRef.current < dedupingInterval) {
            return;
        }
        lastFetchRef.current = now;

        // Check cache first
        const cached = cache.get(url);
        if (cached && now - cached.timestamp < CACHE_DURATION) {
            if (mountedRef.current) {
                setData(cached.data as T);
                setLoading(false);
            }
            return;
        }

        if (showLoading) setLoading(true);
        setError(null);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status}`);
            }
            const json = await res.json();
            const result = json.data ?? json;

            // Update cache
            cache.set(url, { data: result, timestamp: Date.now() });

            if (mountedRef.current) {
                setData(result);
            }
        } catch (err: any) {
            console.error(`Fetch error for ${url}:`, err);
            if (mountedRef.current) {
                setError(err.message || "Failed to fetch data");
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [url, dedupingInterval]);

    const mutate = useCallback((newData?: T) => {
        if (newData !== undefined) {
            setData(newData);
            cache.set(url, { data: newData, timestamp: Date.now() });
        } else {
            // Refetch
            cache.delete(url);
            fetchData(false);
        }
    }, [url, fetchData]);

    const refetch = useCallback(async () => {
        cache.delete(url);
        await fetchData(true);
    }, [url, fetchData]);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();

        return () => {
            mountedRef.current = false;
        };
    }, [fetchData]);

    // Revalidate on focus
    useEffect(() => {
        if (!revalidateOnFocus) return;

        const onFocus = () => fetchData(false);
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [revalidateOnFocus, fetchData]);

    return { data, loading, error, mutate, refetch };
}

// Clear all cache
export function clearCache() {
    cache.clear();
}

// Clear specific cache
export function clearCacheFor(url: string) {
    cache.delete(url);
}
