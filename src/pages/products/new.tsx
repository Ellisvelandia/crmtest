import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { productsApi } from '@/lib/api/products'
import { ArrowLeft, Package2, DollarSign, Scale, Diamond, ImagePlus, Tag, Loader2, Plus, X } from 'lucide-react'

export default function NewProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
      images: [] as string[],
      specifications: {}
    }
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          images: [...prev.metadata.images, ...newImages]
        }
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        images: prev.metadata.images.filter((_, i) => i !== index)
      }
    }))
  }

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-emerald-100/50">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Create a new product in the inventory
            </p>
          </div>
          <Button
            onClick={() => navigate('/products')}
            variant="ghost"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-emerald-100/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
            <h2 className="text-lg font-medium text-gray-900">Product Information</h2>
            <p className="mt-1 text-sm text-emerald-600">Fill in the details below to create a new product</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div 
                  className="p-4 border border-dashed border-emerald-200 rounded-lg bg-emerald-50/50 text-center cursor-pointer hover:bg-emerald-50 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="product-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImagePlus className="h-8 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-emerald-700">Add Product Images</p>
                      <p className="text-xs text-emerald-600">Drag & drop or click to upload</p>
                    </div>
                  </div>
                </div>

                {formData.metadata.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.metadata.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="product-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-500" />
                    Product Name
                  </Label>
                  <Input
                    id="product-name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="Enter product name"
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-sku" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-500" />
                    SKU
                  </Label>
                  <Input
                    id="product-sku"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    required
                    placeholder="Enter SKU"
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price-usd" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Price (USD)
                    </Label>
                    <Input
                      id="product-price-usd"
                      type="number"
                      step="0.01"
                      value={formData.price_usd}
                      onChange={(e) => handleChange('price_usd', e.target.value)}
                      required
                      placeholder="0.00"
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-price-mxn" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Price (MXN)
                    </Label>
                    <Input
                      id="product-price-mxn"
                      type="number"
                      step="0.01"
                      value={formData.price_mxn}
                      onChange={(e) => handleChange('price_mxn', e.target.value)}
                      required
                      placeholder="0.00"
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product-material" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Diamond className="h-4 w-4 text-emerald-500" />
                    Material
                  </Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => handleChange('material', value)}
                  >
                    <SelectTrigger 
                      className="border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 group transition-colors"
                      aria-label="Select material"
                    >
                      <div className="flex items-center gap-2">
                        <Diamond className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                        <SelectValue placeholder="Select material" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-emerald-100 shadow-lg rounded-lg">
                      <SelectGroup>
                        <SelectLabel className="text-xs font-medium text-emerald-600 px-2 py-1.5">
                          Available Materials
                        </SelectLabel>
                        {[
                          { value: 'gold', label: 'Gold', icon: <Diamond className="h-4 w-4 text-yellow-500" /> },
                          { value: 'silver', label: 'Silver', icon: <Diamond className="h-4 w-4 text-gray-400" /> },
                          { value: 'platinum', label: 'Platinum', icon: <Diamond className="h-4 w-4 text-gray-600" /> },
                          { value: 'other', label: 'Other', icon: <Diamond className="h-4 w-4 text-emerald-500" /> }
                        ].map((item) => (
                          <SelectItem 
                            key={item.value} 
                            value={item.value}
                            className="hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              {item.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-purity" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Diamond className="h-4 w-4 text-emerald-500" />
                    Purity
                  </Label>
                  <Select
                    value={formData.purity}
                    onValueChange={(value) => handleChange('purity', value)}
                  >
                    <SelectTrigger 
                      className="border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 group transition-colors"
                      aria-label="Select purity"
                    >
                      <div className="flex items-center gap-2">
                        <Diamond className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                        <SelectValue placeholder="Select purity" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-emerald-100 shadow-lg rounded-lg">
                      <SelectGroup>
                        <SelectLabel className="text-xs font-medium text-emerald-600 px-2 py-1.5">
                          Material Purity
                        </SelectLabel>
                        {[
                          { value: '24k', label: '24K Gold', icon: <Diamond className="h-4 w-4 text-yellow-500" /> },
                          { value: '18k', label: '18K Gold', icon: <Diamond className="h-4 w-4 text-yellow-400" /> },
                          { value: '14k', label: '14K Gold', icon: <Diamond className="h-4 w-4 text-yellow-300" /> },
                          { value: '925', label: '925 Sterling Silver', icon: <Diamond className="h-4 w-4 text-gray-400" /> }
                        ].map((item) => (
                          <SelectItem 
                            key={item.value} 
                            value={item.value}
                            className="hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              {item.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-emerald-500" />
                      Weight (g)
                    </Label>
                    <Input
                      id="product-weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      required
                      placeholder="0.00"
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-brand" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-500" />
                      Brand
                    </Label>
                    <Input
                      id="product-brand"
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      placeholder="Enter brand"
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-500" />
                Description
              </Label>
              <Textarea
                id="product-description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="min-h-[120px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
                className="text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:bg-emerald-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 hover:shadow flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 