
'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';

export function useFirebaseStorage() {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (path: string, file: File): Promise<string | null> => {
    if (!storage) {
        setError('Firebase Storage not initialized');
        return null;
    }
    setIsUploading(true);
    setError(null);
    setUploadProgress(0); // In a real app, you would use uploadBytesResumable to track progress

    const storageRef = ref(storage, path);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setIsUploading(false);
      setUploadProgress(100);
      return downloadURL;
    } catch (e: any) {
      console.error("Firebase Storage Error:", e);
      setError(e.message || 'An unknown error occurred during file upload.');
      setIsUploading(false);
      return null;
    }
  };

  return { uploadFile, isUploading, uploadProgress, error };
}
