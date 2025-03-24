import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ProductCard } from './ProductCard';
import type { ProductListProps } from '../types';

export function ProductList({ products, loading, onProductClick }: ProductListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden border border-emerald-100/50 shadow-sm animate-pulse"
          >
            <Skeleton className="h-64 w-full bg-emerald-50" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-3/4 bg-emerald-50" />
              <Skeleton className="h-4 w-1/2 bg-emerald-50" />
              <Skeleton className="h-8 w-24 bg-emerald-50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
} 