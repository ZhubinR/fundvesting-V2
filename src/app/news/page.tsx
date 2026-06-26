import { fetchPosts, thumbnailUrl } from "@/features/content/api/content-api";
import { BlogCard } from "@/features/content/components/BlogCard";
import { BlogTitle } from "@/features/content/components/BlogTitle";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { toJalaliSlashString } from "@/shared/lib/jalali";

export default async function NewsPage() {
  const { value: posts, isDemo } = await fetchPosts("posts");

  return (
    <>
      <BlogTitle text="اخبار و تحلیل ها" />
      {isDemo && <DemoDataNotice />}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            slug={`/news/${post.slug}`}
            title={post.title}
            thumbnail={thumbnailUrl(post.thumbnail)}
            desc={post.description}
            date={toJalaliSlashString(new Date(post.date_created))}
          />
        ))}
      </section>
    </>
  );
}
