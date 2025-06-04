import { connect } from '@/lib/mongodb/mongoose';
import { PostType } from '@/types/Post';
import Post from '../models/postModel';
import { Types } from 'mongoose';
import FeaturedPost from '../models/featuredPostModel';

export async function getRecentPosts(limit = 9, order = 'desc'): Promise<PostType[]> {
  await connect();
  const sort = order === 'asc' ? 1 : -1;

  const posts = await Post.find().lean().sort({ updatedAt: sort }).limit(limit);

  return posts as PostType[]
};

export async function getPostBySlug(slug: string): Promise<PostType> {
  await connect();
  const post = await Post.findOne({ slug }).lean()

  return post as PostType;
}



type FeaturedWithPost = {
  _id?: string | Types.ObjectId;
  postId?: PostType;
  overrideSummary?: string;
  overrideImage?: string;
};

export async function getFeaturedPosts(): Promise<{
  post: PostType;
  overrideSummary?: string;
  overrideImage?: string;
}[]> {
  await connect();

  const featured = await FeaturedPost.find()
    .sort({ priority: -1 })
    .populate('postId')
    .lean();

  const normalized = (featured as FeaturedWithPost[])
    .filter((item) => item.postId)
    .map((item) => ({
      _id: item._id?.toString(),
      post: item.postId!,
      overrideSummary: item.overrideSummary,
      overrideImage: item.overrideImage,
    }));

  return normalized;
};