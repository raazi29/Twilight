-- Driver Payments Module - Supabase Database Schema
-- Run this SQL in Supabase SQL Editor to create all required tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Routes table
-- Stores route configurations with per-trip payment values
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  batta_per_trip DECIMAL(10,2) NOT NULL DEFAULT 0,
  salary_per_trip DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
-- Stores driver information and their payment preferences
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  vehicle_number TEXT,
  payment_preference TEXT NOT NULL DEFAULT 'batta_only' 
    CHECK (payment_preference IN ('batta_only', 'salary_only', 'split')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
-- Records completed trips with calculated earnings
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  trip_date DATE NOT NULL,
  trip_count INTEGER NOT NULL DEFAULT 1,
  batta_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  salary_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlements table
-- Records settlement history for batta (weekly) and salary (monthly)
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  settlement_type TEXT NOT NULL CHECK (settlement_type IN ('batta', 'salary')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  settled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_date ON trips(trip_date);
CREATE INDEX idx_trips_route ON trips(route_id);
CREATE INDEX idx_settlements_driver ON settlements(driver_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_type ON settlements(settlement_type);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to routes table
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to drivers table
CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO routes (name, origin, destination, batta_per_trip, salary_per_trip) VALUES
  ('Hyderabad - Tirupati Express', 'Hyderabad', 'Tirupati', 500, 300),
  ('Chennai - Bangalore Highway', 'Chennai', 'Bangalore', 800, 500),
  ('Hyderabad - Mumbai Long Route', 'Hyderabad', 'Mumbai', 1500, 1000),
  ('Vizag - Hyderabad', 'Visakhapatnam', 'Hyderabad', 600, 400);

INSERT INTO drivers (name, phone, vehicle_number, payment_preference) VALUES
  ('Rajesh Kumar', '+91 98765 43210', 'TS09AB1234', 'split'),
  ('Suresh Reddy', '+91 87654 32109', 'TN01CD5678', 'batta_only'),
  ('Venkat Rao', '+91 76543 21098', 'TS10EF9012', 'salary_only'),
  ('Krishna Murthy', '+91 65432 10987', 'AP05GH3456', 'split');

-- Enable Row Level Security (RLS) - optional, can be configured based on auth needs
-- ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users (uncomment if using Supabase Auth)
-- CREATE POLICY "Authenticated users can read routes" ON routes FOR SELECT TO authenticated USING (true);
-- CREATE POLICY "Authenticated users can insert routes" ON routes FOR INSERT TO authenticated WITH CHECK (true);
-- CREATE POLICY "Authenticated users can update routes" ON routes FOR UPDATE TO authenticated USING (true);
-- CREATE POLICY "Authenticated users can delete routes" ON routes FOR DELETE TO authenticated USING (true);
