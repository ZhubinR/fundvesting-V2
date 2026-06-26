"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  function toggle() {
    const next = !isDarkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setIsDarkMode(next);
  }

  return { isDarkMode, toggle };
}
