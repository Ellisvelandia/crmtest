import { supabase, handleSupabaseError } from '../supabase/config'
import type { Database } from '../supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']
type Warehouse = Database['public']['Tables']['warehouses']['Row']
type WarehouseProduct = Database['public']['Tables']['warehouse_products']['Row']

interface StockDataResponse {
  quantity: number
  warehouses: {
    name: string
    code: string
  }
}

export interface ProductWithStock extends Product {
  quantity: number
  warehouse_name: string
  warehouse_code: string
}

export const productsApi = {
  // Get all products with stock information for a specific warehouse
  async getProductsByWarehouse(warehouseCode: string): Promise<ProductWithStock[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          warehouse_products!inner (
            quantity,
            warehouses!inner (
              name,
              code
            )
          )
        `)
        .eq('warehouse_products.warehouses.code', warehouseCode)
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      return data.map(item => ({
        ...item,
        quantity: item.warehouse_products[0].quantity,
        warehouse_name: item.warehouse_products[0].warehouses.name,
        warehouse_code: item.warehouse_products[0].warehouses.code
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get all warehouses
  async getAllWarehouses(): Promise<Warehouse[]> {
    try {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get product by SKU with stock information
  async getProductBySku(sku: string): Promise<ProductWithStock | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          warehouse_products!inner (
            quantity,
            warehouses!inner (
              name,
              code
            )
          )
        `)
        .eq('sku', sku)
        .eq('is_active', true)
        .single()

      if (error) throw error
      if (!data) return null

      return {
        ...data,
        quantity: data.warehouse_products[0].quantity,
        warehouse_name: data.warehouse_products[0].warehouses.name,
        warehouse_code: data.warehouse_products[0].warehouses.code
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create new product with initial stock in a warehouse
  async createProduct(
    product: ProductInsert,
    warehouseId: string,
    initialQuantity: number = 0
  ): Promise<ProductWithStock> {
    try {
      // Start a Supabase transaction
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([{ ...product, is_active: true }])
        .select()
        .single()

      if (productError) throw productError

      // Add stock information
      const { data: stockData, error: stockError } = await supabase
        .from('warehouse_products')
        .insert([{
          warehouse_id: warehouseId,
          product_id: newProduct.id,
          quantity: initialQuantity
        }])
        .select(`
          quantity,
          warehouses!inner (
            name,
            code
          )
        `)
        .single() as { data: StockDataResponse | null, error: any }

      if (stockError) throw stockError
      if (!stockData) throw new Error('Failed to create stock entry')

      return {
        ...newProduct,
        quantity: stockData.quantity,
        warehouse_name: stockData.warehouses.name,
        warehouse_code: stockData.warehouses.code
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update product
  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update stock quantity
  async updateStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    notes: string = ''
  ): Promise<WarehouseProduct> {
    try {
      // Get current quantity
      const { data: currentStock, error: stockError } = await supabase
        .from('warehouse_products')
        .select('quantity')
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)
        .single()

      if (stockError) throw stockError

      // Update quantity
      const { data: updatedStock, error: updateError } = await supabase
        .from('warehouse_products')
        .update({ quantity })
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)
        .select()
        .single()

      if (updateError) throw updateError

      // Record history
      const { error: historyError } = await supabase
        .from('warehouse_history')
        .insert([{
          warehouse_id: warehouseId,
          product_id: productId,
          action_type: quantity > currentStock.quantity ? 'STOCK_IN' : 'STOCK_OUT',
          quantity_change: Math.abs(quantity - currentStock.quantity),
          previous_quantity: currentStock.quantity,
          new_quantity: quantity,
          notes
        }])

      if (historyError) throw historyError

      return updatedStock
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Search products by category in a specific warehouse
  async searchByCategory(category: string, warehouseCode: string): Promise<ProductWithStock[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          warehouse_products!inner (
            quantity,
            warehouses!inner (
              name,
              code
            )
          )
        `)
        .eq('category', category)
        .eq('warehouse_products.warehouses.code', warehouseCode)
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      return data.map(item => ({
        ...item,
        quantity: item.warehouse_products[0].quantity,
        warehouse_name: item.warehouse_products[0].warehouses.name,
        warehouse_code: item.warehouse_products[0].warehouses.code
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Search products by material type in a specific warehouse
  async searchByMaterialType(
    params: { material?: string; purity?: string },
    warehouseCode: string
  ): Promise<ProductWithStock[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          warehouse_products!inner (
            quantity,
            warehouses!inner (
              name,
              code
            )
          )
        `)
        .eq('warehouse_products.warehouses.code', warehouseCode)
        .eq('is_active', true)
      
      if (params.material) {
        query = query.eq('material', params.material)
      }
      if (params.purity) {
        query = query.eq('purity', params.purity)
      }

      const { data, error } = await query.order('name')

      if (error) throw error

      return data.map(item => ({
        ...item,
        quantity: item.warehouse_products[0].quantity,
        warehouse_name: item.warehouse_products[0].warehouses.name,
        warehouse_code: item.warehouse_products[0].warehouses.code
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}

export const getProducts = async (warehouseId?: string) => {
  try {
    // Get warehouses
    const { data: warehouses, error: warehousesError } = await supabase
      .from('warehouses')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (warehousesError) throw warehousesError

    // Build products query
    let query = supabase
      .from('products')
      .select(`
        *,
        warehouse_products (
          quantity,
          warehouse_id
        )
      `)
      .eq('is_active', true)

    // Filter by warehouse if specified
    if (warehouseId) {
      query = query.eq('warehouse_products.warehouse_id', warehouseId)
    }

    const { data: products, error: productsError } = await query.order('name')

    if (productsError) throw productsError

    // Process products to include quantity
    const processedProducts = products.map(product => ({
      ...product,
      quantity: warehouseId 
        ? product.warehouse_products[0]?.quantity || 0
        : product.warehouse_products.reduce((total: number, wp: { quantity: number | null }) => total + (wp.quantity || 0), 0)
    }))

    return {
      products: processedProducts,
      warehouses
    }
  } catch (error) {
    throw new Error(handleSupabaseError(error))
  }
} 