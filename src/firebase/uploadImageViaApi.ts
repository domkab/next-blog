import axios from 'axios';

export async function uploadImageViaApi(
  file: File,
  target: 'main' | 'inline',
  slug: string,
  onProgress: (progress: string) => void,
  onError: (error: string) => void,
  onSuccess: (url: string) => void
) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug);
    formData.append('target', target);

    const response = await axios.post('/api/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = (progressEvent.loaded / (progressEvent.total || 1)) * 100;
        onProgress(percent.toFixed(0));
      },
    });

    console.log('upload to firebase:', response.data);

    onProgress('100');
    onSuccess(response.data.url);
  } catch (error: unknown) {
    console.error('Upload failed:', error);
    if (axios.isAxiosError(error)) {
      onError(error.response?.data?.error || 'Upload failed');
    } else {
      onError('Upload failed');
    }
  }
}