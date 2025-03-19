// User related types
export interface User {
  id: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  created_at: string
  updated_at: string
}

// Client related types
export interface Client {
  id: string // UUID
  customer_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: Date
  address: string
  created_at: Date
  updated_at: Date
}

// Product related types
export interface Product {
  id: string
  inventory_number: string
  name: string
  description: string
  category: string
  price_usd: number
  price_mxn: number
  warehouse_id: string
  created_at: string
  updated_at: string
}

// Warehouse related types
export interface Warehouse {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Sales related types
export interface Sale {
  id: string
  client_id: string
  total_amount: number
  currency: 'USD' | 'MXN'
  payment_method: 'CASH_PESOS' | 'CASH_DOLARES' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'OTROS'
  status: 'completed' | 'pending' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
  currency: 'USD' | 'MXN'
  created_at: string
}

// Inventory related types
export interface InventoryMovement {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  movement_type: 'in' | 'out'
  created_at: string
  created_by: string
} 