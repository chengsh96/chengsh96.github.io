import type { JourneyItem } from "./schema.js";

// Research-to-product timeline: Purdue → UMich → Prosthesis Control → IROS
// Award → Shift Robotics → IKEA Deployment. Oldest first (left to right).
export const journey: JourneyItem[] = [
  {
    id: "purdue",
    year: "2018",
    kind: "research",
    title: { en: "B.S. Mechanical Engineering", zh: "机械工程学士" },
    org: { en: "Purdue University", zh: "普渡大学" },
    detail: {
      en: "Graduated with Distinction — foundations in dynamics and controls.",
      zh: "以 Distinction 荣誉毕业，奠定动力学与控制基础。",
    },
  },
  {
    id: "umich",
    year: "2019",
    kind: "research",
    title: { en: "Ph.D. Robotics", zh: "机器人学博士" },
    org: { en: "University of Michigan", zh: "密歇根大学" },
    detail: {
      en: "Joined LocoLab to research control for wearable robots.",
      zh: "加入 LocoLab，研究可穿戴机器人控制。",
    },
  },
  {
    id: "prosthesis",
    year: "2020–2024",
    kind: "research",
    title: { en: "Powered Prosthesis Control", zh: "动力假肢控制" },
    org: { en: "Knee-ankle prostheses", zh: "膝踝假肢" },
    detail: {
      en: "Continuous, interpretable control across activities and transitions.",
      zh: "面向多活动与连续转换的可解释控制。",
    },
  },
  {
    id: "iros",
    year: "2023",
    kind: "research",
    title: { en: "IROS Best Student Paper", zh: "IROS 最佳学生论文奖" },
    org: { en: "IEEE/RSJ IROS 2023", zh: "IEEE/RSJ IROS 2023" },
    detail: {
      en: "Recognized for continuous transition control of powered prostheses.",
      zh: "凭借动力假肢连续转换控制研究获奖。",
    },
  },
  {
    id: "shift",
    year: "2024",
    kind: "industry",
    title: { en: "Lead Control Engineer", zh: "首席控制工程师" },
    org: { en: "Shift Robotics", zh: "Shift Robotics" },
    detail: {
      en: "Leading control & sensing for Moonwalkers robotic footwear.",
      zh: "主导 Moonwalkers 机器人鞋的控制与传感。",
    },
  },
  {
    id: "ikea",
    year: "2026",
    kind: "industry",
    title: { en: "IKEA Deployment", zh: "IKEA 部署落地" },
    org: { en: "Moonwalkers Aero", zh: "Moonwalkers Aero" },
    detail: {
      en: "Moonwalkers deployed across global IKEA warehouses.",
      zh: "Moonwalkers 在全球 IKEA 仓库部署。",
    },
  },
];
