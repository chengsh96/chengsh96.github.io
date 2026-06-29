import type { ExperienceOrg } from "./schema.js";

// `dates` includes its exact leading spacing/punctuation so the rendered
// "<strong>{role}</strong>{dates}" line matches the original markup
// (EN uses " (…)", ZH uses full-width "（…）").
export const experience: ExperienceOrg[] = [
  {
    id: "shift-robotics",
    org: { en: "Shift Robotics", zh: "Shift Robotics" },
    roles: [
      {
        id: "lead-control-engineer",
        role: { en: "Lead Control Engineer", zh: "首席控制工程师" },
        dates: { en: " (2025–Present)", zh: "（2025–至今）" },
        bullets: [
          {
            en: "Balance-aware control improving stability on uneven terrain",
            zh: "面向不平地形的平衡感知控制，提升行走稳定性",
          },
          {
            en: "Hybrid walking modes with seamless and low-latency transitions",
            zh: "低延迟、无缝切换的混合行走模式设计",
          },
          {
            en: "Motion-capture lab + dataset pipeline for learning-based control",
            zh: "运动捕捉实验室与数据集流水线，用于学习型控制",
          },
        ],
      },
      {
        id: "gait-control-engineer",
        role: { en: "Gait Control Engineer", zh: "步态控制工程师" },
        dates: { en: " (2024–2025)", zh: "（2024–2025）" },
        bullets: [
          {
            en: "ShiftOS 3.0 / 3.1 firmware and embedded deployment",
            zh: "ShiftOS 3.0 / 3.1 固件开发与嵌入式系统部署",
          },
          {
            en: "EKF-based terrain estimation and low-latency user-intent recognition",
            zh: "基于 EKF 的地形估计与低延迟用户意图识别",
          },
        ],
      },
    ],
  },
  {
    id: "umich",
    org: { en: "University of Michigan", zh: "密歇根大学" },
    roles: [
      {
        id: "phd-researcher",
        role: { en: "Ph.D. Researcher", zh: "博士研究员" },
        dates: { en: " (2019–2024)", zh: "（2019–2024）" },
        bullets: [
          {
            en: "Multi-activity prosthesis control and activity transitions",
            zh: "多活动假肢控制与行走模式切换",
          },
          {
            en: "Interpretable ML-based intent recognition and cross-user adaptation",
            zh: "基于可解释机器学习的意图识别与跨用户自适应",
          },
          {
            en: "Environmental sensing for safety interventions for obstacle avoidance",
            zh: "面向障碍规避的环境感知与安全干预机制",
          },
          {
            en: "MuJoCo digital twin modeling + sim-to-real personalization",
            zh: "MuJoCo 数字孪生建模与仿真到现实个性化",
          },
        ],
      },
    ],
  },
];
