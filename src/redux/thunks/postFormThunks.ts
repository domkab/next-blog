import { createAsyncThunk } from '@reduxjs/toolkit';
import { setImageUploadProgress, setImageUploadError, setFormData } from '../slices/postFormSlice';
import { generateSlug } from '@/utils/generateSlug';
import { RootState } from '../store';
import { uploadImageViaApi } from '@/utils/uploadImageViaApi';
// import { uploadImageToFirebase } from '@/utils/uploadImageToFirebase';

interface UploadImageResponse {
  url: string;
  target: 'main' | 'inline';
}

export const uploadPostImage = createAsyncThunk<
  UploadImageResponse,
  { file: File; target: 'main' | 'inline' },
  { state: RootState }
>(
  'postForm/uploadPostImage',
  async ({ file, target }, { dispatch, getState }) => {
    dispatch(setImageUploadProgress('0'));
    dispatch(setImageUploadError(null));

    const state = getState();
    const { title, slug: currentSlug } = state.postForm;

    const slug = currentSlug || generateSlug(title);

    if (!currentSlug) {
      dispatch(setFormData({ slug }));
    }

    try {
      return new Promise<UploadImageResponse>((resolve, reject) => {
        uploadImageViaApi(
          file,
          target,
          slug,
          (progress: string) => {
            dispatch(setImageUploadProgress(progress));
          },
          (error: string) => {
            dispatch(setImageUploadError(error));
            reject(error);
          },
          (url: string) => {
            dispatch(setImageUploadProgress(null));
            resolve({ url, target });
          }
        );
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch(setImageUploadError(errorMessage));
      console.log('Error uploading image:', error);
      throw error;
    }
  }
);
