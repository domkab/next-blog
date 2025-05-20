import { NextRequest } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import FeaturedPost from '@/lib/models/featuredPostModel';

export const GET = async () => {
  await connect();

  try {
    const featuredPosts = await FeaturedPost.find().sort({ priority: -1 }).populate('postId').lean();
    return new Response(JSON.stringify(featuredPosts), { status: 200 });
  } catch (error) {
    console.error('[FEATURED_POST_GET_ERROR]', error);
    return new Response('Error fetching featured posts', { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connect();
  const body = await req.json();

  try {
    const existing = await FeaturedPost.findOne({ postId: body.postId });

    if (existing) {
      await FeaturedPost.updateOne({ postId: body.postId }, body);
    } else {
      await FeaturedPost.create(body);
    }

    return new Response('Featured post saved', { status: 200 });
  } catch (error) {
    console.error('[FEATURED_POST_SAVE_ERROR]', error);
    return new Response('Error saving featured post', { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  await connect();
  const { postId } = await req.json();

  if (!postId) {
    return new Response('Missing postId', { status: 400 });
  }

  try {
    await FeaturedPost.deleteOne({ postId });
    return new Response('Featured post deleted', { status: 200 });
  } catch (error) {
    console.error('[FEATURED_POST_DELETE_ERROR]', error);
    return new Response('Error deleting featured post', { status: 500 });
  }
};