import { Card } from '@/components/ui/card';
import { Package2, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ProductCardProps } from '../types';

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getImageUrl = async () => {
      if (product.metadata?.images?.[0]) {
        try {
          const { data } = await supabase.storage
            .from('product-images')
            .getPublicUrl(product.metadata.images[0]);
          
          if (data?.publicUrl) {
            setImageUrl(data.publicUrl);
          }
        } catch (error) {
          console.error('Error getting image URL:', error);
        }
      }
    };

    getImageUrl();
  }, [product.metadata?.images]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-emerald-100/50 hover:border-emerald-200 bg-white relative"
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-emerald-50/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-emerald-400">
            <Package2 className="h-12 w-12 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        {product.quantity !== undefined && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm transition-colors ${
            product.quantity > 0
              ? 'bg-emerald-100/90 text-emerald-700'
              : 'bg-red-100/90 text-red-700'
          }`}>
            {product.quantity > 0 ? 'En Existencia' : 'Agotado'}
          </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <span className="font-medium text-lg text-emerald-700 whitespace-nowrap">
              {formatPrice(product.price_usd)}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full transition-colors hover:bg-emerald-100 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {product.category}
          </span>
          {product.material && (
            <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full transition-colors hover:bg-emerald-100">
              {product.material} {product.purity}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
} 