/**
 * The original `suggest/page.jsx` was an unfinished scaffold
 * (`<div>First</div>`) with no real content — this keeps it an honest
 * placeholder rather than inventing a feature that was never built.
 */
export default function SuggestPage() {
  return (
    <section className="bg-background-800 dark:bg-[#eee] rounded-3xl p-12 text-center">
      <h1 className="text-2xl font-semibold text-white dark:text-neutral-800">این صفحه به‌زودی تکمیل می‌شود</h1>
      <p className="mt-3 text-background-200 dark:text-neutral-600">
        برای ارسال پیشنهاد، فعلاً می‌توانید از صفحه{" "}
        <a href="/contact" className="text-primary-400 hover:underline">
          تماس با ما
        </a>{" "}
        استفاده کنید.
      </p>
    </section>
  );
}
