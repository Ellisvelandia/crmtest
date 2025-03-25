import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package2, Loader2 } from 'lucide-react'
import { useProductForm } from './hooks/useProductForm'
import { ProductForm } from './components/ProductForm'

export default function NewProductPage() {
  const navigate = useNavigate()
  const { formData, loading, handleChange, handleImageUpload, removeImage, handleSubmit } = useProductForm()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const success = await handleSubmit()
    if (success) {
      navigate('/products')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-emerald-100/50">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">Agregar Nuevo Producto</h1>
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Crear un nuevo producto en el inventario
            </p>
          </div>
          <Button
            onClick={() => navigate('/products')}
            variant="ghost"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a Productos
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-emerald-100/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
            <h2 className="text-lg font-medium text-gray-900">Información del Producto</h2>
            <p className="mt-1 text-sm text-emerald-600">Complete los detalles a continuación para crear un nuevo producto</p>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-8">
            <ProductForm
              formData={formData}
              loading={loading}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onImageRemove={removeImage}
            />

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 hover:shadow flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Creando Producto...' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 