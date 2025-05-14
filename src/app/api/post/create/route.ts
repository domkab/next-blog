import Post from '@/lib/models/postModel';
import { connect } from '@/lib/mongodb/mongoose';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req: Request) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();
    console.log('req data:', data);
    console.log('inline images', data.images.inline);
    // auth middleware
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', {
        status: 401
      });
    }

    const slug = data.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      images: {
        main: {
          url: data.images.main.url,
          meta: data.images.main.meta || {},
        },
        inline: data.images.inline || [],
      },
      slug,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), {
      status: 200,
    })

  } catch (error) {
    console.log('Error creating post:', error);

    return new Response('Error creating post', {
      status: 500
    })
  };
};