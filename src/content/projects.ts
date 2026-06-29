import type { Project } from "./schema.js";

// Single shared project list (no separate EN/ZH arrays). `slug` = existing
// filename stem so output URLs are preserved. Card fields are typed; the detail
// page body is a verbatim bilingual snapshot in src/content/detail/<slug>.<locale>.html
// (see ProjectDetail in schema.ts). `detail.seo` drives the detail <head>.
//
// NOTE: a few card strings already differ between EN and ZH, and between the
// homepage and listing, in the live site (e.g. RA-L 2024 highlights, the icf
// title, several ZH summaries). They are preserved verbatim via per-language and
// listTitle/listSummary overrides; reconcile later if desired.
export const projects: Project[] = [
  {
    id: "shiftos",
    slug: "shiftos",
    listOrder: 1,
    featuredOrder: 1,
    category: { en: "Industry", zh: "量产" },
    tags: ["gait", "estimation", "intent", "software"],
    image: "assets/img/projects/shiftos_aero.jpg",
    imageDims: { w: 760, h: 500 },
    alt: { en: "shiftos_aero", zh: "shiftos_aero" },
    title: { en: "Moonwalkers Control System (ShiftOS)", zh: "Moonwalkers 控制系统（ShiftOS）" },
    outcome: {
      en: "Moonwalkers deployed across global IKEA warehouses",
      zh: "Moonwalkers 已在全球 IKEA 仓库部署",
    },
    summary: {
      en: "Real-time locomotion control + embedded deployment for wearable robotic footwear.",
      zh: "为可穿戴动力鞋打造实时运动控制系统，并完成嵌入式量产部署。",
    },
    listSummary: {
      en: "Real-time locomotion control + embedded deployment for wearable robotic footwear.",
      zh: "面向可穿戴动力鞋的实时运动控制系统，并完成嵌入式量产部署。",
    },
    highlights: [
      { en: "Balance-aware behaviors for uneven terrain", zh: "平衡感知控制与不平路面稳定性" },
      { en: "Low-latency transitions and safety constraints", zh: "低延迟状态切换与安全约束" },
      { en: "RTOS integration and reliability hardening", zh: "RTOS 集成与可靠性加固" },
    ],
    detail: {
      seo: {
        title: { en: "ShiftOS | Shihao Cheng", zh: "ShiftOS | 程世浩" },
        description: {
          en: "ShiftOS: the production control system for Shift Robotics' Moonwalkers robotic shoes — gait control, intent recognition, terrain adaptation, and embedded deployment across global IKEA warehouses.",
          zh: "ShiftOS：Shift Robotics Moonwalkers 机器人鞋的生产级控制系统，涵盖步态控制、意图识别、地形自适应与嵌入式部署，已在全球 IKEA 仓库量产落地。",
        },
      },
      ogImage: "assets/img/projects/shiftos_orig.jpg",
    },
  },
  {
    id: "tbme2024",
    slug: "tbme2024",
    listOrder: 2,
    featuredOrder: 2,
    category: { en: "Research", zh: "科研" },
    tags: ["safety", "estimation"],
    image: "assets/img/projects/tbme2024_concept.jpg",
    imageDims: { w: 2539, h: 1791 },
    alt: { en: "tbme2024_concept", zh: "tbme2024" },
    title: { en: "Safety-Critical Stub Avoidance (TBME 2024)", zh: "安全关键绊脚规避（TBME 2024）" },
    outcome: { en: "Published in IEEE TBME 2024", zh: "发表于 IEEE TBME 2024" },
    summary: {
      en: "Real-time prediction + minimum-jerk trajectory reshaping to avoid obstacle contact.",
      zh: "基于实时预测与最小跃度轨迹重塑，实现对障碍接触的安全规避。",
    },
    listSummary: {
      en: "Real-time prediction + minimum-jerk trajectory reshaping to avoid obstacle contact.",
      zh: "基于实时预测与最小跃度轨迹重塑，实现对障碍物接触的主动规避。",
    },
    highlights: [
      { en: "Safety intervention compatible with continuous control", zh: "与连续控制兼容的安全干预" },
      { en: "Multi-sensor inputs (kinematics + ranging)", zh: "多传感器输入（运动学 + 距离）" },
    ],
    detail: {
      seo: {
        title: { en: "Stub Avoidance (TBME 2024) | Shihao Cheng", zh: "绊脚规避（TBME 2024） | 程世浩" },
        description: {
          en: "Reactive safety layer for powered prosthetic legs that predicts and prevents toe stubbing on stairs and obstacles using minimum-jerk trajectory corrections, reducing stub risk from 49% to 5%. IEEE TBME 2024.",
          zh: "动力假肢在楼梯与障碍物行走中的趾部碰撞预测与主动规避，采用最小加加速度轨迹修正将碰撞风险从 49% 降至 5%。IEEE TBME 2024。",
        },
      },
      ogImage: "assets/img/projects/tbme2024_exp_demo.jpg",
    },
  },
  {
    id: "tnsre2024",
    slug: "tnsre2024",
    listOrder: 3,
    featuredOrder: 3,
    category: { en: "Research", zh: "科研" },
    tags: ["gait"],
    image: "assets/img/projects/tnsre2024_exp.jpg",
    imageDims: { w: 1023, h: 760 },
    alt: { en: "tnsre2024_exp", zh: "tnsre2024_exp" },
    title: { en: "Continuous Transition Control (TNSRE 2024)", zh: "连续转换控制（TNSRE 2024）" },
    outcome: { en: "IROS 2023 Best Student Paper Award", zh: "IROS 2023 最佳学生论文奖" },
    summary: {
      en: "Continuous trajectories for walk↔stairs transitions, robust to timing errors.",
      zh: "在平地与楼梯之间生成连续轨迹，对意图延迟与时序误差更鲁棒。",
    },
    listSummary: {
      en: "Continuous trajectories for walk↔stairs transitions, robust to timing errors.",
      zh: "实现步行与上下楼梯之间的连续轨迹控制，对时序误差具有良好鲁棒性。",
    },
    highlights: [
      { en: "Phase-aligned reference generation", zh: "相位对齐的参考轨迹生成" },
      { en: "Robust across inter-leg transition cases", zh: "覆盖多种跨腿转换场景" },
    ],
    detail: {
      seo: {
        title: {
          en: "Continuous Transition Control (TNSRE 2024) | Shihao Cheng",
          zh: "连续转换控制（TNSRE 2024） | 程世浩",
        },
        description: {
          en: "Continuous phase-based control for smooth transitions between level walking and stair ascent/descent in powered knee-ankle prostheses — IROS 2023 Best Student Paper Award winner. IEEE TNSRE 2024.",
          zh: "动力膝踝假肢平地行走与楼梯升降之间的连续相位过渡控制，荣获 IROS 2023 最佳学生论文奖。IEEE TNSRE 2024。",
        },
      },
      ogImage: "assets/img/projects/iros_best.jpg",
    },
  },
  {
    id: "ral2024",
    slug: "ral2024",
    listOrder: 7,
    featuredOrder: 4,
    category: { en: "Research", zh: "科研" },
    tags: ["intent", "ml"],
    image: "assets/img/projects/ral2024_concept.jpg",
    imageDims: { w: 1379, h: 1254 },
    alt: { en: "ral2024_concept", zh: "ral2024_concept" },
    title: { en: "Transfer Learning for Intent (RA-L 2024)", zh: "迁移学习意图预测（RA-L 2024）" },
    listTitle: { en: "Transfer Learning for Intent (RA-L 2024)", zh: "意图识别的迁移学习方法（RA-L 2024）" },
    outcome: { en: "Published in IEEE RA-L 2024", zh: "发表于 IEEE RA-L 2024" },
    summary: {
      en: "Low-data adaptation for intent prediction across users with practical dataset constraints.",
      zh: "在数据受限条件下，实现对新用户的快速意图适配与泛化。",
    },
    listSummary: {
      en: "Low-data adaptation and cross-user generalization for intent prediction.",
      zh: "在低样本条件下实现跨用户意图预测的自适应与泛化。",
    },
    // NOTE: EN and ZH highlights below already differ in meaning on the live
    // site; preserved verbatim per language.
    highlights: [
      { en: "Cross-user generalization", zh: "预训练 + 微调策略" },
      { en: "Reduced subject-specific data requirements", zh: "跨用户泛化与传感器分析" },
    ],
    detail: {
      seo: {
        title: { en: "RA-L 2024 | Shihao Cheng", zh: "RA-L 2024 | 程世浩" },
        description: {
          en: "Transfer learning pipeline for locomotion intent prediction in powered prostheses: fine-tuning pre-trained CNNs with minimal data from new transfemoral amputee users. IEEE RA-L 2024.",
          zh: "基于迁移学习的假肢步态意图预测方法，利用少量新用户数据微调预训练 CNN 模型，提升临床部署效率。IEEE RA-L 2024。",
        },
      },
      ogImage: "assets/img/projects/ral2024_concept.jpg",
    },
  },
  {
    id: "icf",
    slug: "icf",
    listOrder: 6,
    featuredOrder: 5,
    category: { en: "Research", zh: "科研" },
    tags: ["intent", "ml"],
    image: "assets/img/projects/icf_concept.jpg",
    imageDims: { w: 4000, h: 2250 },
    alt: {
      en: "ICF-based intent recognition concept",
      zh: "基于 ICF 的意图识别概念图",
    },
    title: { en: "Ambilateral Activity Recognition (TRO 2025)", zh: "双侧活动识别（TRO 2025）" },
    listTitle: { en: "Automatic Activity Recognition (TRO 2025)", zh: "自动活动识别（TRO 2025）" },
    outcome: {
      en: "IEEE Transactions on Robotics · TNSRE 2021",
      zh: "IEEE Transactions on Robotics · TNSRE 2021",
    },
    summary: {
      en: "Interpretable ICF-based intent recognition for powered prostheses, extended to bilateral sensing for continuous adaptation across locomotion modes.",
      zh: "面向动力假肢的可解释 ICF 意图识别框架，扩展至双侧传感，支持多活动模式的持续自适应控制。",
    },
    listSummary: {
      en: "Interpretable features + robust transition logic across activities.",
      zh: "基于可解释特征与鲁棒状态转换逻辑，实现多活动识别与切换。",
    },
    highlights: [
      {
        en: "Biomechanically interpretable features — no black-box embeddings",
        zh: "生物力学可解释特征，无黑箱嵌入",
      },
      {
        en: "Real-time classifier (<5 ms), ambilateral gait estimation",
        zh: "实时分类（<5 ms），双侧步态估计",
      },
    ],
    detail: {
      seo: {
        title: { en: "ICF-Based Intent Recognition | Shihao Cheng", zh: "基于 ICF 的意图识别 | 程世浩" },
        description: {
          en: "Instantaneous Characteristic Features (ICFs) from thigh kinematics enable fast, reliable, and explainable activity recognition and continuous adaptation for powered prosthesis control. IEEE Transactions on Robotics 2025.",
          zh: "基于大腿运动学的瞬时特征（ICF）实现动力假肢的快速、可靠且可解释的活动意图识别与连续自适应控制。IEEE Transactions on Robotics 2025。",
        },
      },
      ogImage: "assets/img/projects/icf_concept.jpg",
    },
  },
  {
    id: "embc2025",
    slug: "embc2025",
    listOrder: 8,
    featuredOrder: 6,
    category: { en: "Research", zh: "科研" },
    tags: ["software", "intent"],
    image: "assets/img/projects/embc2025_watch.jpg",
    imageDims: { w: 1017, h: 750 },
    alt: {
      en: "Smartwatch interface for prosthesis mode switching",
      zh: "用于假肢模式切换的智能手表界面",
    },
    title: { en: "Smartwatch Gesture Control (EMBC 2025)", zh: "智能手表手势控制（EMBC 2025）" },
    outcome: { en: "Published in IEEE EMBC 2025", zh: "发表于 IEEE EMBC 2025" },
    summary: {
      en: "Smartwatch-based human–robot interface for explicit mode control of a powered knee-ankle prosthesis with vibrotactile feedback.",
      zh: "基于智能手表的人机交互接口，通过手势指令与振动触觉反馈实现动力假肢的显式模式切换。",
    },
    listSummary: {
      en: "Gesture interface with low-latency comms and feedback for mode switching.",
      zh: "基于低延迟通信与反馈的手势交互，用于系统模式切换。",
    },
    highlights: [
      { en: "Swipe gestures mapped to four locomotion modes", zh: "四种步行模式映射至滑动手势" },
      {
        en: "Vibrotactile + visual confirmation, TCP comms to prosthesis",
        zh: "振动触觉确认反馈，TCP 通信连接假肢控制器",
      },
    ],
    detail: {
      seo: {
        title: { en: "EMBC 2025 | Shihao Cheng", zh: "EMBC 2025 | 程世浩" },
        description: {
          en: "Smartwatch gesture interface and vibrotactile feedback for powered knee-ankle prosthesis control, enabling intuitive locomotion mode transitions in real-world use. IEEE EMBC 2025.",
          zh: "基于智能手表手势与振触觉反馈的动力膝踝假肢人机交互接口，支持真实环境下直觉式步态模式切换。IEEE EMBC 2025。",
        },
      },
      ogImage: "assets/img/projects/embc2025_watch.jpg",
    },
  },

  // --- Non-featured projects (listing only; not on the homepage grid) ---
  {
    id: "tnsre2026",
    slug: "tnsre2026",
    listOrder: 4,
    category: { en: "Research", zh: "科研" },
    tags: ["gait"],
    image: "assets/img/projects/tnsre-gagraphic-3683020.jpg",
    imageDims: { w: 660, h: 295 },
    alt: { en: "tnsre2026_gagraphic", zh: "tnsre2026_gagraphic" },
    title: { en: "Continuous Impedance Transition (TNSRE 2026)", zh: "连续阻抗过渡控制（TNSRE 2026）" },
    summary: {
      en: "Continuous impedance blending across stance for walk–stair prosthesis transitions.",
      zh: "在站立相内连续混合阻抗，实现步行–楼梯假肢过渡的平滑控制。",
    },
    highlights: [],
    detail: {
      seo: {
        title: {
          en: "Continuous Impedance Transition (TNSRE 2026) | Shihao Cheng",
          zh: "连续阻抗过渡控制（TNSRE 2026）| 程世浩",
        },
        description: {
          en: "Continuous impedance blending during walk-stair transitions for powered prosthetic legs, extending phase-based control from swing kinematics to stance-phase torque and compliance. IEEE TNSRE 2026.",
          zh: "步行–楼梯过渡中的连续阻抗混合控制，将相位控制从摆动相运动学延伸至支撑相力矩与柔顺性。IEEE TNSRE 2026。",
        },
      },
      ogImage: "assets/img/projects/tnsre-gagraphic-3683020.jpg",
    },
  },
  {
    id: "tmrb2022",
    slug: "tmrb2022",
    listOrder: 5,
    category: { en: "Research", zh: "科研" },
    tags: ["gait"],
    image: "assets/img/projects/tmrb2022_concept.jpg",
    imageDims: { w: 2750, h: 1230 },
    alt: { en: "tmrb2022_concept", zh: "tmrb2022_concept" },
    title: { en: "Transitional Kinematics Model (TMRB 2022)", zh: "过渡运动学模型（TMRB 2022）" },
    summary: {
      en: "Unified kinematic modeling of walking/stairs and their transitions.",
      zh: "统一建模步行与楼梯运动及其过渡过程的运动学表示。",
    },
    highlights: [],
    detail: {
      seo: {
        title: {
          en: "Transitional Kinematics Model (TMRB 2022) | Shihao Cheng",
          zh: "过渡运动学模型（TMRB 2022） | 程世浩",
        },
        description: {
          en: "Unified continuous gait framework modeling leg kinematics as convex combinations of steady-state behaviors, enabling smooth activity transitions without discrete mode switching. IEEE TMRB 2022.",
          zh: "将稳态运动学组合为凸组合的统一连续步态框架，实现无离散模式切换的多活动平滑过渡。IEEE TMRB 2022。",
        },
      },
      ogImage: "assets/img/projects/tmrb2022_concept.jpg",
    },
  },
  {
    id: "iros2023",
    slug: "iros2023",
    listOrder: 9,
    category: { en: "Research", zh: "科研" },
    tags: ["gait"],
    image: "assets/img/projects/iros2023_exp.jpg",
    imageDims: { w: 2062, h: 550 },
    alt: { en: "iros2023_exp", zh: "iros2023_exp" },
    title: { en: "Amputee Endurance Study (IROS 2023)", zh: "截肢用户耐力实验研究（IROS 2023）" },
    summary: {
      en: "Controller robustness evaluation under fatigue and endurance constraints.",
      zh: "在疲劳与耐力约束下评估控制器的长期鲁棒性。",
    },
    highlights: [],
    detail: {
      seo: {
        title: { en: "IROS 2023 | Shihao Cheng", zh: "IROS 2023 | 程世浩" },
        description: {
          en: "Continuous phase-based mid-level control doubles powered prosthesis user endurance over demanding daily activities — a benefit invisible to traditional timed metrics. IEEE/RSJ IROS 2023.",
          zh: "连续相位控制使动力膝踝假肢在日常多活动中的耐力倍增，传统计时指标难以反映这一优势。IEEE/RSJ IROS 2023。",
        },
      },
      ogImage: "assets/img/projects/iros2023_exp.jpg",
    },
  },
  {
    id: "sim2real",
    slug: "sim2real",
    listOrder: 10,
    category: { en: "Research", zh: "科研" },
    tags: ["ml", "estimation"],
    image: "assets/img/projects/placeholder.svg",
    imageDims: { w: 1600, h: 900 },
    alt: { en: "placeholder", zh: "placeholder" },
    title: { en: "Sim-to-Real Impedance Personalization", zh: "仿真到现实的阻抗个性化" },
    summary: {
      en: "MuJoCo digital twin + RL workflow for safe personalization.",
      zh: "结合 MuJoCo 数字孪生与强化学习，实现安全的个性化控制参数优化。",
    },
    highlights: [],
    detail: {
      seo: {
        title: { en: "Sim-to-Real Personalization | Shihao Cheng", zh: "仿真到现实的个性化控制 | 程世浩" },
        description: {
          en: "Sim-to-real personalization for wearable robot impedance control using digital twins and learning-based methods to adapt controllers safely without increasing risk to real users.",
          zh: "利用数字孪生与学习方法实现可穿戴机器人阻抗控制的仿真到现实个性化，在不增加真实用户风险的前提下提升控制适配性。",
        },
      },
      ogImage: "assets/img/projects/placeholder.svg",
    },
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects(): Project[] {
  return projects
    .filter((p) => p.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export function listedProjects(): Project[] {
  return [...projects].sort((a, b) => a.listOrder - b.listOrder);
}
