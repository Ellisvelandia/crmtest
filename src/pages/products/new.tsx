import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { productsApi } from '@/lib/api/products'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price_usd: '',
    price_mxn: '',
    category: 'jewelry',
    brand: '',
    material: '',
    purity: '',
    weight: '',
    metadata: {
      images: [],
      specifications: {}
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Convert numeric strings to numbers and add is_active
      const productData = {
        ...formData,
        price_usd: parseFloat(formData.price_usd),
        price_mxn: parseFloat(formData.price_mxn),
        weight: parseFloat(formData.weight),
        is_active: true
      }

      await productsApi.createProduct(productData, 'default-warehouse', 0)
      toast.success('Product created successfully')
      navigate('/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-emerald-600">Add a new product to the inventory</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-emerald-100">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
            <h2 className="text-lg font-medium text-gray-900">Product Information</h2>
            <p className="mt-1 text-sm text-emerald-600">Fill in the product details below</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-gray-700">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_usd" className="text-gray-700">Price (USD)</Label>
                  <Input
                    id="price_usd"
                    type="number"
                    step="0.01"
                    value={formData.price_usd}
                    onChange={(e) => handleChange('price_usd', e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_mxn" className="text-gray-700">Price (MXN)</Label>
                  <Input
                    id="price_mxn"
                    type="number"
                    step="0.01"
                    value={formData.price_mxn}
                    onChange={(e) => handleChange('price_mxn', e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material" className="text-gray-700">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => handleChange('material', value)}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purity" className="text-gray-700">Purity</Label>
                  <Select
                    value={formData.purity}
                    onValueChange={(value) => handleChange('purity', value)}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24k">24K</SelectItem>
                      <SelectItem value="18k">18K</SelectItem>
                      <SelectItem value="14k">14K</SelectItem>
                      <SelectItem value="925">925 Sterling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gray-700">Weight (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-gray-700">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[120px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/products')}
                  className="text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 