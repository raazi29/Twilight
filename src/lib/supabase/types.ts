export type PaymentPreference = 'batta_only' | 'salary_only' | 'split';
export type SettlementType = 'batta' | 'salary';
export type SettlementStatus = 'pending' | 'paid';

export interface Route {
    id: string;
    name: string;
    origin: string;
    destination: string;
    batta_per_trip: number;
    salary_per_trip: number;
    created_at: string;
    updated_at: string;
}

export interface Driver {
    id: string;
    name: string;
    phone: string | null;
    vehicle_number: string | null;
    payment_preference: PaymentPreference;
    created_at: string;
    updated_at: string;
}

export interface Trip {
    id: string;
    driver_id: string;
    route_id: string;
    vehicle_number: string;
    trip_date: string;
    trip_count: number;
    batta_earned: number;
    salary_earned: number;
    created_at: string;
    driver?: Driver;
    route?: Route;
}

export interface Settlement {
    id: string;
    driver_id: string;
    settlement_type: SettlementType;
    period_start: string;
    period_end: string;
    amount: number;
    status: SettlementStatus;
    settled_at: string | null;
    notes: string | null;
    created_at: string;
    driver?: Driver;
}

export interface EarningsSummary {
    total_batta: number;
    total_salary: number;
    unsettled_batta: number;
    unsettled_salary: number;
    trip_count: number;
    period_start: string;
    period_end: string;
}

// Supabase Database types - simplified for compatibility
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            routes: {
                Row: {
                    id: string;
                    name: string;
                    origin: string;
                    destination: string;
                    batta_per_trip: number;
                    salary_per_trip: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    origin: string;
                    destination: string;
                    batta_per_trip: number;
                    salary_per_trip: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    origin?: string;
                    destination?: string;
                    batta_per_trip?: number;
                    salary_per_trip?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            drivers: {
                Row: {
                    id: string;
                    name: string;
                    phone: string | null;
                    vehicle_number: string | null;
                    payment_preference: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    phone?: string | null;
                    vehicle_number?: string | null;
                    payment_preference?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    phone?: string | null;
                    vehicle_number?: string | null;
                    payment_preference?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            trips: {
                Row: {
                    id: string;
                    driver_id: string;
                    route_id: string;
                    vehicle_number: string;
                    trip_date: string;
                    trip_count: number;
                    batta_earned: number;
                    salary_earned: number;
                    settlement_id: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    driver_id: string;
                    route_id: string;
                    vehicle_number: string;
                    trip_date: string;
                    trip_count?: number;
                    batta_earned?: number;
                    salary_earned?: number;
                    settlement_id?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    driver_id?: string;
                    route_id?: string;
                    vehicle_number?: string;
                    trip_date?: string;
                    trip_count?: number;
                    batta_earned?: number;
                    salary_earned?: number;
                    settlement_id?: string | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "trips_driver_id_fkey";
                        columns: ["driver_id"];
                        referencedRelation: "drivers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "trips_route_id_fkey";
                        columns: ["route_id"];
                        referencedRelation: "routes";
                        referencedColumns: ["id"];
                    }
                ];
            };
            settlements: {
                Row: {
                    id: string;
                    driver_id: string;
                    settlement_type: string;
                    period_start: string;
                    period_end: string;
                    amount: number;
                    status: string;
                    settled_at: string | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    driver_id: string;
                    settlement_type: string;
                    period_start: string;
                    period_end: string;
                    amount: number;
                    status?: string;
                    settled_at?: string | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    driver_id?: string;
                    settlement_type?: string;
                    period_start?: string;
                    period_end?: string;
                    amount?: number;
                    status?: string;
                    settled_at?: string | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "settlements_driver_id_fkey";
                        columns: ["driver_id"];
                        referencedRelation: "drivers";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {};
        Functions: {};
        Enums: {
            payment_preference: "batta_only" | "salary_only" | "split";
            settlement_type: "batta" | "salary";
            settlement_status: "pending" | "paid";
        };
        CompositeTypes: {};
    };
}
