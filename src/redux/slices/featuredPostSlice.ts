import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteFeaturedPost, fetchFeaturedPosts } from '../thunks/featuredPostThunks';

export interface FeaturedPost {
  postId: string;
  overrideSummary?: string;
  overrideImage?: string;
}

interface FeaturedPostsState {
  featured: FeaturedPost[];
  loading: boolean;
  error: string | null;
}

const initialState: FeaturedPostsState = {
  featured: [],
  loading: false,
  error: null,
};

const featuredPostsSlice = createSlice({
  name: 'featuredPost',
  initialState,
  reducers: {
    clearFeaturedPosts: (state) => {
      state.featured = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action: PayloadAction<FeaturedPost[]>) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch featured posts';
      })
      .addCase(deleteFeaturedPost.fulfilled, (state, action: PayloadAction<string>) => {
        state.featured = state.featured.filter((f) => f.postId !== action.payload);
      });
  },
});

export const { clearFeaturedPosts } = featuredPostsSlice.actions;
export default featuredPostsSlice.reducer;