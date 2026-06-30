import type { NewsItem } from "./schema.js";

// Extracted verbatim from the homepage news timeline (EN: index.html,
// ZH: zh/index.html). Order = newest first, as displayed.
export const news: NewsItem[] = [
  {
    id: "moonwalkers-aero-ikea",
    tag: "launch",
    tagLabel: { en: "🚀 Launch", zh: "🚀 发布" },
    date: { en: "April 2026", zh: "2026年4月" },
    text: {
      en: "Moonwalkers Aero, powered in part by my sensing and control work, is being deployed across IKEA warehouses.",
      zh: "由我参与传感与控制工作的 Moonwalkers Aero，已在全球 IKEA 仓库部署。",
    },
  },
  {
    id: "mocap-lab",
    tag: "milestone",
    tagLabel: { en: "🎓 Milestone", zh: "🎓 里程碑" },
    date: { en: "Sep 2025", zh: "2025年9月" },
    text: {
      en: "Built a 20-camera motion-capture and Bertec treadmill lab, now leading control and sensing development using the facility.",
      zh: "参与搭建 20 摄像头动捕与 Bertec 跑台实验室，并基于该平台主导控制与传感方向的研发与验证。",
    },
  },
  {
    id: "lead-control-engineer",
    tag: "milestone",
    tagLabel: { en: "🎓 Milestone", zh: "🎓 里程碑" },
    date: { en: "May 2025", zh: "2025年5月" },
    text: {
      en: "Appointed Lead Control Engineer at Shift Robotics, leading control and sensing for Moonwalkers' wheeled robotic footwear platform.",
      zh: "任命为 Shift Robotics 首席控制工程师，负责 Moonwalkers 轮式机器人鞋平台的控制与感知系统开发。",
    },
  },
  {
    id: "tro-publication",
    tag: "publication",
    tagLabel: { en: "📄 Publication", zh: "📄 论文" },
    date: { en: "Jan 2025", zh: "2025年1月" },
    text: {
      en: 'Paper "Ambilateral Activity Recognition and Continuous Adaptation With a Powered Knee-Ankle Prosthesis" published in <em>IEEE Transactions on Robotics</em>.',
      zh: '论文 "Ambilateral Activity Recognition and Continuous Adaptation With a Powered Knee-Ankle Prosthesis" 发表于 <em>IEEE Transactions on Robotics</em>。',
    },
  },
  {
    id: "phd-defense",
    tag: "milestone",
    tagLabel: { en: "🎓 Milestone", zh: "🎓 里程碑" },
    date: { en: "Jun 2024", zh: "2024年6月" },
    text: {
      en: 'Successfully defended Ph.D. dissertation: "Controlling a Powered Knee-Ankle Prosthesis During Continuous and Automatic Transitions Between Activities."',
      zh: "完成博士论文答辩：《动力膝踝假肢在连续与自动活动转换中的控制方法》。",
    },
  },
  {
    id: "iros-best-paper",
    tag: "award",
    tagLabel: { en: "🏆 Award", zh: "🏆 奖项" },
    date: { en: "Oct 2023", zh: "2023年10月" },
    text: {
      en: "Received the <strong>IROS 2023 Best Student Paper Award</strong> for work on continuous transition control of powered prostheses.",
      zh: "因动力假肢连续转换控制研究获得 <strong>IROS 2023 最佳学生论文奖</strong>。",
    },
  },
  {
    id: "rackham-fellowship",
    tag: "award",
    tagLabel: { en: "🏆 Award", zh: "🏆 奖项" },
    date: { en: "Apr 2023", zh: "2023年4月" },
    text: {
      en: "Awarded the Rackham Pre-Doctoral Fellowship, University of Michigan.",
      zh: "获得密歇根大学 Rackham 预博士奖学金。",
    },
  },
  {
    id: "ms-degrees",
    tag: "milestone",
    tagLabel: { en: "🎓 Milestone", zh: "🎓 里程碑" },
    date: { en: "May 2021", zh: "2021年5月" },
    text: {
      en: "Earned dual M.S. degrees in Mechanical Engineering and Robotics from the University of Michigan.",
      zh: "获得密歇根大学机械工程与机器人双硕士学位。",
    },
  },
  {
    id: "malott-award",
    tag: "award",
    tagLabel: { en: "🏆 Award", zh: "🏆 奖项" },
    date: { en: "Dec 2018", zh: "2018年12月" },
    text: {
      en: "Senior Design project received the Malott Innovation Award, Purdue University.",
      zh: "普渡大学 Senior Design 项目获得 Malott Innovation Award。",
    },
  },
  {
    id: "purdue-bs",
    tag: "milestone",
    tagLabel: { en: "🎓 Milestone", zh: "🎓 里程碑" },
    date: { en: "Dec 2018", zh: "2018年12月" },
    text: {
      en: "Graduated from Purdue University with a B.S. in Mechanical Engineering <em>with Distinction</em>, with minors in Mathematics and Economics.",
      zh: "以 Distinction 荣誉获得普渡大学机械工程学士学位，辅修数学与经济学。",
    },
  },
];
