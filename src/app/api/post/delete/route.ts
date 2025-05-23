import { deleteFeaturedImage, deletePostImages } from '@/firebase/deleteImages';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import FeaturedPost from '@/lib/models/featuredPostModel';
import Post from '@/lib/models/postModel';
import { connect } from '@/lib/mongodb/mongoose';

type PostDeleteInput = {
  postId: string;
  userMongoId: string;
};

export const DELETE = withAdminAuth<PostDeleteInput>(async (user, body) => {
  await connect();

  if (!body?.postId) {
    return new Response('Missing postId', { status: 400 });
  }

  try {
    const post = await Post.findById(body.postId);

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    const slug = post.slug;

    await Post.findByIdAndDelete(body.postId);
    await deletePostImages(slug);

    await FeaturedPost.deleteOne({ postId: post._id });
    await deleteFeaturedImage(slug);

    return new Response('Post deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);

    return new Response('Error deleting post', { status: 500 });
  }
});