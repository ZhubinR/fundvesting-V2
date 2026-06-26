import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchPostSlugs, thumbnailUrl } from "@/features/content/api/content-api";
import { TitleSection } from "@/features/content/components/TitleSection";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { toJalaliSlashString } from "@/shared/lib/jalali";

export async function generateStaticParams() {
  try {
    const slugs = await fetchPostSlugs("blog");
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.warn("Could not pre-render blog slugs at build time; falling back to on-demand rendering.", error);
    return [];
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { value: post, isDemo } = await fetchPostBySlug("blog", params.slug);
  if (!post) notFound();

  return (
    <section className="p-6 bg-background-800 dark:bg-[#eee] rounded-2xl mb-16">
      {isDemo && <DemoDataNotice />}
      <div className="p-2 md:p-3 lg:p-4 xl:p-6 bg-background-800 rounded-2xl lg:w-2/3">
        <TitleSection
          text={post.title}
          desc={post.description}
          date={toJalaliSlashString(new Date(post.date_created))}
          thumbnail={thumbnailUrl(post.thumbnail)}
        />
        {/* eslint-disable-next-line react/no-danger -- content is authored in the Directus CMS, not user input */}
        <div className="blogContent" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </section>
  );
}
