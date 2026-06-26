"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS: ReadonlyArray<readonly [maxWidth: number, fontSize: number]> = [
  [640, 8],
  [768, 9],
  [1024, 10],
  [1280, 11],
];
const DEFAULT_FONT_SIZE = 12;

/** Smaller screens get smaller chart axis/label text. */
export function useResponsiveChartFontSize(): number {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      const match = BREAKPOINTS.find(([maxWidth]) => width < maxWidth);
      setFontSize(match ? match[1] : DEFAULT_FONT_SIZE);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return fontSize;
}
