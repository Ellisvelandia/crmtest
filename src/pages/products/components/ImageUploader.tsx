import { useRef, useEffect, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { useImageStorage } from '../hooks/useImageStorage';

interface ImageUploaderProps {
  imagePaths: string[];
  sku: string;
  onUpload: (paths: string[]) => void;
  onRemove: (index: number) => void;
}

export function ImageUploader({ imagePaths, sku, onUpload, onRemove }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, getSignedUrl, loading, error } = useImageStorage();
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);

  useEffect(() => {
    const loadSignedUrls = async () => {
      setLoadingUrls(true);
      try {
        const urls = await Promise.all(
          imagePaths.map(path => getSignedUrl(path))
        );
        setSignedUrls(urls);
      } catch (err) {
        console.error('Error loading signed URLs:', err);
      } finally {
        setLoadingUrls(false);
      }
    };

    loadSignedUrls();
  }, [imagePaths, getSignedUrl]);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    
    try {
      const paths = await uploadImages(files, sku);
      if (paths.length > 0) {
        onUpload(paths);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`p-4 border border-dashed border-emerald-200 rounded-lg bg-emerald-50/50 text-center cursor-pointer hover:bg-emerald-50 transition-colors group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="product-images"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={loading}
        />
        <div className="flex flex-col items-center gap-2">
          {loading ? (
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8 text-emerald-500 group-hover:scale-110 transition-transform" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium text-emerald-700">
              {loading ? 'Subiendo imágenes...' : 'Agregar Imágenes del Producto'}
            </p>
            <p className="text-xs text-emerald-600">
              {loading ? 'Por favor espere...' : 'Arrastre y suelte o haga clic para cargar'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {signedUrls.length > 0 && !loadingUrls && (
        <div className="grid grid-cols-2 gap-4">
          {signedUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Producto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {loadingUrls && signedUrls.length === 0 && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          <span className="ml-2 text-sm text-emerald-600">Cargando imágenes...</span>
        </div>
      )}
    </div>
  );
} 