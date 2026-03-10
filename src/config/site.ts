import { USER } from "@/features/portfolio/data/user"
import type { NavItem } from "@/types/nav"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://chanhdai.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Resume",
    href: "/resume",
  },
]

export const X_USERNAME = "@theshipar"
export const GITHUB_USERNAME = "theshipar"
export const SOURCE_CODE_GITHUB_REPO = "theShipar/theShiparV2"
export const SOURCE_CODE_GITHUB_URL = "https://github.com/theShipar/theShiparV2"

export const UTM_PARAMS = {
  utm_source: "theshipar.com",
}
