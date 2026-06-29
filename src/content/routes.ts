import type { NavItem, Route } from "./schema.js";

// Single source of truth for addressable pages (SEO + sitemap). Project detail
// pages are derived from projects.ts, not listed here. Strings preserve the
// site's current SEO copy verbatim.
export const routes: Route[] = [
  {
    id: "home",
    paths: { en: "/", zh: "/zh/" },
    title: { en: "Shihao Cheng", zh: "程世浩" },
    description: {
      en: "Shihao Cheng — Robotics & Controls Engineer. Lead Control Engineer at Shift Robotics. Real-time systems, sensor fusion, and ML for wearable robots.",
      zh: "程世浩 — 机器人与控制工程师，Shift Robotics 首席控制工程师。专注于可穿戴机器人实时系统、传感器融合与机器学习。",
    },
    ogTitle: { en: "Shihao Cheng, Ph.D.", zh: "程世浩 博士" },
    ogDescription: {
      en: "I write the control code that makes wearable robots walk.",
      zh: "我编写控制可穿戴机器人行走的代码。",
    },
    ogImage: "assets/img/profile.jpg",
  },
  {
    id: "projects",
    paths: { en: "/projects/", zh: "/zh/projects/" },
    title: { en: "Projects | Shihao Cheng", zh: "项目 | 程世浩" },
    description: {
      en: "All projects by Shihao Cheng — wearable robotics, real-time control systems, and machine learning for prosthetics, exoskeletons, and robotic footwear.",
      zh: "程世浩的全部项目 —— 可穿戴机器人、实时控制系统，以及面向假肢、外骨骼与机器人鞋履的机器学习研究与工程。",
    },
    ogImage: "assets/img/projects/shiftos_aero.jpg",
  },
];

// Header menu. Anchors point at homepage sections; route targets resolve to the
// matching Route. Order drives display order; the nav builder produces correct
// relative hrefs per page/locale.
export const navItems: NavItem[] = [
  { id: "home", order: 1, label: { en: "Home", zh: "首页" }, target: { kind: "route", routeId: "home" } },
  { id: "about", order: 2, label: { en: "About", zh: "关于" }, target: { kind: "anchor", anchor: "about" } },
  { id: "news", order: 3, label: { en: "News", zh: "动态" }, target: { kind: "anchor", anchor: "news" } },
  { id: "projects", order: 4, label: { en: "Featured Projects", zh: "精选项目" }, target: { kind: "anchor", anchor: "projects" } },
  { id: "step", order: 5, label: { en: "Behind a Step", zh: "步态解析" }, target: { kind: "anchor", anchor: "step-engineering" } },
  { id: "experience", order: 6, label: { en: "Experience", zh: "经历" }, target: { kind: "anchor", anchor: "experience" } },
  { id: "education", order: 7, label: { en: "Education", zh: "教育" }, target: { kind: "anchor", anchor: "education" } },
  { id: "contact", order: 8, label: { en: "Contact", zh: "联系" }, target: { kind: "anchor", anchor: "contact" } },
  { id: "all-projects", order: 9, label: { en: "All Projects", zh: "全部项目" }, target: { kind: "route", routeId: "projects" } },
];

export function routeById(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}
