import type { EducationItem } from "./schema.js";

// Each `degree` is the full <li> inner HTML (contains <strong> and, for the
// Ph.D., an affiliation link). Extracted verbatim from the Education section.
export const education: EducationItem[] = [
  {
    id: "phd",
    degree: {
      en: '<strong>Ph.D. Robotics</strong>, University of Michigan (2019–2024) · <span class="affil"><a href="https://locolab.robotics.umich.edu/index.html" target="_blank" rel="noopener">LocoLab</a>, advised by Prof. Robert D. Gregg</span>',
      zh: '<strong>机器人学博士</strong>，密歇根大学（2019–2024）· <span class="affil"><a href="https://locolab.robotics.umich.edu/index.html" target="_blank" rel="noopener">LocoLab</a>，导师：Robert D. Gregg 教授</span>',
    },
  },
  {
    id: "ms",
    degree: {
      en: "<strong>M.S. Mechanical Engineering &amp; Robotics</strong>, University of Michigan (2019–2021)",
      zh: "<strong>机械工程与机器人双硕士</strong>，密歇根大学（2019–2021）",
    },
  },
  {
    id: "bs",
    degree: {
      en: "<strong>B.S. Mechanical Engineering (Distinction)</strong>, Purdue University (2015–2018)",
      zh: "<strong>机械工程学士（Distinction）</strong>，普渡大学（2015–2018）",
    },
  },
];
