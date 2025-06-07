import { getFeaturedPosts } from '@/lib/services/postService';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getFeaturedPosts();

  return NextResponse.json(posts);
};
