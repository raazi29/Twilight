"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
    initialData?: T;
    autoFetch?: boolean;
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useApi<T>(
    endpoint: string,
    options: UseApiOptions<T> = {}
): ApiResponse<T> {
    const { initialData = null, autoFetch = true } = options;
    const [data, setData] = useState<T | null>(initialData);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(autoFetch);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch data');
            }

            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return { data, error, loading, refetch: fetchData };
}

// Mutation hook for POST/PUT/DELETE
interface MutationResult<T> {
    mutate: (options?: MutateOptions) => Promise<T | null>;
    loading: boolean;
    error: string | null;
}

interface MutateOptions {
    body?: Record<string, any>;
    method?: 'POST' | 'PUT' | 'DELETE';
}

export function useMutation<T>(endpoint: string): MutationResult<T> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (options: MutateOptions = {}): Promise<T | null> => {
        const { body, method = 'POST' } = options;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Operation failed');
            }

            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}

// Specialized hooks for each entity
export function useRoutes() {
    return useApi<any[]>('/api/routes');
}

export function useDrivers() {
    return useApi<any[]>('/api/drivers');
}

export function useTrips(driverId?: string) {
    const url = driverId ? `/api/trips?driver_id=${driverId}` : '/api/trips';
    return useApi<any[]>(url);
}

export function useEarnings(period: 'weekly' | 'monthly' = 'weekly', driverId?: string) {
    let url = `/api/earnings?period=${period}`;
    if (driverId) url += `&driver_id=${driverId}`;
    return useApi<any>(url);
}

export function useSettlements(type?: string, status?: string) {
    let url = '/api/settlements';
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    return useApi<any[]>(url);
}
