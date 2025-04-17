import { PostCategory } from '@/types/Post';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      main: {
        url: {
          type: String,
          default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
        },
        meta: {
          author: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      },
      inline: [
        {
          url: String,
          meta: {
            author: { type: String, default: '' },
            description: { type: String, default: '' },
          },
        },
      ],
    },
    category: {
      type: String,
      default: PostCategory.All,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;