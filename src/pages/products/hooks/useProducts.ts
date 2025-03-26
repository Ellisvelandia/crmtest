import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
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

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      if (filters.searchQuery) {
        // Use the custom search function for Spanish text
        const { data, error } = await supabase
          .rpc('search_products', { search_term: filters.searchQuery });
        
        if (error) throw error;
        setProducts(data || []);
      } else {
        // Regular query without search
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setWarehouses(data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filters.searchQuery, products]);

  const updateFilters = (updates: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    if ('searchQuery' in updates) {
      fetchProducts();
    }
  };

  return {
    products,
    filteredProducts,
    warehouses,
    loading,
    filters,
    updateFilters,
    refresh: fetchProducts
  };
} 