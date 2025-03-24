import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

export function ImageUploader({ images, onUpload, onRemove }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div 
        className="p-4 border border-dashed border-emerald-200 rounded-lg bg-emerald-50/50 text-center cursor-pointer hover:bg-emerald-50 transition-colors group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="product-images"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-8 w-8 text-emerald-500 group-hover:scale-110 transition-transform" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-emerald-700">Add Product Images</p>
            <p className="text-xs text-emerald-600">Drag & drop or click to upload</p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 