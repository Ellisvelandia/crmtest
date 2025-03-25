import { Button } from '@/components/ui/button';
import { Package2, Plus } from 'lucide-react';
import type { ProductHeaderProps } from '../types';

export function ProductHeader({ totalProducts, shownProducts, onAddProduct }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <p className="text-sm text-emerald-600 flex items-center gap-2">
          <Package2 className="h-4 w-4" />
          {shownProducts} de {totalProducts} productos mostrados
        </p>
      </div>
      <Button
        onClick={onAddProduct}
        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow group"
      >
        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
        Agregar Producto
      </Button>
    </div>
  );
} 