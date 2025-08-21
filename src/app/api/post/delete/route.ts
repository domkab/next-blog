import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import FeaturedPost from '@/lib/models/featuredPostModel';
import Post from '@/lib/models/postModel';
import { connect } from '@/lib/mongodb/mongoose';

type PostDeleteInput = {
  postId?: string;
  postIds?: string[];
  userMongoId: string;
};

export const DELETE = withAdminAuth<PostDeleteInput>(async (user, body) => {
  const { deleteFeaturedImage, deletePostImages } = await import('@/firebase/deleteImages')

  await connect();

  const postIds = body.postIds ?? (body.postId ? [body.postId] : []);

  if (postIds.length === 0) {
    return new Response('Missing postId or postIds', { status: 400 });
  }

  try {
    const posts = await Post.find({ _id: { $in: postIds } });

    for (const post of posts) {
      const slug = post.slug;

      await Post.findByIdAndDelete(post._id);
      await deletePostImages(slug);
      await FeaturedPost.deleteOne({ postId: post._id });
      await deleteFeaturedImage(slug);
    };

    return new Response('Posts deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting post(s):', error);
    return new Response('Error deleting posts', { status: 500 });
  }
});