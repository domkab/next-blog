import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPostBySlug } from "@/lib/services/postService";
import DraftView from "@/app/components/Dashboard/Drafts/DraftView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { status: "draft" });

  return {
    title: post ? `Draft: ${post.title}` : "Draft preview",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug, { status: "draft" });

  if (!post) {
    redirect("/dashboard");
  }

  const serializedPost = JSON.parse(JSON.stringify(post));

  return <DraftView post={serializedPost} />;
}
