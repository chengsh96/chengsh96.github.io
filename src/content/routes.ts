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
      en: "Shihao Cheng — Robotics Ph.D. and Lead Control Engineer at Shift Robotics, building real-time control, sensing, and ML systems for wearable robots, robotic footwear, and powered prostheses.",
      zh: "程世浩 — 机器人学博士，Shift Robotics 首席控制工程师，专注于可穿戴机器人、机器人鞋与动力假肢的实时控制、传感与机器学习系统。",
    },
    ogTitle: { en: "Shihao Cheng, Ph.D.", zh: "程世浩 博士" },
    ogDescription: {
      en: "Real-time control and sensing systems for wearable robots, from powered prostheses research to Moonwalkers robotic footwear.",
      zh: "面向可穿戴机器人的实时控制与传感系统，从动力假肢研究到 Moonwalkers 轮式机器人鞋。",
    },
    ogImage: "assets/img/profile.jpg",
  },
  {
    id: "projects",
    paths: { en: "/projects/", zh: "/zh/projects/" },
    title: { en: "Projects | Shihao Cheng", zh: "项目 | 程世浩" },
    description: {
      en: "All projects by Shihao Cheng — wearable robotics, real-time control systems, and machine learning for prosthetics, exoskeletons, and robotic footwear.",
      zh: "程世浩的全部项目 —— 可穿戴机器人、实时控制系统，以及面向假肢、外骨骼与机器人鞋的机器学习研究与工程。",
    },
    ogImage: "assets/img/projects/shiftos_aero.jpg",
  },
];

// Header menu. Anchors point at homepage sections; route targets resolve to the
// matching Route. Order drives display order; the nav builder produces correct
// relative hrefs per page/locale.
export const navItems: NavItem[] = [
  { id: "intro", order: 2, label: { en: "Highlights", zh: "亮点" }, target: { kind: "anchor", anchor: "intro" } },
  { id: "about", order: 3, label: { en: "About", zh: "关于" }, target: { kind: "anchor", anchor: "about" } },
  { id: "projects", order: 4, label: { en: "Selected Work", zh: "精选工作" }, target: { kind: "anchor", anchor: "projects" } },
  { id: "experience", order: 5, label: { en: "Experience", zh: "经历" }, target: { kind: "anchor", anchor: "experience" } },
  { id: "step", order: 6, label: { en: "Hidden Engineering", zh: "隐藏工程" }, target: { kind: "anchor", anchor: "step-engineering" } },
  { id: "news", order: 7, label: { en: "Updates", zh: "动态" }, target: { kind: "anchor", anchor: "news" } },
  { id: "education", order: 8, label: { en: "Education & Awards", zh: "教育与奖项" }, target: { kind: "anchor", anchor: "education" } },
  { id: "contact", order: 9, label: { en: "Contact", zh: "联系" }, target: { kind: "anchor", anchor: "contact" } },
  { id: "all-projects", order: 10, label: { en: "All Projects", zh: "全部项目" }, target: { kind: "route", routeId: "projects" } },
];

export function routeById(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}
