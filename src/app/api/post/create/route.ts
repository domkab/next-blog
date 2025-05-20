import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import Post from '@/lib/models/postModel';
import { connect } from '@/lib/mongodb/mongoose';
import { PostCreateInput } from '@/types/Post';

export const POST = withAdminAuth<PostCreateInput>(async (user, body) => {
  await connect();

  try {
    console.log('req data:', body);
    console.log('inline images', body.images.inline);

    const slug = body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      title: body.title,
      description: body.description,
      content: body.content,
      category: body.category,
      images: {
        main: {
          url: body.images.main.url,
          meta: body.images.main.meta || {},
        },
        inline: body.images.inline || [],
      },
      slug,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (err) {
    console.error('Error creating post:', err);

    return new Response('Error creating post', { status: 500 });
  }
});