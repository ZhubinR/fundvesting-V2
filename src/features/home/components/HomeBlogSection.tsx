import { BlogCard } from "@/features/content/components/BlogCard";
import { thumbnailUrl } from "@/features/content/api/content-api";
import type { Post } from "@/features/content/types";
import { Btn } from "@/shared/ui/Btn";
import { BoxTitle } from "@/shared/ui/BoxTitle";
import { toJalaliSlashString } from "@/shared/lib/jalali";

export function HomeBlogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-7">
        <BoxTitle textSize="24px" titleText="آخرین اخبار و تحلیل ها" />
        <Btn slug="/news" text="مشاهده همه" />
      </div>
      <div className="grid lg:grid-cols-4 lg:gap-5 md:grid-cols-2 grid-cols-1 gap-4">
        {posts.slice(0, 4).map((post) => (
          <BlogCard
            key={post.id}
            slug={`/news/${post.slug}`}
            thumbnail={thumbnailUrl(post.thumbnail)}
            title={post.title}
            desc={post.description}
            date={toJalaliSlashString(new Date(post.date_created))}
          />
        ))}
      </div>
    </section>
  );
}
