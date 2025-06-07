import { FeaturedPostType } from '@/types/Post';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFeaturedPosts = createAsyncThunk(
  'featuredPost/fetch',
  async () => {
    const res = await axios.get('/api/featured');

    return res.data as FeaturedPostType[];
  }
);

export const saveFeaturedPost = createAsyncThunk(
  'featuredPost/save',
  async (payload: {
    postId: string;
    overrideSummary?: string;
    overrideImage?: string;
    priority?: number;
    userMongoId: string;
  }) => {
    await axios.post('/api/featured', payload);

    return payload.postId;
  }
);

export const deleteFeaturedPost = createAsyncThunk(
  'featuredPost/delete',
  async (payload: { postId: string; userMongoId: string }) => {
    await axios.delete('/api/featured', { data: payload });

    return payload.postId;
  }
);