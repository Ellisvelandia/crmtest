export interface Product {
  id: string;
  name: string;           // Nombre del producto
  sku: string;           // SKU del producto
  description: string;    // Descripción del producto
  price_usd: number;     // Precio en USD
  price_mxn: number;     // Precio en MXN
  material: string;      // Material (Oro, Plata, Platino, Otro)
  purity: string;        // Pureza (ej., 14K, 18K, .925)
  weight: string;        // Peso en gramos
  category: string;      // Categoría del producto
  brand?: string;        // Marca del producto
  quantity?: number;     // Cantidad en inventario
  metadata: {
    images: string[];    // URLs de las imágenes
  };
  created_at: string;    // Fecha de creación
  updated_at: string;    // Fecha de actualización
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price_usd: string;
  price_mxn: string;
  material: string;
  purity: string;
  weight: string;
  category: string;
  metadata: {
    images: string[];
  };
}

export interface ProductFilters {
  searchQuery: string;   // Término de búsqueda
  warehouse: string;     // ID del almacén
}

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  onProductClick: (id: string) => void;
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
  onFilterChange: (updates: Partial<ProductFilters>) => void;
}

export interface Warehouse {
  id: string;
  name: string;         // Nombre del almacén
  location: string;     // Ubicación del almacén
} 