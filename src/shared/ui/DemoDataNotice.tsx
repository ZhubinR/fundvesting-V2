export function DemoDataNotice({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      className={`flex items-center gap-2 text-xs font-medium text-secondary-300 bg-secondary-500/10 border border-secondary-500/40 rounded-lg px-3 py-2 mb-4 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M12 9V13M12 16.5H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>در حال نمایش داده‌های نمونه هستید — اتصال به سرور برقرار نشد.</span>
    </div>
  );
}
