"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Custom hook for managing Blob URLs with proper cleanup to prevent memory leaks.
 * 
 * This hook handles two types of image sources:
 * 1. Persisted images (Blob from database or URL string)
 * 2. Preview images (from user file uploads)
 * 
 * It automatically creates object URLs from Blobs and cleans them up
 * when they change or when the component unmounts.
 * 
 * @param persistedImage - The persisted image from data (Blob or URL string)
 * @returns Object containing display URL, preview state, and control functions
 */
export function useImageUrl(persistedImage: Blob | string | undefined) {
  // imagePreview is for URLs created from user file uploads
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create blob URL for persisted image using useMemo
  // This avoids calling setState in useEffect
  const persistedUrl = useMemo(() => {
    if (persistedImage && !previewUrl) {
      if (persistedImage instanceof Blob) {
        return URL.createObjectURL(persistedImage);
      }
      if (typeof persistedImage === "string") {
        return persistedImage;
      }
    }
    return null;
  }, [persistedImage, previewUrl]);

  // Cleanup persistedUrl when it changes or on unmount
  useEffect(() => {
    return () => {
      if (persistedUrl && persistedImage instanceof Blob) {
        URL.revokeObjectURL(persistedUrl);
      }
    };
  }, [persistedUrl, persistedImage]);

  // Cleanup previewUrl on unmount or when it changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // The display URL is either from user upload preview or from persisted data
  const displayUrl = previewUrl || persistedUrl;

  // Set a new preview URL (from file upload)
  const setPreview = useCallback((url: string | null) => {
    // Revoke previous preview URL before setting new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(url);
  }, [previewUrl]);

  // Create preview URL from a Blob
  const setPreviewFromBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setPreview(url);
  }, [setPreview]);

  // Clear the preview (reverts to persisted image if any)
  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);

  return {
    /** The URL to display (either preview or persisted) */
    displayUrl,
    /** The current preview URL (null if no preview) */
    previewUrl,
    /** Set a preview URL directly */
    setPreview,
    /** Create a preview URL from a Blob */
    setPreviewFromBlob,
    /** Clear the preview and revert to persisted image */
    clearPreview,
    /** Whether a preview is currently being shown */
    hasPreview: previewUrl !== null,
  };
}
