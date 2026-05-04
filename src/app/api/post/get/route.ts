import Post from "@/lib/models/postModel";
import { connect } from "@/lib/mongodb/mongoose";

const allowedStatuses = ["draft", "published", "scheduled"] as const;

export const POST = async (req: Request) => {
  await connect();

  const data = await req.json();

  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit);
    const sortDirection = data.order === "asc" ? 1 : -1;
    const statusFilter = allowedStatuses.includes(data.status)
      ? { status: data.status }
      : {};

    const query: Record<string, unknown> = {
      ...statusFilter,
      ...(data.category ? { category: data.category } : {}),
      ...(data.slug ? { slug: data.slug } : {}),
      ...(data.postId ? { _id: data.postId } : {}),
      ...(data.searchTerm
        ? {
            $or: [
              { title: { $regex: data.searchTerm, $options: "i" } },
              { content: { $regex: data.searchTerm, $options: "i" } },
            ],
          }
        : {}),
    };

    if (!data.isAdmin && data.userId) {
      query.userId = data.userId;
    }

    const posts = await Post.find(query)
      .lean()
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthsPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return new Response(JSON.stringify({ posts, totalPost, lastMonthsPosts }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    return new Response("Error retrieving post", {
      status: 500,
    });
  }
};
