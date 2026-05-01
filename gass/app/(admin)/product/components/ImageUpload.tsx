"use client";

import React, { useState, useRef, useCallback } from "react";
import { 
  Upload, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Trash2,
  Plus,
  RotateCcw
} from "lucide-react";
import { uploadSingleImage } from "@/service/upload.service";
import { getImageUrl } from "@/constant/config";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'],
  className = "",
  disabled = false,
  placeholder = "Click để chọn ảnh"
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert value to array for consistent handling
  const currentImages = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Định dạng không hỗ trợ. Chỉ chấp nhận: JPG, PNG, WEBP, GIF`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File quá lớn. Tối đa ${maxSize}MB`;
    }
    
    if (!multiple && currentImages.length >= 1) {
      return "Chỉ được upload 1 ảnh";
    }
    
    if (multiple && currentImages.length + uploadedFiles.length >= maxFiles) {
      return `Tối đa ${maxFiles} ảnh`;
    }
    
    return null;
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    if (validFiles.length === 0) return;

    // Create upload entries
    const newUploads: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploads]);

    // Upload files one by one
    for (const upload of newUploads) {
      try {
        setUploadedFiles(prev => 
          prev.map(u => u.id === upload.id ? { ...u, progress: 50 } : u)
        );

        const result = await uploadSingleImage(upload.file);
        
        if (result.success) {
          setUploadedFiles(prev => 
            prev.map(u => u.id === upload.id ? { 
              ...u, 
              status: 'success', 
              progress: 100 
            } : u)
          );

          // Update parent component - sử dụng path từ backend
          const newImageUrl = result.data.path || result.data.url;
          if (multiple) {
            onChange([...currentImages, newImageUrl]);
          } else {
            onChange(newImageUrl);
          }
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadedFiles(prev => 
          prev.map(u => u.id === upload.id ? { 
            ...u, 
            status: 'error', 
            progress: 0,
            error: error.message 
          } : u)
        );
      }
    }

    // Clean up completed uploads after delay
    setTimeout(() => {
      setUploadedFiles(prev => prev.filter(u => u.status === 'uploading'));
    }, 3000);
  }, [currentImages, multiple, onChange]);

  const retryUpload = useCallback(async (id: string) => {
    const upload = uploadedFiles.find(u => u.id === id);
    if (!upload) return;

    setUploadedFiles(prev => 
      prev.map(u => u.id === id ? { ...u, status: 'uploading', progress: 0, error: undefined } : u)
    );

    try {
      setUploadedFiles(prev => 
        prev.map(u => u.id === id ? { ...u, progress: 50 } : u)
      );

      const result = await uploadSingleImage(upload.file);
      
      if (result.success) {
        setUploadedFiles(prev => 
          prev.map(u => u.id === id ? { ...u, status: 'success', progress: 100 } : u)
        );

        const newImageUrl = result.data.path || result.data.url;
        if (multiple) {
          onChange([...currentImages, newImageUrl]);
        } else {
          onChange(newImageUrl);
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      setUploadedFiles(prev => 
        prev.map(u => u.id === id ? { ...u, status: 'error', progress: 0, error: error.message } : u)
      );
    }
  }, [uploadedFiles, multiple, currentImages, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, [handleFileUpload, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  const removeImage = async (imageUrl: string, index: number) => {
    if (disabled) return;
    
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;

    // Remove from local state
    if (multiple) {
      const newImages = currentImages.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const handleClickUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Current Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentImages.map((imageUrl, index) => (
          <div key={index} className="relative group aspect-square">
            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-[#d4af37] bg-gray-100">
              <img
                src={getImageUrl(imageUrl)}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {index === 0 && (
                <div className="absolute top-0 left-0 bg-[#b91c1c] text-white text-[10px] px-2 py-0.5 rounded-br-lg font-bold z-10 shadow-sm">
                  ẢNH CHÍNH
                </div>
              )}
            </div>
            
            {/* Badge for main image */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-[#b91c1c] text-white text-xs px-2 py-1 rounded">
                Ảnh chính
              </div>
            )}
            
            {/* Action Buttons */}
            {!disabled && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(getImageUrl(imageUrl));
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-all shadow-lg"
                  title="Xem ảnh"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(imageUrl, index);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-all shadow-lg"
                  title="Xóa ảnh"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add More Button */}
        {(multiple && currentImages.length < maxFiles) || (!multiple && currentImages.length === 0) ? (
          <div
            className={`
              aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
              ${isDragging 
                ? 'border-[#b91c1c] bg-[#fff8e1]' 
                : 'border-[#d4af37] hover:border-[#b91c1c] hover:bg-[#fffdf5]'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleClickUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Plus className={`w-8 h-8 ${isDragging ? 'text-[#b91c1c]' : 'text-[#8b5e3c]'}`} />
            <p className="text-xs text-[#8b5e3c] text-center px-2">
              {isDragging ? 'Thả ảnh vào đây' : placeholder}
            </p>
            <p className="text-xs text-gray-500 text-center px-2">
              Max {maxSize}MB
            </p>
          </div>
        ) : null}
      </div>

      {/* Upload Info */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• {multiple ? `Tối đa ${maxFiles} ảnh` : 'Chỉ 1 ảnh'}</p>
        <p>• Kích thước tối đa: {maxSize}MB/ảnh</p>
        <p>• Định dạng: JPG, PNG, WEBP, GIF</p>
        {multiple && <p>• Ảnh đầu tiên sẽ là ảnh chính</p>}
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#8b5e3c]">Đang upload:</h4>
          {uploadedFiles.map((upload) => (
            <div key={upload.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded overflow-hidden border">
                <img
                  src={upload.url}
                  alt={upload.file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#5d4037]">
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                  </label>
                  {currentImages.length > 0 && !disabled && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn xóa tất cả ảnh?')) {
                          onChange?.(multiple ? [] : "" as any);
                          setUploadedFiles([]);
                        }
                      }}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Xóa tất cả
                    </button>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {upload.file.name}
                </p>
                <div className="flex items-center space-x-2">
                  {upload.status === 'uploading' && (
                    <>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#b91c1c] h-2 rounded-full transition-all"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                      <Loader2 className="w-4 h-4 animate-spin text-[#b91c1c]" />
                    </>
                  )}
                  {upload.status === 'success' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Thành công</span>
                    </div>
                  )}
                  {upload.status === 'error' && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{upload.error}</span>
                      <button
                        onClick={() => retryUpload(upload.id)}
                        className="ml-2 p-1 hover:bg-gray-200 rounded"
                        title="Thử lại"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};