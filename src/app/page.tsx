import { fetchGoldWeightOptions, fetchPosts } from "@/features/content/api/content-api";
import { HomePage } from "@/features/home/components/HomePage";

export default async function Page() {
  const [{ value: posts, isDemo: isPostsDemo }, { value: goldWeightOptions, isDemo: isWeightOptionsDemo }] =
    await Promise.all([fetchPosts("posts"), fetchGoldWeightOptions()]);

  return (
    <HomePage
      posts={posts}
      goldWeightOptions={goldWeightOptions}
      isContentDemo={isPostsDemo || isWeightOptionsDemo}
    />
  );
}
