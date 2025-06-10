import { connect } from '@/lib/mongodb/mongoose';
import FeaturedPost from '@/lib/models/featuredPostModel';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

export const GET = async () => {
  await connect();

  try {
    const featuredPosts = await FeaturedPost.find()
      .sort({ priority: -1 })
      .populate('postId')

    const normalized = featuredPosts.map((item) => ({
      _id: item._id.toString(),
      post: item.postId,
      overrideSummary: item.overrideSummary,
      overrideImage: item.overrideImage,
    }));

    return new Response(JSON.stringify(normalized), { status: 200 });
  } catch (error) {
    console.error('[FEATURED_POST_GET_ERROR]', error);
    return new Response('Error fetching featured posts', { status: 500 });
  }
};

type FeaturedPostPayload = {
  postId: string;
  overrideSummary?: string;
  overrideImage?: string;
  priority?: number;
  userMongoId: string;
};

export const POST = withAdminAuth<FeaturedPostPayload>(async (_user, body) => {
  await connect();

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
});

type DeletePayload = {
  postId: string;
  userMongoId: string;
};

export const DELETE = withAdminAuth<DeletePayload>(async (_user, body) => {
  await connect();

  if (!body.postId) {
    return new Response('Missing postId', { status: 400 });
  }

  try {
    await FeaturedPost.deleteOne({ postId: body.postId });
    return new Response('Featured post deleted', { status: 200 });
  } catch (error) {
    console.error('[FEATURED_POST_DELETE_ERROR]', error);
    return new Response('Error deleting featured post', { status: 500 });
  }
});