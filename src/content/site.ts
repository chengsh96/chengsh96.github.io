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
      { anchor: "snapshot", label: { en: "Highlights", zh: "亮点" } },
      { anchor: "about", label: { en: "About", zh: "关于" } },
      { anchor: "projects", label: { en: "Selected Work", zh: "精选工作" } },
      { anchor: "experience", label: { en: "Experience", zh: "经历" } },
      { anchor: "step-engineering", label: { en: "Hidden Engineering", zh: "隐藏工程" } },
      { anchor: "news", label: { en: "Updates", zh: "动态" } },
      { anchor: "education", label: { en: "Education & Awards", zh: "教育与奖项" } },
      { anchor: "contact", label: { en: "Contact", zh: "联系" } },
    ],
  },

  hero: {
    kicker: {
      en: "Wearable Robotics • Controls • Biomechanics • Motion & Interaction • Machine Learning",
      zh: "可穿戴机器人 • 控制 • 生物力学 • 运动与交互 • 机器学习",
    } as LocalizedString,
    // Full <h1> inner HTML (contains the .nameAccent span).
    name: {
      en: 'Hi, <span class="nameWordmark">I\'m Shihao</span>',
      zh: '你好，<span class="nameWordmark">我是世浩</span>',
    } as LocalizedRichText,
    rolePrefix: { en: "A ", zh: "一位 " } as LocalizedString,
    lead: {
      en: 'I build real-time control systems for wearable robots — from <a href="projects/shiftos.html">Moonwalkers on warehouse floors</a> to <a href="projects/icf.html">intelligent prosthetic legs that adapt to stairs, ramps, and real-world terrain</a>.',
      zh: '我构建面向可穿戴机器人的实时控制系统 —— 从<a href="projects/shiftos.html">仓库地面上的 Moonwalkers</a>，到<a href="projects/icf.html">能够适应楼梯、坡道与真实地形的智能假肢</a>。',
    } as LocalizedRichText,
    cta: {
      viewProjects: { en: "View Projects", zh: "查看项目" } as LocalizedString,
      linkedin: { en: "LinkedIn", zh: "领英" } as LocalizedString,
      scholar: { en: "Scholar", zh: "谷歌学术" } as LocalizedString,
    },
    avatarAlt: { en: "Shihao Cheng", zh: "程世浩" } as LocalizedString,
    byline: [
      { en: "Robotics PhD @ UMich", zh: "机器人学博士 @ 密歇根大学" },
      { en: "Lead Control Engineer @ Shift Robotics", zh: "首席控制工程师 @ Shift Robotics" },
    ] as LocalizedString[],
    videoAria: {
      en: "ShiftOS Moonwalkers demonstration",
      zh: "ShiftOS Moonwalkers 演示",
    } as LocalizedString,
    videoCaption: {
      en: 'ShiftOS in production · <a href="projects/shiftos.html">See the system →</a>',
      zh: 'ShiftOS 量产应用 · <a href="projects/shiftos.html">查看系统 →</a>',
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
          en: "Robotic footwear deployed in warehouse operations.",
          zh: "在仓储运营中部署的机器人鞋。",
        },
        chips: [
          { en: "Robotic footwear", zh: "机器人鞋" },
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
        label: { en: "Real-world robotic footwear systems", zh: "真实场景中的机器人鞋系统" },
      },
    ] as Stat[],
  },

  about: {
    heading: { en: "About", zh: "关于" } as LocalizedString,
    small: { en: "Research → deployment", zh: "研究 → 落地" } as LocalizedString,
    statement: {
      en: "I build systems that feel <em>simple</em> because the engineering underneath is not.",
      zh: "我构建的系统让人觉得<em>简单</em>，是因为底层的工程并不简单。",
    } as LocalizedRichText,
    lead: {
      en: "<strong>I make wearable robots less robotic.</strong>",
      zh: "<strong>我的目标是让可穿戴机器人的交互更自然、更少打扰用户。</strong>",
    } as LocalizedRichText,
    paragraphs: [
      {
        en: "I work on control and sensing for wearable robots. The hard part isn't making them move — it's making them respond naturally to people.",
        zh: "我研究可穿戴机器人的控制与传感。难点不在于让它动起来，而在于让它自然地回应人。",
      },
      {
        en: "Most of my work lives in the gap between lab prototype and daily use: delivering assistance at the right moment, handling noisy sensors and rough terrain, and validating the whole system, not isolated algorithms.",
        zh: "我的工作大多处在实验室原型与日常使用之间：在正确时刻提供辅助、应对噪声传感器与复杂地面，并验证完整系统，而非孤立算法。",
      },
      {
        en: "The goal is for users to notice the robot less, not more.",
        zh: "目标是让用户更少察觉到机器人，而不是更多。",
      },
    ] as LocalizedRichText[],
    principles: [
      {
        title: { en: "Read the situation, not just the sensors", zh: "读懂情境，而不只是传感器" },
        text: {
          en: "Human movement is noisy and context-dependent. Intent has to be inferred from motion, contact, terrain, and timing together.",
          zh: "人体运动充满噪声且依赖情境。意图必须从动作、接触、地形与时序中共同推断。",
        },
      },
      {
        title: { en: "Assist only when it helps", zh: "仅在有益时介入" },
        text: {
          en: "Assistance should arrive at the right moment, and stay unobtrusive when the user is already moving well.",
          zh: "辅助应在恰当时刻到来，并在用户本已动作流畅时保持低存在感。",
        },
      },
      {
        title: { en: "Design for the full system", zh: "面向完整系统设计" },
        text: {
          en: "Control logic, embedded constraints, hardware behavior, and safety checks have to work together.",
          zh: "控制逻辑、嵌入式约束、硬件行为与安全校验必须协同工作。",
        },
      },
      {
        title: { en: "Prove it outside the lab", zh: "在实验室之外验证" },
        text: {
          en: "Models and bench tests are starting points. The real question is whether the behavior stays reliable across users, surfaces, and use cases.",
          zh: "模型与台架测试只是起点。真正的问题是行为能否在不同用户、不同地面与不同场景下保持可靠。",
        },
      },
    ],
  },

  featuredWork: {
    heading: { en: "Selected Work & Publications", zh: "精选工作与论文" } as LocalizedString,
    roleLabel: { en: "Role", zh: "角色" } as LocalizedString,
    cards: [
      {
        slug: "shiftos",
        role: {
          en: "Lead Control Engineer / Gait Control Engineer.",
          zh: "首席控制工程师 / 步态控制工程师。",
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
        badge: { en: "Featured Article", zh: "特色文章" } as LocalizedString,
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
      {
        slug: "ral2024",
        role: {
          en: "Built the CNN intent classifier and transfer-learning strategy for cross-user adaptation.",
          zh: "构建 CNN 意图分类器与面向跨用户自适应的迁移学习策略。",
        },
        keywords: [
          { en: "Transfer learning", zh: "迁移学习" },
          { en: "Intent prediction", zh: "意图预测" },
          { en: "Cross-user", zh: "跨用户" },
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
    heading: { en: "The Hidden Engineering in a Step", zh: "每一步背后的隐形工程" } as LocalizedString,
    // Accent word inside the heading, highlighted in blue (matches preview).
    headingAccent: { en: "Engineering", zh: "隐形工程" } as LocalizedString,
    small: {
      en: "Tap a phase to see what the controller is estimating.",
      zh: "点击步态阶段，看看控制器正在判断什么。",
    } as LocalizedString,
    // Two-line hook that replaces the old long paragraph.
    hook: [
      {
        en: "Every step is a real-time control problem.",
        zh: "每一步都是一个实时控制问题。",
      },
      {
        en: "The robot must sense motion, infer intent, and assist at exactly the right moment.",
        zh: "机器人必须感知运动、推断意图，并在恰当的时刻给出辅助。",
      },
    ] as LocalizedString[],
    // Static dashboard chrome labels (per-phase content lives in the widget JS).
    cycleLabel: { en: "Gait Cycle", zh: "步态周期" } as LocalizedString,
    cycleSub: { en: "One step = 0% → 100%", zh: "一步 = 0% → 100%" } as LocalizedString,
    thinkingLabel: { en: "Controller's Thinking", zh: "控制器决策" } as LocalizedString,
    signalsLabel: { en: "Live Signals", zh: "实时信号" } as LocalizedString,
    realtimeLabel: { en: "Real-time", zh: "实时" } as LocalizedString,
    glanceLabel: { en: "At a Glance", zh: "概览" } as LocalizedString,
    takeawayLabel: { en: "Key Takeaway", zh: "核心要点" } as LocalizedString,
    humanLabel: { en: "Human Motion", zh: "人体动作" } as LocalizedString,
    sensesLabel: { en: "Robot Senses", zh: "机器人感知" } as LocalizedString,
    asksLabel: { en: "Controller Asks", zh: "控制器追问" } as LocalizedString,
    // The four fixed stages of the controller's reasoning (text differs per phase).
    thinkingTitles: [
      { en: "Understand", zh: "理解" },
      { en: "Evaluate", zh: "评估" },
      { en: "Ensure Safety", zh: "确保安全" },
      { en: "Decide", zh: "决策" },
    ] as LocalizedString[],
    controlLoopAria: {
      en: "Gait-cycle control dashboard",
      zh: "步态周期控制面板",
    } as LocalizedString,
    timelineAria: { en: "Gait phases", zh: "步态阶段" } as LocalizedString,
    ref: {
      en: "Gait-phase terminology follows clinical convention. Wearable robotics concepts draw from real-time prosthetic and exoskeleton control research.",
      zh: "步态阶段术语遵循临床惯例。可穿戴机器人概念源自实时假肢与外骨骼控制研究。",
    } as LocalizedString,
    seeProjects: { en: "See Projects", zh: "查看项目" } as LocalizedString,
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
