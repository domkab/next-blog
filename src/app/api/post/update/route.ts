import { withAdminAuth } from "@/lib/auth/withAdminAuth";
import Post from "@/lib/models/postModel";
import { connect } from "@/lib/mongodb/mongoose";
import { PostUpdateInput } from "@/types/Post";
import { normalizePostContent } from "@/utils/utils";

export const PUT = withAdminAuth<PostUpdateInput>(async (user, body) => {
  await connect();

  const cleanedContent = normalizePostContent(body.content);
  console.log(body.images.main);
  
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      body.postId,
      {
        $set: {
          title: body.title,
          description: body.description,
          content: cleanedContent,
          category: body.category,
          images: {
            main: {
              url: body.images.main.url,
              meta: body.images.main.meta || {},
              altText:
                body.images.main.meta?.altText ||
                body.images.main.meta?.description ||
                "",
            },
            inline: body.images.inline || [],
          },
        },
      },
      { new: true },
    );

    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);

    return new Response("Error updating post", { status: 500 });
  }
});
