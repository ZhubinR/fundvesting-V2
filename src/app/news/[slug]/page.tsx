import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchPostSlugs, fetchRelatedPosts, thumbnailUrl } from "@/features/content/api/content-api";
import { TitleSection } from "@/features/content/components/TitleSection";
import { BoxTitle } from "@/shared/ui/BoxTitle";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { toJalaliSlashString } from "@/shared/lib/jalali";

export async function generateStaticParams() {
  try {
    const slugs = await fetchPostSlugs("posts");
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.warn("Could not pre-render news slugs at build time; falling back to on-demand rendering.", error);
    return [];
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { value: post, isDemo } = await fetchPostBySlug("posts", params.slug);
  if (!post) notFound();

  const relatedPosts = await fetchRelatedPosts("posts", params.slug);

  return (
    <section className="mb-16 flex lg:flex-row flex-col gap-4">
      <div className="p-2 md:p-3 lg:p-4 xl:p-6 bg-background-800 dark:bg-[#eee] rounded-2xl lg:w-2/3">
        {isDemo && <DemoDataNotice />}
        <TitleSection
          text={post.title}
          desc={post.description}
          date={toJalaliSlashString(new Date(post.date_created))}
          thumbnail={thumbnailUrl(post.thumbnail)}
        />
        {/* eslint-disable-next-line react/no-danger -- content is authored in the Directus CMS, not user input */}
        <div className="blogContent" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div className="lg:w-1/3 bg-background-800 dark:bg-[#eee] rounded-2xl p-2 md:p-3 lg:p-4 h-fit flex flex-col gap-6">
        <BoxTitle titleText="آخرین اخبار منتشر شده" textSize="20px" />
        {relatedPosts.map((related) => (
          <Link
            href={`/news/${related.slug}`}
            key={related.id}
            className="flex gap-2 items-center justify-between p-3 bg-background-500 dark:bg-white border border-background-700 dark:border-darkBackground-100 shadow-lg rounded-lg"
          >
            {thumbnailUrl(related.thumbnail) && (
              <Image src={thumbnailUrl(related.thumbnail)!} width={128} height={64} alt="thumbnail" />
            )}
            <div className="flex flex-col gap-1">
              <h4 className="line-clamp-1 text-[17px] font-medium text-white dark:text-background-500">
                {related.title}
              </h4>
              <p className="line-clamp-2 text-sm text-background-300 dark:text-neutral-600">
                {related.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
