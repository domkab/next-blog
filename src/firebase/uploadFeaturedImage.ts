import axios from 'axios';

export async function uploadFeaturedImage(
  file: File,
  slug: string,
  onProgress?: (percent: string) => void
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug); // actual slug of the featured post
    formData.append('target', 'featured');

    const { data } = await axios.post('/api/image/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = (progressEvent.loaded / (progressEvent.total || 1)) * 100;
        if (onProgress) onProgress(percent.toFixed(0));
      },
    });

    return data.url;
  } catch (error) {
    console.error('Failed to upload featured image:', error);
    throw new Error('Upload failed. Please try again.');
  }
}