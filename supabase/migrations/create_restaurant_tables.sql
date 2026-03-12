/*
  # Restaurant Management System Database Schema
  
  1. New Tables
    - app_gnmqysrfilzw83f2_menu_items: Store menu items with categories, prices, and availability
    - app_gnmqysrfilzw83f2_tables: Restaurant tables with capacity and status
    - app_gnmqysrfilzw83f2_orders: Customer orders with status tracking
    - app_gnmqysrfilzw83f2_order_items: Individual items within orders
    - app_gnmqysrfilzw83f2_staff: Staff members with roles and shifts
    - app_gnmqysrfilzw83f2_reservations: Table reservations
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Menu Items Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text DEFAULT '',
  available boolean DEFAULT true,
  preparation_time integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_menu_items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Menu items are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_menu_items FOR ALL 
  TO authenticated 
  USING (true);

-- Tables Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer UNIQUE NOT NULL,
  capacity integer NOT NULL,
  status text DEFAULT 'available',
  current_order_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tables are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_tables FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Tables are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_tables FOR ALL 
  TO authenticated 
  USING (true);

-- Orders Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES app_gnmqysrfilzw83f2_tables(id),
  customer_name text DEFAULT '',
  status text DEFAULT 'pending',
  total_amount decimal(10,2) DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_orders FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Orders are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_orders FOR ALL 
  TO authenticated 
  USING (true);

-- Order Items Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES app_gnmqysrfilzw83f2_orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES app_gnmqysrfilzw83f2_menu_items(id),
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  special_instructions text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_order_items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Order items are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_order_items FOR ALL 
  TO authenticated 
  USING (true);

-- Staff Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  status text DEFAULT 'active',
  shift_start time DEFAULT '09:00:00',
  shift_end time DEFAULT '17:00:00',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_staff FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Staff are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_staff FOR ALL 
  TO authenticated 
  USING (true);

-- Reservations Table
CREATE TABLE IF NOT EXISTS app_gnmqysrfilzw83f2_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES app_gnmqysrfilzw83f2_tables(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  party_size integer NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  status text DEFAULT 'confirmed',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_gnmqysrfilzw83f2_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reservations are viewable by everyone" 
  ON app_gnmqysrfilzw83f2_reservations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Reservations are editable by authenticated users" 
  ON app_gnmqysrfilzw83f2_reservations FOR ALL 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON app_gnmqysrfilzw83f2_orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON app_gnmqysrfilzw83f2_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON app_gnmqysrfilzw83f2_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON app_gnmqysrfilzw83f2_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON app_gnmqysrfilzw83f2_menu_items(category);
