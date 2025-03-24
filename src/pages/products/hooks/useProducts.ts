import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getProducts } from '@/lib/api/products';
import type { Product, Warehouse, ProductFilters } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    searchQuery: '',
    warehouse: 'all'
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts(
        filters.warehouse === 'all' ? undefined : filters.warehouse
      );
      setProducts(data.products || []);
      setWarehouses(data.warehouses || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters.warehouse]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filters.searchQuery, products]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    products,
    filteredProducts,
    warehouses,
    loading,
    filters,
    updateFilters,
    refresh: loadProducts
  };
} 