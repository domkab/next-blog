// interface FeaturedPostState {
//   selectedPostId: string | null;
//   overrideSummary: string;
//   overrideImage: string;
// }

// const initialState: FeaturedPostState = {
//   selectedPostId: null,
//   overrideSummary: '',
//   overrideImage: '',
// };


// •	setFeaturedPostId
// •	setOverrideSummary
// •	setOverrideImage
// •	resetFeaturedPostData

// bybis

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeaturedPost {
  postId: string;
  overrideSummary?: string;
  overrideImage?: string;
}

interface FeaturedPostState {
  featured: FeaturedPost[]; // even if it's 1 now, scalable to more later
}

const initialState: FeaturedPostState = {
  featured: [],
};

const featuredPostSlice = createSlice({
  name: 'featuredPost',
  initialState,
  reducers: {
    addFeaturedPost: (state, action: PayloadAction<FeaturedPost>) => {
      state.featured.push(action.payload);
    },
    updateFeaturedPost: (
      state,
      action: PayloadAction<{ postId: string; data: Partial<FeaturedPost> }>
    ) => {
      const index = state.featured.findIndex(f => f.postId === action.payload.postId);
      if (index !== -1) {
        state.featured[index] = { ...state.featured[index], ...action.payload.data };
      }
    },
    removeFeaturedPost: (state, action: PayloadAction<string>) => {
      state.featured = state.featured.filter(f => f.postId !== action.payload);
    },
    setFeaturedPosts: (state, action: PayloadAction<FeaturedPost[]>) => {
      state.featured = action.payload;
    },
    resetFeaturedPosts: (state) => {
      state.featured = [];
    },
  },
});

export const {
  addFeaturedPost,
  updateFeaturedPost,
  removeFeaturedPost,
  setFeaturedPosts,
  resetFeaturedPosts,
} = featuredPostSlice.actions;

export default featuredPostSlice.reducer;