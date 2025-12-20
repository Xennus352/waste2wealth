
import PostClient from "./PostClient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const post = await getPost(id);

  const ogImage =
    Array.isArray(post.images) && post.images.length > 0
      ? post.images[0]
      : "https://waste2wealth-beta.vercel.app/og-fallback.webp";

  return {
    title: post.description?.slice(0, 100),

    openGraph: {
      title: post.description?.slice(0, 100),
      url: `https://waste2wealth-beta.vercel.app/post/${id}`,
      siteName: "Waste2Wealth",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",

      title: post.description?.slice(0, 100),
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: any) {
  const { id } = await params;
  const post = await getPost(id);
  return <PostClient post={post} />;
}
