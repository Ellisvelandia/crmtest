import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust this import based on your supabase client location

interface UseImageStorageReturn {
  uploadImages: (files: FileList, sku: string) => Promise<string[]>;
  removeImage: (path: string) => Promise<void>;
  getSignedUrl: (path: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export function useImageStorage(): UseImageStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: FileList, sku: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    const uploadedPaths: string[] = [];

    try {
      // Get existing images for this SKU to determine next number
      const { data: existingFiles } = await supabase.storage
        .from('product-images')
        .list(sku);

      const startingNumber = existingFiles ? existingFiles.length + 1 : 1;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${sku}-${startingNumber + i}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(`${sku}/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        if (data) {
          uploadedPaths.push(data.path);
        }
      }

      return uploadedPaths;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading images');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (path: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error: removeError } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (removeError) throw removeError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing image');
    } finally {
      setLoading(false);
    }
  };

  const getSignedUrl = async (path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting signed URL');
      return '';
    }
  };

  return {
    uploadImages,
    removeImage,
    getSignedUrl,
    loading,
    error
  };
} 