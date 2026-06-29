import type { LocalizedRichText, LocalizedString } from "./schema.js";

// Shared, non-localized constants.
export const links = {
  linkedin: "https://www.linkedin.com/in/shihao-cheng/",
  linkedinDisplay: "linkedin.com/in/shihao-cheng",
  scholar: "https://scholar.google.com/citations?user=C0T5uN0AAAAJ&hl=en",
  email: "chengsh@umich.edu",
};

// A recognition/stat card target.
export type StatRef =
  | { kind: "project"; slug: string }
  | { kind: "external"; url: string }
  | { kind: "none" };

type Stat = {
  classes: string;
  num: string; // shared token (e.g. "IKEA", "IROS '23")
  ref: StatRef;
  badge?: LocalizedString;
  label: LocalizedString;
};

type Filter = { key: string; label: LocalizedString };

// Header chrome (brand + buttons) — localized, server-rendered so there is no
// flash before site.js re-syncs the toggle labels.
export const chrome = {
  brand: { en: "Shihao Cheng", zh: "程世浩" } as LocalizedString,
  themeBtn: {
    text: { en: "Dark", zh: "深色" } as LocalizedString,
    aria: { en: "Switch to dark mode", zh: "切换暗色模式" } as LocalizedString,
  },
  langBtn: {
    text: { en: "中文", zh: "EN" } as LocalizedString,
    aria: { en: "Switch language", zh: "切换语言" } as LocalizedString,
  },
  menuBtn: {
    text: { en: "Menu", zh: "菜单" } as LocalizedString,
    aria: { en: "Open menu", zh: "打开菜单" } as LocalizedString,
  },
};

export const homeContent = {
  hero: {
    kicker: {
      en: "Wearable Robotics • Controls • ML",
      zh: "可穿戴机器人 • 控制 • 机器学习",
    } as LocalizedString,
    // Full <h1> inner HTML (contains the .nameAccent span).
    name: {
      en: 'Shihao Cheng, <span class="nameAccent">Ph.D.</span>',
      zh: '程世浩 — <span class="nameAccent">博士</span>',
    } as LocalizedRichText,
    rolePrefix: { en: "A ", zh: "一位 " } as LocalizedString,
    lead: {
      en: 'I build real-time control systems for wearable robots — from <a href="projects/shiftos.html">Moonwalkers on warehouse floors</a> to <a href="#projects">intelligent prosthetic legs that adapt to stairs, ramps, and real-world terrain</a>.',
      // The space in "， 到" matches the original page's rendered whitespace
      // (the source wrapped this line); kept for pixel-identical output.
      zh: '我为可穿戴机器人构建实时控制系统——从 <a href="projects/shiftos.html">仓库地面的 Moonwalkers</a>， 到<a href="#projects">能自适应楼梯、坡道与复杂地形的智能假肢</a>。',
    } as LocalizedRichText,
    cta: {
      viewProjects: { en: "View Projects", zh: "查看项目" } as LocalizedString,
      linkedin: { en: "LinkedIn", zh: "领英" } as LocalizedString,
      scholar: { en: "Scholar", zh: "谷歌学术" } as LocalizedString,
    },
    avatarAlt: { en: "Shihao Cheng", zh: "程世浩" } as LocalizedString,
    byline: {
      en: "Robotics PhD @ UMich | Lead Control Engineer @ Shift Robotics",
      zh: "密歇根大学机器人博士 | Shift Robotics 首席控制工程师",
    } as LocalizedString,
    videoAria: {
      en: "ShiftOS Moonwalkers demonstration",
      zh: "ShiftOS Moonwalkers 演示",
    } as LocalizedString,
    videoCaption: {
      en: 'ShiftOS in production · <a href="projects/shiftos.html">See the system →</a>',
      zh: 'ShiftOS 量产系统 · <a href="projects/shiftos.html">查看详情 →</a>',
    } as LocalizedRichText,
    // Hero "cockpit" telemetry panel. Labels are localized + server-rendered;
    // the animated values cycle client-side (site.js initCockpit).
    cockpit: {
      live: { en: "LIVE", zh: "实时" } as LocalizedString,
      title: { en: "Control Telemetry", zh: "控制遥测" } as LocalizedString,
      caption: {
        en: "Illustrative real-time signals from wearable-robot control.",
        zh: "示意性实时信号，来自可穿戴机器人控制系统。",
      } as LocalizedString,
      metrics: {
        gaitPhase: { en: "Gait Phase", zh: "步态相位" } as LocalizedString,
        intent: { en: "Intent", zh: "意图" } as LocalizedString,
        terrain: { en: "Terrain", zh: "地形" } as LocalizedString,
        mode: { en: "Controller", zh: "控制模式" } as LocalizedString,
        latency: { en: "Latency", zh: "延迟" } as LocalizedString,
      },
    },
  },

  recognition: {
    sectionAria: { en: "Career highlights", zh: "职业亮点" } as LocalizedString,
    title: { en: "Deployment & Recognition", zh: "部署与荣誉" } as LocalizedString,
    subtitle: {
      en: "Robotics systems deployed in the real world, with research recognized at top venues.",
      zh: "机器人系统落地真实场景，研究成果获顶级学术认可。",
    } as LocalizedString,
    stats: [
      {
        classes: "stat stat--featured statHero",
        num: "IKEA",
        ref: { kind: "project", slug: "shiftos" },
        badge: { en: "Real-World Deployment", zh: "实地量产部署" },
        label: {
          en: "Moonwalkers deployed across global IKEA warehouses",
          zh: "Moonwalkers 已在全球 IKEA 仓库部署",
        },
      },
      {
        classes: "stat stat--award statHero",
        num: "IROS '23",
        ref: { kind: "project", slug: "tnsre2024" },
        badge: { en: "Top Research Award", zh: "顶级科研奖项" },
        label: {
          en: "Best Student Paper Award · IEEE/RSJ IROS 2023",
          zh: "最佳学生论文奖 · IEEE/RSJ IROS 2023",
        },
      },
      {
        classes: "stat statSupport",
        num: "10+",
        ref: { kind: "external", url: links.scholar },
        label: { en: "Peer-reviewed publications", zh: "同行评审论文" },
      },
      {
        classes: "stat statSupport",
        num: "T-RO '25",
        ref: { kind: "project", slug: "icf" },
        label: {
          en: "First-author · Flagship robotics journal",
          zh: "第一作者 · 旗舰机器人期刊",
        },
      },
      {
        classes: "stat statSupport",
        num: "50+",
        ref: { kind: "none" },
        label: { en: "Journal & Conference Reviews", zh: "期刊与会议审稿" },
      },
    ] as Stat[],
  },

  about: {
    heading: { en: "About", zh: "关于" } as LocalizedString,
    small: { en: "Research → deployment", zh: "研究 → 落地" } as LocalizedString,
    paragraphs: [
      {
        en: "<strong>I make wearable robots less robotic.</strong>",
        zh: '<strong>我让可穿戴机器人不那么"像机器人"。</strong>',
      },
      {
        en: "My work blends control, embedded systems, and machine learning to help robotic devices understand human movement intent in milliseconds. I focus on taking algorithms from simulation to production — where safety, reliability, and real-world messiness matter most.",
        zh: "我的工作融合控制、嵌入式系统与机器学习，帮助机器人设备在毫秒内理解人体运动意图。 我专注于将算法从仿真推向量产——在那里，安全、可靠与真实世界的复杂性才是最终考验。",
      },
      {
        en: "I like building systems that feel simple to the user because the engineering underneath is anything but.",
        zh: "我喜欢构建这样的系统：用户感觉简单，是因为底层工程远不简单。",
      },
    ] as LocalizedRichText[],
  },

  newsSection: {
    heading: { en: "Recent News", zh: "最新动态" } as LocalizedString,
    small: { en: "Latest updates", zh: "近期更新" } as LocalizedString,
    showMore: { en: "Show more", zh: "展开" } as LocalizedString,
  },

  projectsSection: {
    heading: { en: "Featured Projects", zh: "精选项目" } as LocalizedString,
    small: {
      en: "Wearable Robotics • Human-Robot Interaction",
      zh: "可穿戴机器人 • 人机交互",
    } as LocalizedString,
    filterAria: { en: "Filter projects", zh: "筛选项目" } as LocalizedString,
    filters: [
      { key: "all", label: { en: "All", zh: "全部" } },
      { key: "intent", label: { en: "Intent Recognition", zh: "意图识别" } },
      { key: "gait", label: { en: "Gait & Locomotion", zh: "步态与运动" } },
      { key: "ml", label: { en: "Machine Learning", zh: "机器学习" } },
      { key: "estimation", label: { en: "State Estimation", zh: "状态估计" } },
      { key: "software", label: { en: "Software & App", zh: "软件与应用" } },
      { key: "safety", label: { en: "Safety", zh: "安全" } },
    ] as Filter[],
    allProjectsCta: { en: "All Projects →", zh: "全部项目 →" } as LocalizedString,
    caseStudyCta: { en: "Read the case study", zh: "查看案例详情" } as LocalizedString,
  },

  stepEngineering: {
    heading: { en: "The Hidden Engineering in a Step", zh: "步行中的隐藏工程" } as LocalizedString,
    small: {
      en: "Tap a phase to see what the robot thinks.",
      zh: "点击阶段，看机器人如何思考。",
    } as LocalizedString,
    controlLoopAria: {
      en: "Control loop: Sense, Infer, Decide, Act",
      zh: "控制回路：感知、推断、决策、执行",
    } as LocalizedString,
    timelineAria: { en: "Gait phases", zh: "步态阶段" } as LocalizedString,
  },

  journeySection: {
    heading: { en: "Research → Product", zh: "从研究到产品" } as LocalizedString,
    small: {
      en: "From the lab to real-world deployment",
      zh: "从实验室走向真实场景",
    } as LocalizedString,
    researchLabel: { en: "Research", zh: "科研" } as LocalizedString,
    industryLabel: { en: "Industry", zh: "产业" } as LocalizedString,
  },

  experienceSection: {
    heading: { en: "Experience", zh: "经历" } as LocalizedString,
    small: { en: "Selected roles", zh: "精选岗位" } as LocalizedString,
  },

  educationSection: {
    heading: { en: "Education", zh: "教育背景" } as LocalizedString,
    small: { en: "Degrees", zh: "学位" } as LocalizedString,
  },

  contactSection: {
    heading: { en: "Contact", zh: "联系" } as LocalizedString,
    small: { en: "Let's connect", zh: "欢迎交流" } as LocalizedString,
    emailLabel: { en: "Email", zh: "邮箱" } as LocalizedString,
    linkedinLabel: { en: "LinkedIn", zh: "领英" } as LocalizedString,
  },

  footerName: { en: "Shihao Cheng", zh: "程世浩" } as LocalizedString,
};

// Projects listing page (projects/index.html) UI strings.
export const projectsPage = {
  heading: { en: "All Projects", zh: "全部项目" } as LocalizedString,
  small: { en: "Industry + Research", zh: "量产系统 + 科研工作" } as LocalizedString,
  backText: { en: "Back to ", zh: "返回 " } as LocalizedString,
  homeLabel: { en: "Home", zh: "首页" } as LocalizedString,
};
