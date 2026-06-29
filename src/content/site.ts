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
    text: { en: "中文", zh: "English" } as LocalizedString,
    aria: { en: "Switch to Chinese", zh: "Switch to English" } as LocalizedString,
  },
  menuBtn: {
    text: { en: "Menu", zh: "菜单" } as LocalizedString,
    aria: { en: "Open menu", zh: "打开菜单" } as LocalizedString,
  },
};

export const homeContent = {
  sectionNav: {
    aria: { en: "Homepage section navigation", zh: "首页章节导航" } as LocalizedString,
    summary: {
      en: "Wearable robotics portfolio",
      zh: "可穿戴机器人作品集",
    } as LocalizedString,
    items: [
      { anchor: "intro", label: { en: "Intro", zh: "介绍" } },
      { anchor: "snapshot", label: { en: "Snapshot", zh: "速览" } },
      { anchor: "about", label: { en: "About", zh: "关于" } },
      { anchor: "projects", label: { en: "Work & Publications", zh: "工作与论文" } },
      { anchor: "experience", label: { en: "Experience", zh: "经历" } },
      { anchor: "step-engineering", label: { en: "Step", zh: "步态" } },
      { anchor: "news", label: { en: "Updates", zh: "动态" } },
      { anchor: "education", label: { en: "Education", zh: "教育" } },
      { anchor: "contact", label: { en: "Contact", zh: "联系" } },
    ],
  },

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
      en: 'I build real-time control and sensing systems for wearable robots, from powered prostheses research to <a href="projects/shiftos.html">robotic footwear products used in the real world</a>.',
      zh: '我为可穿戴机器人构建实时控制与传感系统，从动力假肢研究到<a href="projects/shiftos.html">真实场景中使用的机器人鞋履产品</a>。',
    } as LocalizedRichText,
    cta: {
      viewProjects: { en: "View Work", zh: "查看工作" } as LocalizedString,
      linkedin: { en: "Contact", zh: "联系" } as LocalizedString,
      scholar: { en: "Google Scholar", zh: "谷歌学术" } as LocalizedString,
    },
    avatarAlt: { en: "Shihao Cheng", zh: "程世浩" } as LocalizedString,
    byline: {
      en: "Robotics Ph.D. building control systems for human movement",
      zh: "机器人学博士，构建面向人体运动的控制系统",
    } as LocalizedString,
    videoAria: {
      en: "ShiftOS Moonwalkers demonstration",
      zh: "ShiftOS Moonwalkers 演示",
    } as LocalizedString,
    videoCaption: {
      en: 'Robotic footwear in real-world walking environments · <a href="projects/shiftos.html">See the system →</a>',
      zh: '真实步行环境中的机器人鞋履 · <a href="projects/shiftos.html">查看系统 →</a>',
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
    title: { en: "Selected Highlights", zh: "精选亮点" } as LocalizedString,
    subtitle: {
      en: "Training, current role, deployed product work, and research recognition.",
      zh: "训练背景、当前角色、产品落地工作与科研认可。",
    } as LocalizedString,
    leadCard: {
      headline: {
        en: "From prosthetics research to deployed robotic footwear.",
        zh: "从假肢研究到落地的机器人鞋履。",
      } as LocalizedString,
      body: {
        en: "A compact summary of the same story: robotics training, control engineering role, recognized research, and product deployment.",
        zh: "一段简洁的概括：机器人学训练、控制工程岗位、受到认可的研究，以及产品落地。",
      } as LocalizedString,
      chips: [
        { en: "Gait control", zh: "步态控制" },
        { en: "Embedded systems", zh: "嵌入式系统" },
        { en: "Human locomotion", zh: "人体运动" },
        { en: "ML intent recognition", zh: "机器学习意图识别" },
      ] as LocalizedString[],
    },
    miniStats: [
      {
        value: "Ph.D.",
        label: { en: "Robotics · University of Michigan", zh: "机器人学 · 密歇根大学" },
      },
      {
        value: "Lead",
        label: { en: "Control Engineer · Shift Robotics", zh: "控制工程师 · Shift Robotics" },
      },
      {
        value: "10+",
        label: { en: "Peer-reviewed publications", zh: "同行评审论文" },
      },
      {
        value: "50+",
        label: { en: "Journal & conference reviews", zh: "期刊与会议审稿" },
      },
    ],
    proofCards: [
      {
        tone: "deployment",
        title: { en: "IKEA deployment", zh: "IKEA 部署" },
        meta: { en: "Moonwalkers · warehouse environments", zh: "Moonwalkers · 仓储环境" },
        body: {
          en: "Real-world robotic footwear systems in operational settings.",
          zh: "真实运营场景中的机器人鞋履系统。",
        },
        chips: [
          { en: "Robotic footwear", zh: "机器人鞋履" },
          { en: "Validation", zh: "验证" },
        ] as LocalizedString[],
      },
      {
        tone: "award",
        title: { en: "IROS ’23", zh: "IROS ’23" },
        meta: { en: "Top research award", zh: "顶级研究奖项" },
        body: {
          en: "Best Student Paper Award · powered prosthesis transitions.",
          zh: "最佳学生论文奖 · 动力假肢转换控制。",
        },
        chips: [
          { en: "Gait transition", zh: "步态转换" },
          { en: "Human trials", zh: "人体实验" },
        ] as LocalizedString[],
      },
      {
        tone: "publication",
        title: { en: "T-RO ’25", zh: "T-RO ’25" },
        meta: { en: "First-author journal paper", zh: "第一作者期刊论文" },
        body: {
          en: "Intent recognition and adaptation in flagship robotics publication.",
          zh: "旗舰机器人学期刊中的意图识别与自适应研究。",
        },
        chips: [
          { en: "Real-time ML", zh: "实时机器学习" },
          { en: "ICF", zh: "ICF" },
        ] as LocalizedString[],
      },
    ],
    stats: [
      {
        classes: "stat stat--featured statHero",
        num: "Ph.D.",
        ref: { kind: "none" },
        badge: { en: "Robotics", zh: "机器人学" },
        label: {
          en: "University of Michigan",
          zh: "密歇根大学",
        },
      },
      {
        classes: "stat stat--featured statHero",
        num: "Lead",
        ref: { kind: "project", slug: "shiftos" },
        badge: { en: "Control Engineer", zh: "控制工程师" },
        label: {
          en: "Shift Robotics",
          zh: "Shift Robotics",
        },
      },
      {
        classes: "stat statSupport",
        num: "IEEE",
        ref: { kind: "external", url: links.scholar },
        label: { en: "Wearable robotics publications", zh: "可穿戴机器人论文" },
      },
      {
        classes: "stat stat--award statSupport",
        num: "IROS",
        ref: { kind: "project", slug: "tnsre2024" },
        label: {
          en: "Best Student Paper Award",
          zh: "最佳学生论文奖",
        },
      },
      {
        classes: "stat statSupport",
        num: "Product",
        ref: { kind: "project", slug: "shiftos" },
        badge: { en: "Deployment", zh: "产品部署" },
        label: { en: "Real-world robotic footwear systems", zh: "真实场景机器人鞋履系统" },
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
    focusAreas: [
      {
        title: { en: "Control systems", zh: "控制系统" },
        text: { en: "Real-time assistance synchronized to human motion.", zh: "与人体运动同步的实时辅助控制。" },
      },
      {
        title: { en: "Human locomotion", zh: "人体运动" },
        text: { en: "Gait phase, terrain, intent, and safety-aware behavior.", zh: "步态相位、地形、意图与安全感知行为。" },
      },
      {
        title: { en: "Product validation", zh: "产品验证" },
        text: { en: "Lab-to-field testing for wearable robotics products.", zh: "面向可穿戴机器人产品的实验室到现场验证。" },
      },
      {
        title: { en: "Embedded sensing", zh: "嵌入式传感" },
        text: { en: "Sensor fusion and low-latency deployment constraints.", zh: "传感融合与低延迟嵌入式部署约束。" },
      },
    ],
  },

  featuredWork: {
    heading: { en: "Selected Work & Publications", zh: "精选工作与论文" } as LocalizedString,
    small: {
      en: "Product systems and peer-reviewed research, without repeating the same contribution twice",
      zh: "产品系统与同行评审研究，避免重复展示同一项贡献",
    } as LocalizedString,
    intro: {
      en: "Each card connects a work area with the relevant publication record when there is one.",
      zh: "每张卡片把一个工作方向与相关论文记录合并呈现。",
    } as LocalizedString,
    roleLabel: { en: "Role", zh: "角色" } as LocalizedString,
    cards: [
      {
        slug: "shiftos",
        role: {
          en: "Lead / Gait Control Engineer.",
          zh: "首席 / 步态控制工程师。",
        },
        keywords: [
          { en: "ShiftOS", zh: "ShiftOS" },
          { en: "Gait sensing", zh: "步态传感" },
          { en: "Embedded control", zh: "嵌入式控制" },
          { en: "Validation", zh: "验证" },
        ],
      },
      {
        slug: "tnsre2024",
        role: {
          en: "Ph.D. research on continuous transition control for powered knee-ankle prostheses.",
          zh: "博士研究工作，面向动力膝踝假肢的连续转换控制。",
        },
        keywords: [
          { en: "Phase control", zh: "相位控制" },
          { en: "Stairs", zh: "楼梯" },
          { en: "Human trials", zh: "人体实验" },
        ],
      },
      {
        slug: "icf",
        role: {
          en: "First-author research on interpretable activity recognition and continuous adaptation.",
          zh: "第一作者研究，面向可解释活动识别与连续自适应。",
        },
        keywords: [
          { en: "Intent recognition", zh: "意图识别" },
          { en: "ICF", zh: "ICF" },
          { en: "Real-time ML", zh: "实时机器学习" },
        ],
      },
      {
        slug: "tbme2024",
        role: {
          en: "Safety-aware prosthesis control with sensing and real-time trajectory reshaping.",
          zh: "融合传感与实时轨迹重塑的安全感知假肢控制。",
        },
        keywords: [
          { en: "Safety", zh: "安全" },
          { en: "Obstacle avoidance", zh: "障碍规避" },
          { en: "Biomechanics", zh: "生物力学" },
        ],
      },
    ],
  },

  publicationsSection: {
    heading: { en: "Selected Publications", zh: "代表论文" } as LocalizedString,
    small: {
      en: "Research credibility without burying the lede",
      zh: "把科研可信度放在更容易看到的位置",
    } as LocalizedString,
    projectLabel: { en: "Project", zh: "项目" } as LocalizedString,
    scholarLabel: { en: "Scholar", zh: "学术主页" } as LocalizedString,
    items: [
      {
        slug: "icf",
        venue: "IEEE T-RO 2025",
        title: {
          en: "Ambilateral Activity Recognition and Continuous Adaptation With a Powered Knee-Ankle Prosthesis",
          zh: "Ambilateral Activity Recognition and Continuous Adaptation With a Powered Knee-Ankle Prosthesis",
        },
        contribution: {
          en: "Interpretable intent recognition and continuous adaptation for powered prosthesis control.",
          zh: "面向动力假肢控制的可解释意图识别与连续自适应。",
        },
      },
      {
        slug: "tnsre2024",
        venue: "IEEE TNSRE 2024",
        title: {
          en: "Continuous Transitions Between Locomotion Activities for Powered Prostheses",
          zh: "Continuous Transitions Between Locomotion Activities for Powered Prostheses",
        },
        contribution: {
          en: "Phase-aligned control for robust walking and stair transitions, recognized at IROS 2023.",
          zh: "用于平地与楼梯转换的相位对齐控制，并获 IROS 2023 认可。",
        },
      },
      {
        slug: "tbme2024",
        venue: "IEEE TBME 2024",
        title: {
          en: "Safety-Critical Stub Avoidance for Powered Prosthetic Legs",
          zh: "Safety-Critical Stub Avoidance for Powered Prosthetic Legs",
        },
        contribution: {
          en: "Real-time sensing and trajectory reshaping to reduce toe-stub risk.",
          zh: "通过实时传感与轨迹重塑降低绊脚风险。",
        },
      },
      {
        slug: "ral2024",
        venue: "IEEE RA-L 2024",
        title: {
          en: "Transfer Learning for Locomotion Intent Prediction",
          zh: "Transfer Learning for Locomotion Intent Prediction",
        },
        contribution: {
          en: "Low-data cross-user adaptation for practical prosthesis intent recognition.",
          zh: "面向实际假肢意图识别的低样本跨用户适配。",
        },
      },
    ],
  },

  newsSection: {
    heading: { en: "Recent Updates", zh: "近期动态" } as LocalizedString,
    small: { en: "Compact highlights", zh: "精简亮点" } as LocalizedString,
    showMore: { en: "Show more", zh: "展开" } as LocalizedString,
  },

  projectsSection: {
    heading: { en: "All Projects", zh: "全部项目" } as LocalizedString,
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
    intro: {
      en: "A single step contains more information than it seems. For wearable robots, each stride is a stream of clues: intent, terrain, balance, timing, and safety. My work focuses on turning those clues into real-time control decisions that feel natural outside the lab.",
      zh: "一步之中，信息远比表面丰富。对可穿戴机器人而言，每一步都是一连串信号：意图、地形、平衡、时序与安全。我的工作，就是将这些信号实时转化为让用户感觉自然的控制决策。",
    } as LocalizedString,
    loopSteps: [
      {
        title: { en: "Sense", zh: "感知" },
        text: { en: "Read motion, contact, load, and environment cues.", zh: "读取运动、接触、负载与环境线索。" },
      },
      {
        title: { en: "Estimate", zh: "估计" },
        text: { en: "Infer gait phase, intent, terrain, and timing.", zh: "推断步态相位、意图、地形与时序。" },
      },
      {
        title: { en: "Assist", zh: "辅助" },
        text: { en: "Apply support at the right moment under real-time limits.", zh: "在实时约束下，于正确时刻提供辅助。" },
      },
      {
        title: { en: "Recover", zh: "恢复" },
        text: { en: "Prioritize stability, safety, and the next stride.", zh: "优先保证稳定、安全与下一步衔接。" },
      },
    ],
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
    heading: { en: "Education & Awards", zh: "教育与奖项" } as LocalizedString,
    small: { en: "Credentials near the close", zh: "页面末尾的关键资历" } as LocalizedString,
    awardsTitle: { en: "Awards & Recognition", zh: "奖项与荣誉" } as LocalizedString,
    awards: [
      { en: "IROS 2023 Best Student Paper Award", zh: "IROS 2023 最佳学生论文奖" },
      { en: "Rackham Pre-Doctoral Fellowship, University of Michigan", zh: "密歇根大学 Rackham 预博士奖学金" },
      { en: "Malott Innovation Award, Purdue University", zh: "普渡大学 Malott Innovation Award" },
    ],
  },

  contactSection: {
    heading: { en: "Contact", zh: "联系" } as LocalizedString,
    small: { en: "Let's connect", zh: "欢迎交流" } as LocalizedString,
    intro: {
      en: "Interested in wearable robotics, locomotion control, or human-centered robotic systems? Feel free to reach out.",
      zh: "如果你对可穿戴机器人、运动控制或以人为中心的机器人系统感兴趣，欢迎联系。",
    } as LocalizedString,
    emailLabel: { en: "Email", zh: "邮箱" } as LocalizedString,
    linkedinLabel: { en: "LinkedIn", zh: "领英" } as LocalizedString,
    scholarLabel: { en: "Google Scholar", zh: "谷歌学术" } as LocalizedString,
    projectsLabel: { en: "All Projects", zh: "全部项目" } as LocalizedString,
    publicationsLabel: { en: "Publications", zh: "论文" } as LocalizedString,
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
