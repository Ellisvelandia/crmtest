export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price_usd: number;
  price_mxn: number;
  category: string;
  brand: string;
  material: string;
  purity: string;
  weight: number;
  is_active: boolean;
  metadata: {
    images?: string[];
    specifications?: Record<string, any>;
  };
  quantity?: number;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price_usd: string;
  price_mxn: string;
  category: string;
  brand: string;
  material: string;
  purity: string;
  weight: string;
  metadata: {
    images: string[];
    specifications: Record<string, any>;
  };
}

export interface ProductFilters {
  searchQuery: string;
  warehouse: string;
}

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  onProductClick: (productId: string) => void;
}

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export interface ProductHeaderProps {
  totalProducts: number;
  shownProducts: number;
  onAddProduct: () => void;
}

export interface ProductFiltersProps {
  filters: ProductFilters;
  warehouses: Warehouse[];
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export interface Warehouse {
  id: string;
  name: string;
} 