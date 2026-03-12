export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  available: boolean;
  preparation_time: number;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  current_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  table_id: string;
  customer_name: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  created_at: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'manager' | 'waiter' | 'chef' | 'bartender' | 'host';
  email: string;
  phone: string;
  status: 'active' | 'on_break' | 'off_duty';
  shift_start: string;
  shift_end: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  table_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  created_at: string;
}
