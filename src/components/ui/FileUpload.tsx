'use client';

import { useRef, useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from './button';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  folder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function FileUpload({
  value,
  onChange,
  folder,
  className,
  disabled,
  multiple = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const [preview, setPreview] = useState<string | string[] | null>(
    value || (multiple ? [] : null)
  );

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (multiple) {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadFile(file, folder))
      );
      const validUrls = urls.filter((url): url is string => url !== null);
      const newValue = [...((preview as string[]) || []), ...validUrls];
      setPreview(newValue);
      onChange(newValue);
    } else {
      const url = await uploadFile(files[0], folder);
      if (url) {
        setPreview(url);
        onChange(url);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent, urlToRemove?: string) => {
    e.stopPropagation();
    
    if (multiple && Array.isArray(preview)) {
      const newValue = preview.filter((url) => url !== urlToRemove);
      setPreview(newValue);
      onChange(newValue);
    } else {
      setPreview(null);
      onChange('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full min-h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={disabled || isUploading}
        multiple={multiple}
      />
      
      {preview ? (
        <div className="w-full p-4">
          {Array.isArray(preview) ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {preview.map((url) => (
                <div key={url} className="group relative">
                  <img
                    src={url}
                    alt="Preview"
                    className="h-32 w-full rounded-md object-cover"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, url)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-64 w-full">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <ImagePlus className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground/70">
            {multiple ? 'Multiple images supported' : 'PNG, JPG, JPEG up to 10MB'}
          </p>
        </div>
      )}
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
}
