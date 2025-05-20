import { withAdminAuth } from '@/lib/auth/withAdminAuth';
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
    await Post.findByIdAndDelete(body.postId);

    return new Response('Post deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);

    return new Response('Error deleting post', { status: 500 });
  }
});