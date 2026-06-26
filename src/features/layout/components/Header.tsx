"use client";

import { TimeDate } from "./TimeDate";
import { useDarkMode } from "../hooks/use-dark-mode";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <header className="lg:px-4 lg:py-3 py-2 px-3 lg:ml-6 lg:mr-[94px] mx-4 flex items-center justify-between bg-background-800 dark:bg-darkBackground-100 rounded-2xl mt-4 mb-5">
      <div className="flex items-center gap-6">
        <svg
          onClick={onMenuClick}
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="lg:hidden cursor-pointer"
        >
          <path d="M3 7H21" stroke="#FF7B01" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12H21" stroke="#FF7B01" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 17H21" stroke="#FF7B01" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <TimeDate />
      </div>
      <button
        type="button"
        onClick={toggle}
        className="bg-background-700 dark:bg-background-200/50 p-2 rounded-lg transition-all"
        aria-label="تغییر حالت روشن/تاریک"
      >
        {isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="black"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}
