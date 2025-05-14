import Post from '@/lib/models/postModel';
import { connect } from '@/lib/mongodb/mongoose';
import { currentUser } from '@clerk/nextjs/server'

export const PUT = async (req: Request) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      {
        $set: {
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
          }
        },
      },
      { new: true }
    );

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
    });

  } catch (error) {
    console.log('Error creating post:', error);
    return new Response('Error creating post', {
      status: 500,
    });
  }
}