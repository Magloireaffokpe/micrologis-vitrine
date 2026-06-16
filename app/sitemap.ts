import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/products";

export default async function sitemap() {
  const supabase = await createServerSupabaseClient();
  const categories = await getCategories();
  const baseUrl = "https://micrologis.vercel.app";
  const now = new Date().toISOString();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  const blogPages = (blogPosts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const { data: products } = await supabase
    .from("products")
    .select("slug, category_id, category:categories(slug), updated_at")
    .eq("is_active", true);

  const productPages = (products ?? []).map((product) => {
    const cat = Array.isArray(product.category) ? product.category[0] : product.category;
    return {
      url: `${baseUrl}/${cat?.slug ?? "unknown"}/${product.slug}`,
      lastModified: product.updated_at ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...categoryPages, ...blogPages, ...productPages];
}
