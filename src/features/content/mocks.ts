import type { GoldWeightOption, Post, PostCollection } from "./types";

const SAMPLE_TITLES: Record<PostCollection, string[]> = {
  blog: [
    "چگونه صندوق سرمایه‌گذاری مناسب خود را انتخاب کنیم؟",
    "تفاوت صندوق‌های اهرمی و صندوق‌های طلا",
    "آشنایی با مفهوم NAV و کاربرد آن",
    "حباب صندوق چیست و چرا باید به آن توجه کرد؟",
  ],
  posts: [
    "تحلیل هفتگی بازار صندوق‌های اهرمی",
    "روند قیمت طلا و تأثیر آن بر صندوق‌های طلا",
    "بررسی عملکرد صندوق‌های سرمایه‌گذاری در ماه گذشته",
    "نکات مهم پیش از سرمایه‌گذاری در صندوق‌های اهرمی",
  ],
};

const SAMPLE_DESCRIPTION =
  "این یک متن نمونه است که هنگام عدم دسترسی به سرور نمایش داده می‌شود تا بتوانید ظاهر کامل صفحه را مشاهده کنید.";

const SAMPLE_CONTENT = `<p>${SAMPLE_DESCRIPTION}</p><p>${SAMPLE_DESCRIPTION}</p>`;

function slugify(title: string, index: number): string {
  return `sample-post-${index + 1}`;
}

export function generateMockPosts(collection: PostCollection, count = 4): Post[] {
  const titles = SAMPLE_TITLES[collection];

  return Array.from({ length: count }, (_, index) => {
    const title = titles[index % titles.length] ?? titles[0] ?? "نمونه مقاله";
    const daysAgo = index * 3;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: index + 1,
      slug: slugify(title, index),
      title,
      description: SAMPLE_DESCRIPTION,
      thumbnail: null,
      content: SAMPLE_CONTENT,
      date_created: date.toISOString(),
    };
  });
}

export function generateMockPost(collection: PostCollection, slug: string): Post {
  const [fallback] = generateMockPosts(collection, 1);
  return { ...(fallback as Post), slug };
}

export function generateMockGoldWeightOptions(): GoldWeightOption[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { date: today, name: "شمش طلا", shemsh: 1.2, seke: null },
    { date: today, name: "سکه طلا", shemsh: null, seke: 0.9 },
  ];
}
