import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormData } from '@/types/FormData';
import { uploadPostImage } from '../thunks/postFormThunks';

export interface PostFormState extends FormData {
  fileUrl: string | null;
  imageUploadProgress: string | null;
  imageUploadError: string | null;
}

const initialState: PostFormState = {
  title: '',
  content: '',
  slug: '',
  category: '',
  images: {
    main: {
      url: '',
      meta: undefined
    },
    inline: []
  },
  fileUrl: null,
  imageUploadProgress: null,
  imageUploadError: null
};

const postFormSlice = createSlice({
  name: 'postForm',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<PostFormState>>) => {
      return { ...state, ...action.payload };
    },
    setFile: (state, action: PayloadAction<string | null>) => {
      state.fileUrl = action.payload;
    },
    setImageUploadProgress: (state, action: PayloadAction<string | null>) => {
      state.imageUploadProgress = action.payload;
    },
    setImageUploadError: (state, action: PayloadAction<string | null>) => {
      state.imageUploadError = action.payload;
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPostImage.pending, (state) => {
        state.imageUploadProgress = '0';
        state.imageUploadError = null;
      })
      .addCase(uploadPostImage.fulfilled, (state, action) => {
        if (action.payload.target === 'main') {
          state.images.main.url = action.payload.url;
        } else {
          state.images.inline.push({ url: action.payload.url });
        }
        state.imageUploadProgress = '100';
      })
      .addCase(uploadPostImage.rejected, (state) => {
        state.imageUploadProgress = null;
        state.imageUploadError = 'Upload failed';
      });
  },
});

export const {
  setFormData,
  setFile,
  setImageUploadProgress,
  setImageUploadError,
  resetForm,
} = postFormSlice.actions;

export default postFormSlice.reducer;