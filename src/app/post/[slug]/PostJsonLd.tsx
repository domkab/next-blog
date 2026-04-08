import { SITE_NAME, SITE_URL } from "@/lib/constants";
import JsonLd from "@/app/components/seo/JsonLd";
import { getImageUrl } from "@/utils/getImageUrl";
import { PostWithCategoryName } from "@/lib/services/postService";
import { normalizePostContent } from "@/utils/utils";
import { buildBreadcrumb } from "@/lib/metadata/structured-data";

const SITE_ID = `${SITE_URL}#website`;
const ORG_ID = `${SITE_URL}#organization`;

const createMetaDescription = (content: string, fallback?: string) => {
  if (fallback?.trim()) {
    return fallback.trim();
  }

  const cleanText = normalizePostContent(content).trim();

  if (cleanText.length <= 155) {
    return cleanText;
  }

  const trimmed = cleanText.slice(0, 155);
  const lastSpaceIndex = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpaceIndex).trim()}…`;
};

export default function PostJsonLd({
  post,
}: {
  post: PostWithCategoryName;
  slug: string;
}) {
  const title = post.title;
  const description = createMetaDescription(post.content, post.description);
  const heroUrl = post.images?.main?.url
    ? getImageUrl(post.images.main.url)
    : undefined;
  const postUrl = `${SITE_URL}/post/${post.slug}`;
  const categoryName = post.categoryName?.trim() || post.category || "Posts";

  const breadcrumb = buildBreadcrumb([
    { name: "Home", item: SITE_URL },
    {
      name: categoryName,
      item: `${SITE_URL}/search?category=${post.category}`,
    },
    { name: title, item: postUrl },
  ]);

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    headline: title,
    description,
    ...(heroUrl ? { image: [heroUrl] } : {}),
    ...(post.createdAt
      ? { datePublished: new Date(post.createdAt).toISOString() }
      : {}),
    ...(post.updatedAt
      ? { dateModified: new Date(post.updatedAt).toISOString() }
      : {}),
    articleSection: categoryName,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@id": ORG_ID,
    },
    isPartOf: {
      "@id": SITE_ID,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: {
      "@id": ORG_ID,
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    ...(heroUrl ? { logo: { "@type": "ImageObject", url: heroUrl } } : {}),
  };

  return (
    <>
      <JsonLd id="ld-organization" data={organization} />
      <JsonLd id="ld-website" data={website} />
      <JsonLd id="ld-breadcrumb-post" data={breadcrumb} />
      <JsonLd id="ld-blog-post" data={blogPosting} />
    </>
  );
}
