import { connect } from '@/lib/mongodb/mongoose';
import Post from './models/postModel';
import { PostType } from '@/types/Post';

export async function getRecentPosts(limit = 9, order = 'desc'): Promise<PostType[]> {
  await connect();
  const sort = order === 'asc' ? 1 : -1;

  const posts = await Post.find().lean().sort({ updatedAt: sort }).limit(limit);

  return posts as PostType[]
}

export async function getPostBySlug(slug: string): Promise<PostType> {
  await connect();
  const post = await Post.findOne({ slug }).lean()

  return post as PostType;
}