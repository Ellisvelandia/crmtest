import { useState } from 'react';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api/products';
import type { ProductFormData } from '../types';

export function useProductForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
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
      images: [],
      specifications: {}
    }
  });

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          images: [...prev.metadata.images, ...newImages]
        }
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        images: prev.metadata.images.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Convert numeric strings to numbers and add is_active
      const productData = {
        ...formData,
        price_usd: parseFloat(formData.price_usd),
        price_mxn: parseFloat(formData.price_mxn),
        weight: parseFloat(formData.weight),
        is_active: true
      };

      await productsApi.createProduct(productData, 'default-warehouse', 0);
      toast.success('Product created successfully');
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleImageUpload,
    removeImage,
    handleSubmit
  };
} 