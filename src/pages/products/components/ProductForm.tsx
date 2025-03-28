import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Scale, Diamond, Tag } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { ProductFormData } from '../types';

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | string[]) => void;
  onImageUpload: (paths: string[]) => void;
  onImageRemove: (index: number) => void;
}

export function ProductForm({
  formData,
  onChange,
  onImageUpload,
  onImageRemove
}: ProductFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ImageUploader
          imagePaths={formData.metadata.images}
          sku={formData.sku}
          onUpload={onImageUpload}
          onRemove={onImageRemove}
        />

        <div className="space-y-2">
          <Label htmlFor="product-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-500" />
            Nombre del Producto
          </Label>
          <Input
            id="product-name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            required
            placeholder="Ingrese el nombre del producto"
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
            onChange={(e) => onChange('sku', e.target.value)}
            required
            placeholder="Ingrese SKU"
            className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-price-usd" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Precio (USD)
            </Label>
            <Input
              id="product-price-usd"
              type="number"
              step="0.01"
              value={formData.price_usd}
              onChange={(e) => onChange('price_usd', e.target.value)}
              required
              placeholder="0.00"
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-price-mxn" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Precio (MXN)
            </Label>
            <Input
              id="product-price-mxn"
              type="number"
              step="0.01"
              value={formData.price_mxn}
              onChange={(e) => onChange('price_mxn', e.target.value)}
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
            onValueChange={(value) => onChange('material', value)}
          >
            <SelectTrigger 
              className="border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 group transition-colors"
              aria-label="Seleccionar material"
            >
              <SelectValue placeholder="Seleccionar material" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="gold">Oro</SelectItem>
                <SelectItem value="silver">Plata</SelectItem>
                <SelectItem value="platinum">Platino</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-purity" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Diamond className="h-4 w-4 text-emerald-500" />
            Pureza
          </Label>
          <Input
            id="product-purity"
            value={formData.purity}
            onChange={(e) => onChange('purity', e.target.value)}
            placeholder="ej., 14K, 18K, .925"
            className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-500" />
            Peso (g)
          </Label>
          <Input
            id="product-weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            placeholder="0.00"
            className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-500" />
            Descripción
          </Label>
          <Textarea
            id="product-description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            required
            placeholder="Ingrese la descripción del producto"
            className="min-h-[120px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
} 