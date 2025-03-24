import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { getProducts } from '@/lib/api/products'
import { Warehouse } from '@/lib/supabase/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Types for our component
interface Product {
  id: string
  name: string
  sku: string
  description: string
  price_usd: number
  price_mxn: number
  category: string
  brand: string
  material: string
  purity: string
  weight: number
  is_active: boolean
  metadata: {
    images?: string[]
    specifications?: Record<string, any>
  }
  quantity?: number
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all')
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  useEffect(() => {
    loadProducts()
  }, [selectedWarehouse])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts(selectedWarehouse === 'all' ? undefined : selectedWarehouse)
      setProducts(data.products || [])
      setWarehouses(data.warehouses || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedWarehouse}
            onValueChange={setSelectedWarehouse}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/products/new')}>
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {product.metadata?.images?.[0] ? (
                <img
                  src={product.metadata.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image available
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-lg">{formatPrice(product.price_usd)}</span>
                {product.quantity !== undefined && (
                  <span className="text-sm text-gray-500">
                    Stock: {product.quantity}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {product.category}
                </span>
                {product.material && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {product.material} {product.purity}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
} 