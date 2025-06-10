import { useState } from 'react';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder?: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}
