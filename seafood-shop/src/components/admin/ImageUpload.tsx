'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadIndex, setUploadIndex] = useState<number>(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Chỉ chấp nhận file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn (tối đa 5MB)');
      return;
    }

    setUploading(index);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const newImages = [...images];
        newImages[index] = data.data.url;
        onChange(newImages);
      } else {
        alert(data.error || 'Lỗi khi upload ảnh');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi upload ảnh');
    } finally {
      setUploading(null);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addImage = () => {
    onChange([...images, '']);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Hình ảnh</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            {/* Image preview or upload area */}
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
              {img && img.trim() ? (
                <>
                  <Image
                    src={img}
                    alt={`Ảnh ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-white text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-100">
                      Đổi
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, index)}
                        disabled={uploading !== null}
                      />
                    </label>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400">
                  {uploading === index ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span className="text-sm">Đang tải...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Tải ảnh lên</span>
                      <span className="text-xs mt-1">hoặc dán URL</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, index)}
                    disabled={uploading !== null}
                  />
                </label>
              )}
            </div>

            {/* URL input */}
            <input
              type="text"
              value={img}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Hoặc dán URL ảnh..."
              className="w-full mt-2 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-primary focus:border-transparent"
            />

            {/* Remove button for empty slots */}
            {!img && images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm hover:bg-red-600 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Add more button */}
        <button
          type="button"
          onClick={addImage}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">Thêm ảnh</span>
        </button>
      </div>

      <p className="text-xs text-gray-500">
        💡 Click vào ô để tải ảnh từ máy tính hoặc dán URL ảnh. Hỗ trợ JPG, PNG, WebP (tối đa 5MB)
      </p>
    </div>
  );
}
