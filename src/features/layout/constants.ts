import type { ComponentType } from "react";
import { AboutIcon, BarChartIcon, CompareIcon, FundsIcon, HomeIcon, NewsIcon } from "@/shared/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  /** Shorter label for the narrow mobile sidebar; falls back to `label`. */
  mobileLabel?: string;
  icon: ComponentType<{ color?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "خانه", icon: HomeIcon },
  { href: "/fundRavand", label: "صفحه روند صندوق", mobileLabel: "روند صندوق", icon: FundsIcon },
  { href: "/fundBar", label: "صفحه جامع صندوق", mobileLabel: "جامع صندوق", icon: BarChartIcon },
  { href: "/compare", label: "مقایسه", icon: CompareIcon },
  { href: "/news", label: "اخبار و تحلیل ها", icon: NewsIcon },
  { href: "/about", label: "درباره ما", icon: AboutIcon },
];
