(function initStepEngineering() {
  var section = document.getElementById('step-engineering');
  if (!section) return;
  var dash = section.querySelector('[data-gait-dash]');
  if (!dash) return;

  var isZh   = window.location.pathname.includes('/zh/');
  var gaitAssetRoot = isZh ? '../' : '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var DEFAULT_IDX = 3; // Push-Off

  // ─── SIGNAL TRACES (viewBox 0 0 100 36; lower y = higher value) ─────────────
  var PLOT = { left: 4, width: 92, top: 5, bottom: 31 };
  var PHASE_GRID = [0, 12, 31, 50, 62, 100];
  function signalX(percent) {
    return PLOT.left + Math.max(0, Math.min(100, percent)) / 100 * PLOT.width;
  }
  function signalY(value, min, max) {
    var t = (Math.max(min, Math.min(max, value)) - min) / (max - min || 1);
    return PLOT.bottom - t * (PLOT.bottom - PLOT.top);
  }
  function signalPath(points, min, max) {
    var pts = points.map(function (p) {
      return { x: signalX(p[0]), y: signalY(p[1], min, max) };
    });
    if (pts.length < 2) return '';

    var dx = [], slope = [];
    for (var i = 0; i < pts.length - 1; i++) {
      dx[i] = pts[i + 1].x - pts[i].x;
      slope[i] = (pts[i + 1].y - pts[i].y) / (dx[i] || 1);
    }

    var tangent = [slope[0]];
    for (var j = 1; j < pts.length - 1; j++) {
      var prev = slope[j - 1], next = slope[j];
      if (prev === 0 || next === 0 || prev * next < 0) {
        tangent[j] = 0;
      } else {
        var w1 = 2 * dx[j] + dx[j - 1];
        var w2 = dx[j] + 2 * dx[j - 1];
        tangent[j] = (w1 + w2) / (w1 / prev + w2 / next);
      }
    }
    tangent[pts.length - 1] = slope[slope.length - 1];

    var d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (var k = 0; k < pts.length - 1; k++) {
      var step = dx[k] / 3;
      var c1x = pts[k].x + step;
      var c1y = pts[k].y + tangent[k] * step;
      var c2x = pts[k + 1].x - step;
      var c2y = pts[k + 1].y - tangent[k + 1] * step;
      d += ' C' + c1x.toFixed(2) + ',' + c1y.toFixed(2) +
        ' ' + c2x.toFixed(2) + ',' + c2y.toFixed(2) +
        ' ' + pts[k + 1].x.toFixed(2) + ',' + pts[k + 1].y.toFixed(2);
    }
    return d;
  }

  var DATA_PITCH = [[0, 8], [10, 5], [20, 4], [31, 3], [42, 2], [50, 1], [56, -2], [62, -1], [68, 5], [78, 9], [88, 11], [100, 8]];
  var DATA_VGRF = [[0, 0], [5, 45], [12, 95], [18, 118], [24, 124], [31, 102], [40, 72], [48, 84], [54, 102], [57, 108], [60, 88], [62, 38], [66, 0], [100, 0]];
  var DATA_COP = [[0, 0.06], [8, 0.10], [12, 0.15], [22, 0.25], [31, 0.36], [40, 0.47], [50, 0.62], [54, 0.73], [57, 0.82], [60, 0.89], [62, 0.94]];

  var PATH_PITCH = signalPath(DATA_PITCH, -10, 16);
  var PATH_VGRF  = signalPath(DATA_VGRF, 0, 130);
  // COP travels heel→toe through stance, then collapses to 0 once the foot
  // leaves the ground after push-off (no contact = no centre of pressure).
  var PATH_COP   = signalPath(DATA_COP, 0, 1);

  // Small line-icon set for the sensor callouts (theme-tinted via currentColor).
  var I = {
    signal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="1.8"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7"/><path d="M6 6a8 8 0 0 0 0 12M18 6a8 8 0 0 1 0 12"/></svg>',
    rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/></svg>',
    load: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v9"/><path d="M8 9.5l4 4 4-4"/><path d="M5 19h14"/></svg>',
    balance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M5 8h14"/><path d="M5 8l-2.4 5a3 3 0 0 0 4.8 0z"/><path d="M19 8l-2.4 5a3 3 0 0 0 4.8 0z"/></svg>',
    speed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4.5-3.5"/></svg>',
    clearance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h14"/><path d="M12 16V5"/><path d="M8 9l4-4 4 4"/></svg>',
    timing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.2l2.8 1.8"/></svg>',
    angle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19h14"/><path d="M5 19L18 6"/><path d="M11 19a7 7 0 0 0-1.6-4.4"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.6"/></svg>',
    symmetry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M9 8.5L5 12l4 3.5"/><path d="M15 8.5l4 3.5-4 3.5"/></svg>',
    contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M12 17v4"/><circle cx="12" cy="12" r="3"/><path d="M5 12H3M21 12h-2"/></svg>'
  };

  var T = {
    heel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18h14"/><path d="M7 14h5l5 3"/><circle cx="7" cy="14" r="2" fill="currentColor" stroke="none"/></svg>',
    loading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v9"/><path d="M8 10l4 4 4-4"/><path d="M5 18h14"/></svg>',
    stance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M6 19h12"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>',
    push: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18h7"/><circle cx="7" cy="18" r="2" fill="currentColor" stroke="none"/><path d="M10 16L19 7"/><path d="M19 7v6"/><path d="M19 7h-6"/></svg>',
    swing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19h14"/><path d="M7 15c3-3 6-3 10-1"/><path d="M6 16V8"/><path d="M3.5 10.5L6 8l2.5 2.5"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a7 7 0 1 0 1 6"/><path d="M18 4v4h-4"/></svg>'
  };
  var TIMELINE_ICONS = [T.heel, T.loading, T.stance, T.push, T.swing, T.reset];

  // Index-keyed visual metadata shared across languages. Coordinates are in the
  // stage overlay space (viewBox 0 0 100 100). `anchors` are the three leg points
  // the callouts connect to (kept monotonic top→bottom for clean leaders);
  // `arrow` is the dominant-motion arrow; `tag` is [x, y, anchor] so each phase
  // can place the motion label in open space around the anatomy/trajectory.
  var META = [
    {
      image: 'heel-strike.webp', band: [0, 12], marker: 6, air: false,
      arrow: 'M70,32 C73,45 76,58 79,75', tag: [96, 28, 'right'],
      contact: [73, 86, 27, 46, 0.86],
      anchors: [[66, 31], [69, 53], [72, 73]], icons: [I.signal, I.timing, I.angle]
    },
    {
      image: 'loading.webp', band: [12, 31], marker: 21, air: false,
      arrow: 'M78,29 C78,45 79,61 81,78', tag: [95, 22, 'right'],
      contact: [70, 86, 38, 50, 0.96],
      anchors: [[60, 31], [62, 53], [67, 74]], icons: [I.load, I.angle, I.contact]
    },
    {
      image: 'mid-stance.webp', band: [31, 50], marker: 40, air: false,
      arrow: 'M79,77 C76,62 76,45 80,30', tag: [96, 20, 'right'],
      contact: [69, 86, 37, 48, 0.82],
      anchors: [[63, 31], [65, 53], [69, 74]], icons: [I.target, I.balance, I.speed]
    },
    {
      image: 'push-off.webp', band: [50, 62], marker: 56, air: false,
      arrow: 'M62,84 C70,72 80,57 91,42', tag: [94, 21, 'right'],
      contact: [66, 84, 30, 50, 1],
      anchors: [[58, 31], [54, 53], [53, 74]], icons: [I.signal, I.load, I.rotate]
    },
    {
      image: 'swing.webp', band: [62, 100], marker: 80, air: true,
      arrow: 'M58,65 C70,54 82,48 92,43', tag: [94, 27, 'right'],
      contact: [57, 78, 24, 38, 0.12],
      anchors: [[58, 34], [60, 53], [62, 68]], icons: [I.clearance, I.rotate, I.timing]
    },
    {
      image: 'next-heel-strike.webp', band: [[96, 100], [0, 4]], marker: 0, air: false,
      arrow: 'M70,32 C73,45 76,58 79,75', tag: [96, 28, 'right'],
      contact: [73, 86, 27, 46, 0.86],
      anchors: [[66, 31], [69, 53], [72, 73]], icons: [I.timing, I.load, I.symmetry]
    }
  ];

  // ─── PHASE CONTENT (per language) ───────────────────────────────────────────
  var EN = {
    signals: [
      { key: 'pitch', name: 'Foot Pitch', unit: 'deg', color: '#2f7bff', d: PATH_PITCH },
      { key: 'vgrf', name: 'vGRF (Vertical Ground Reaction Force)', unit: '%BW', color: '#00b894', d: PATH_VGRF },
      { key: 'cop', name: 'COP Progression (Fore-Aft)', unit: '% Foot Length', color: '#8b5cf6', d: PATH_COP }
    ],
    phases: [
      {
        name: 'Heel Strike', range: '0–12%',
        callouts: [
          { t: 'Impact Timing', s: 'Contact detected' },
          { t: 'Foot Orientation', s: 'Landing angle' },
          { t: 'Load Rise', s: 'Stance begins' }
        ],
        arrow: { label: 'CONTACT', sub: 'Ground entry' },
        think: [
          'Has a new stance phase just begun?',
          'Is the loading rate normal or unusually sharp?',
          'Is this contact stable and expected?',
          'Confirm contact and prepare to load.'
        ],
        human: 'The foot contacts the ground and the body begins loading the leading leg.',
        senses: 'Impact timing, load rise, foot orientation, and angular velocity.',
        asks: 'Has stance begun, and is this a normal landing?',
        takeaway: 'Heel strike confirms ground contact and prepares the controller for loading.'
      },
      {
        name: 'Loading', range: '12–31%',
        callouts: [
          { t: 'Load Transfer', s: 'Weight acceptance' },
          { t: 'Contact Stability', s: 'Foot support' },
          { t: 'Deceleration', s: 'Impact absorption' }
        ],
        arrow: { label: 'LOAD ACCEPTANCE', sub: 'Support builds' },
        think: [
          'Is the user committing full weight to this step?',
          'How much stabilization does the loading need?',
          'Is the surface even and the contact secure?',
          'Stay quiet, stabilize, or adapt to terrain.'
        ],
        human: 'Body weight transfers onto the stance foot as impact is absorbed.',
        senses: 'Rising vertical load, foot pitch change, deceleration, and contact stability.',
        asks: 'Is the user loading normally, slowing down, or stepping onto uneven terrain?',
        takeaway: 'Loading response determines whether the robot should stay quiet, stabilize, or adapt.'
      },
      {
        name: 'Mid-Stance', range: '31–50%',
        callouts: [
          { t: 'COP Progression', s: 'Midfoot support' },
          { t: 'Balance State', s: 'Body over foot' },
          { t: 'Terrain Estimate', s: 'Surface context' }
        ],
        arrow: { label: 'BALANCE', sub: 'Support state' },
        think: [
          'Is the user balanced and holding speed?',
          'Is terrain or intent starting to change?',
          'Is the body stable over the support foot?',
          'Hold support and track the user’s intent.'
        ],
        human: 'The body moves over the stance foot during single-limb support.',
        senses: 'Center-of-pressure progression, load distribution, stance duration, and body motion.',
        asks: 'Is the user stable and moving as expected?',
        takeaway: 'Mid-stance gives the controller its clearest view of balance, support, and terrain.'
      },
      {
        name: 'Push-Off', range: '50–62%',
        callouts: [
          { t: 'Toe Loading', s: 'Forefoot pressure' },
          { t: 'Heel Unloading', s: 'Stance release' },
          { t: 'Ankle Rotation', s: 'Push-off timing' }
        ],
        arrow: { label: 'PROPULSION', sub: 'Forward & upward' },
        think: [
          'Is the user preparing to leave the ground?',
          'How much assist should be delivered?',
          'Is the timing safe and within limits?',
          'Deliver assistance at the right amount, right now.'
        ],
        human: 'The trailing foot propels the body forward and upward.',
        senses: 'Toe loading, heel unloading, ankle rotation, and forward velocity.',
        asks: 'How much assist should be delivered before toe-off?',
        takeaway: 'Push-off assistance must arrive early enough to feel natural, but not so early that it fights the user.'
      },
      {
        name: 'Swing', range: '62–100%',
        callouts: [
          { t: 'Foot Clearance', s: 'Toe safety' },
          { t: 'Swing Timing', s: 'Step progression' },
          { t: 'Forward Motion', s: 'Next placement' }
        ],
        arrow: { label: 'SWING', sub: 'Clearance & timing' },
        think: [
          'Is the foot clearing the ground safely?',
          'When should the next contact be expected?',
          'Is the swing trajectory within safe limits?',
          'Time the landing for a stable next step.'
        ],
        human: 'The foot leaves the ground and moves forward for the next step.',
        senses: 'Foot clearance, angular velocity, forward motion, and swing timing.',
        asks: 'Is the foot clearing safely, and when will the next contact occur?',
        takeaway: 'Swing control is about clearance, timing, and preparing for the next stable contact.'
      },
      {
        name: 'Next Heel Strike', range: '100%→0%',
        callouts: [
          { t: 'Next Contact', s: 'New step begins' },
          { t: 'Impact Pattern', s: 'Landing check' },
          { t: 'State Reset', s: 'Continue or adapt' }
        ],
        arrow: { label: 'CYCLE RESET', sub: 'Next contact' },
        think: [
          'Is this step closing as expected?',
          'Did speed, length, or symmetry change?',
          'Was the step normal, or is recovery needed?',
          'Reset, continue, or recover for the next stride.'
        ],
        human: 'The next foot contact closes one step and starts the next cycle.',
        senses: 'Contact timing, load transfer, impact pattern, and phase reset.',
        asks: 'Should the controller continue normally, reset, or recover?',
        takeaway: 'Each new contact turns the previous step into feedback for the next one.'
      }
    ]
  };

  var ZH = {
    signals: [
      { key: 'pitch', name: '脚部俯仰角', unit: 'deg', color: '#2f7bff', d: PATH_PITCH },
      { key: 'vgrf', name: '垂直地反力 (vGRF)', unit: '%BW', color: '#00b894', d: PATH_VGRF },
      { key: 'cop', name: '压力中心推进 (前后)', unit: '%足长', color: '#8b5cf6', d: PATH_COP }
    ],
    phases: [
      {
        name: '脚跟触地', range: '0–12%',
        callouts: [
          { t: '冲击时机', s: '检测到接触' },
          { t: '足部朝向', s: '落地角度' },
          { t: '负载上升', s: '支撑开始' }
        ],
        arrow: { label: '接触', sub: '进入地面' },
        think: [
          '新的支撑相是否已经开始？',
          '落地冲击是否符合正常步态？',
          '接触是否稳定且在预期范围内？',
          '确认触地，并准备进入加载。'
        ],
        human: '足部接触地面，身体开始加载前侧腿。',
        senses: '冲击时机、负载上升、足部朝向和角速度。',
        asks: '支撑是否已经开始？这是否为正常落地？',
        takeaway: '脚跟触地确认地面接触，并让控制器为加载做准备。'
      },
      {
        name: '加载期', range: '12–31%',
        callouts: [
          { t: '负载转移', s: '承重接受' },
          { t: '接触稳定性', s: '足部支撑' },
          { t: '减速', s: '冲击吸收' }
        ],
        arrow: { label: '负载接受', sub: '支撑建立' },
        think: [
          '用户是否正在正常承重？',
          '是否需要稳定辅助或地形适应？',
          '接触是否可靠，冲击是否被吸收？',
          '保持安静、稳定支撑，或主动适应。'
        ],
        human: '身体重量转移到支撑足上，同时吸收落地冲击。',
        senses: '上升的垂直负载、足部俯仰变化、减速和接触稳定性。',
        asks: '用户是在正常承重、减速，还是踏上不平整地面？',
        takeaway: '加载响应决定机器人应保持安静、提供稳定，还是适应地形。'
      },
      {
        name: '站立中期', range: '31–50%',
        callouts: [
          { t: '压力中心推进', s: '中足支撑' },
          { t: '平衡状态', s: '身体位于足上方' },
          { t: '地形估计', s: '地面环境' }
        ],
        arrow: { label: '平衡', sub: '支撑状态' },
        think: [
          '用户是否稳定并按预期移动？',
          '支撑状态是否可靠？',
          '地形或身体运动是否发生变化？',
          '维持支撑，并持续估计意图。'
        ],
        human: '身体在单腿支撑中越过支撑足。',
        senses: '压力中心推进、负载分布、支撑时长与身体运动。',
        asks: '用户是否稳定，并按预期移动？',
        takeaway: '站立中期让控制器最清楚地观察平衡、支撑和地形。'
      },
      {
        name: '蹬地期', range: '50–62%',
        callouts: [
          { t: '脚尖承载', s: '前足压力' },
          { t: '脚跟卸载', s: '支撑释放' },
          { t: '踝关节旋转', s: '蹬地时机' }
        ],
        arrow: { label: '推进', sub: '向前向上' },
        think: [
          '用户是否准备离地？',
          '应当输出多少辅助力？',
          '此刻的时机是否安全、是否在限度内？',
          '此刻就以恰当的力度输出辅助。'
        ],
        human: '后侧足部推动身体向前并向上运动。',
        senses: '脚尖承载、脚跟卸荷、踝关节旋转与前进速度。',
        asks: '在脚离地前，应施加多少推进力？',
        takeaway: '蹬地辅助必须来得足够早以显得自然，又足够晚以避免与用户对抗。'
      },
      {
        name: '摆动期', range: '62–100%',
        callouts: [
          { t: '足部离地间隙', s: '脚尖安全' },
          { t: '摆动时序', s: '步态推进' },
          { t: '前向运动', s: '下一次落点' }
        ],
        arrow: { label: '摆动', sub: '离地与时序' },
        think: [
          '脚是否安全离地？',
          '下一次着地预计何时？',
          '摆动轨迹是否在安全范围内？',
          '把握落地时机，确保下一步稳定。'
        ],
        human: '脚离开地面并向前摆动，为下一步做准备。',
        senses: '足部离地间隙、角速度、前向运动和摆动时序。',
        asks: '脚是否安全离地，下一次着地预计何时？',
        takeaway: '摆动控制关注离地间隙、时序，并为下一次稳定接触做准备。'
      },
      {
        name: '下次脚跟触地', range: '100%→0%',
        callouts: [
          { t: '下一次接触', s: '新步伐开始' },
          { t: '冲击模式', s: '落地检查' },
          { t: '状态重置', s: '继续或适应' }
        ],
        arrow: { label: '周期重置', sub: '下一次接触' },
        think: [
          '这一步是否如预期收尾？',
          '速度、步长或对称性是否改变？',
          '步态是否正常，还是需要恢复？',
          '为下一步选择重置、继续或恢复。'
        ],
        human: '下一次着地结束这一步，并开启下一个控制周期。',
        senses: '新的接触时序、负载转移、冲击模式与相位重置。',
        asks: '控制器应该正常继续、重置，还是进入恢复？',
        takeaway: '每一次新接触都会把上一步转化为下一步的反馈。'
      }
    ]
  };

  var d = isZh ? ZH : EN;
  var phases = d.phases;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function imgSrc(file) { return gaitAssetRoot + 'public/assets/gait/' + file; }
  function phaseBands(meta) {
    return Array.isArray(meta.band[0]) ? meta.band : [meta.band];
  }
  function phaseStart(meta) {
    return phaseBands(meta)[0][0];
  }

  // ─── REFS ───────────────────────────────────────────────────────────────────
  var timelineEl = dash.querySelector('[data-gd-timeline]');
  var stageEl    = dash.querySelector('[data-gd-stage]');
  var signalsEl  = dash.querySelector('[data-gd-signals]');
  var thinkEls   = Array.prototype.slice.call(dash.querySelectorAll('[data-think]'));
  var glanceEls  = {
    human:  dash.querySelector('[data-glance="human"]'),
    senses: dash.querySelector('[data-glance="senses"]'),
    asks:   dash.querySelector('[data-glance="asks"]')
  };
  var takeawayEl = dash.querySelector('[data-takeaway]');

  // ─── TIMELINE ───────────────────────────────────────────────────────────────
  var nodeBtns = [];
  var lineFill = null;
  if (timelineEl) {
    var line = document.createElement('div');
    line.className = 'gdLine';
    line.setAttribute('aria-hidden', 'true');
    line.innerHTML = '<div class="gdLineFill"></div>';
    timelineEl.appendChild(line);
    lineFill = line.querySelector('.gdLineFill');

    phases.forEach(function (p, i) {
      var pct = String(phaseStart(META[i])) + '%';
      if (i === phases.length - 1) pct = '100%';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gdNode';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
      btn.setAttribute('aria-label', p.name);
      btn.dataset.idx = i;
      btn.innerHTML =
        '<span class="gdNodePct">' + esc(pct) + '</span>' +
        '<span class="gdNodeDot" aria-hidden="true"></span>' +
        '<span class="gdNodeAction" aria-hidden="true">' + TIMELINE_ICONS[i] + '</span>' +
        '<span class="gdNodeName">' + esc(p.name) + '</span>';
      timelineEl.appendChild(btn);
      nodeBtns.push(btn);
    });
  }

  // ─── STAGE ──────────────────────────────────────────────────────────────────
  var stageImgs = [], stagePhaseEl = null, stageRangeEl = null;
  var calloutEls = [], arrowLabelEl = null, arrowSubEl = null;
  var arrowLineEl = null, arrowFillEl = null, arrowCoreEl = null;
  var arrowGlowEl = null, arrowMainEl = null, arrowTagEl = null, leaderEls = [];

  // Build a filled, tapered arrow "ribbon" from a cubic centerline path element:
  // sample the curve, offset both sides by a widening profile, cap with a broad
  // arrowhead. Returns { fill, core } path data in the 0..100 overlay space.
  function arrowRibbon(pathEl) {
    var L = pathEl.getTotalLength();
    if (!L) return null;
    var N = 30;
    var pts = [];
    for (var i = 0; i <= N; i++) {
      var sp = pathEl.getPointAtLength(L * i / N);
      pts.push({ x: sp.x, y: sp.y });
    }
    var headStart = Math.round(N * 0.72);
    var wTail = 0.7, wBody = 3.4, headW = 6.6;
    function normalAt(i) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
      var tx = b.x - a.x, ty = b.y - a.y;
      var len = Math.hypot(tx, ty) || 1;
      return { x: -ty / len, y: tx / len };
    }
    var upper = [], lower = [];
    for (var j = 0; j <= headStart; j++) {
      var t = j / headStart;
      var w = wTail + (wBody - wTail) * Math.pow(t, 0.65);
      var n = normalAt(j);
      upper.push({ x: pts[j].x + n.x * w, y: pts[j].y + n.y * w });
      lower.push({ x: pts[j].x - n.x * w, y: pts[j].y - n.y * w });
    }
    var base = pts[headStart], tip = pts[N], nh = normalAt(headStart);
    var wingU = { x: base.x + nh.x * headW, y: base.y + nh.y * headW };
    var wingL = { x: base.x - nh.x * headW, y: base.y - nh.y * headW };
    function fmt(p) { return p.x.toFixed(2) + ',' + p.y.toFixed(2); }
    var d = 'M' + fmt(upper[0]);
    for (var u = 1; u < upper.length; u++) d += ' L' + fmt(upper[u]);
    d += ' L' + fmt(wingU) + ' L' + fmt(tip) + ' L' + fmt(wingL);
    for (var lo = lower.length - 1; lo >= 0; lo--) d += ' L' + fmt(lower[lo]);
    d += ' Z';
    // Gloss core: a slim spine along the centerline up to the arrowhead base.
    var core = 'M' + fmt(pts[0]);
    for (var c = 1; c <= headStart; c++) core += ' L' + fmt(pts[c]);
    return { fill: d, core: core };
  }
  if (stageEl) {
    var imgs = META.map(function (m, i) {
      return '<img class="gdImg' + (i === DEFAULT_IDX ? ' gdImgActive' : '') + '" src="' +
        imgSrc(m.image) + '" alt="" loading="' + (i === DEFAULT_IDX ? 'eager' : 'lazy') +
        '" decoding="async" data-i="' + i + '"/>';
    }).join('');
    var calloutMarkup = '';
    for (var ci = 0; ci < 3; ci++) {
      calloutMarkup +=
        '<div class="gdCallout gdCallout' + ci + '">' +
          '<span class="gdCalloutIcon" aria-hidden="true"></span>' +
          '<span class="gdCalloutText"><strong></strong><span></span></span>' +
        '</div>';
    }
    var leaderMarkup = '';
    for (var li = 0; li < 3; li++) {
      leaderMarkup +=
        '<g class="gdLeader">' +
          '<line class="gdLeaderLine" x1="0" y1="0" x2="0" y2="0"/>' +
          '<circle class="gdLeaderDot gdLeaderDotEnd" r="0.9"/>' +
          '<circle class="gdLeaderHalo" r="3.4"/>' +
          '<circle class="gdLeaderDot gdLeaderDotLeg" r="1.7"/>' +
        '</g>';
    }
    stageEl.innerHTML =
      '<div class="gdStageDepth" aria-hidden="true"></div>' +
      '<div class="gdStageGrid" aria-hidden="true"></div>' +
      '<div class="gdStageArcs" aria-hidden="true"></div>' +
      '<div class="gdStageBadge"><span class="gdStagePhase"></span><span class="gdStageRange"></span></div>' +
      '<div class="gdImageStack" aria-hidden="true">' + imgs + '</div>' +
      '<div class="gdStageGlow" aria-hidden="true"></div>' +
      '<div class="gdFootGlow" aria-hidden="true"><span></span><i></i></div>' +
      '<svg class="gdOverlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="gdArrowGrad" x1="0" y1="1" x2="1" y2="0">' +
            '<stop offset="0" stop-color="#1f63ff"/>' +
            '<stop offset="0.5" stop-color="#4d9bff"/>' +
            '<stop offset="1" stop-color="#8fecff"/>' +
          '</linearGradient>' +
          '<marker id="gdArrowHead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">' +
            '<path d="M0,0 L8,4 L0,8 Z" fill="#8fecff"/>' +
          '</marker>' +
        '</defs>' +
        '<path class="gdProtractor" d="M47,31 A23,23 0 0 1 79,23"/>' +
        '<g class="gdLeaders">' + leaderMarkup + '</g>' +
        '<path class="gdArrowFill" d=""/>' +
        '<path class="gdArrowCore" d=""/>' +
        '<path class="gdArrowGlow" d=""/>' +
        '<path class="gdArrowMain" d=""/>' +
        '<path class="gdArrowLine" d=""/>' +
      '</svg>' +
      '<div class="gdArrowTag"><strong class="gdArrowLabel"></strong><span class="gdArrowSub"></span></div>' +
      '<div class="gdCallouts" aria-hidden="true">' + calloutMarkup + '</div>';

    stageImgs = Array.prototype.slice.call(stageEl.querySelectorAll('.gdImg'));
    stagePhaseEl = stageEl.querySelector('.gdStagePhase');
    stageRangeEl = stageEl.querySelector('.gdStageRange');
    arrowLabelEl = stageEl.querySelector('.gdArrowLabel');
    arrowSubEl   = stageEl.querySelector('.gdArrowSub');
    arrowTagEl   = stageEl.querySelector('.gdArrowTag');
    arrowLineEl  = stageEl.querySelector('.gdArrowLine');
    arrowFillEl  = stageEl.querySelector('.gdArrowFill');
    arrowCoreEl  = stageEl.querySelector('.gdArrowCore');
    arrowGlowEl  = stageEl.querySelector('.gdArrowGlow');
    arrowMainEl  = stageEl.querySelector('.gdArrowMain');
    leaderEls = Array.prototype.slice.call(stageEl.querySelectorAll('.gdLeader')).map(function (g) {
      return {
        line: g.querySelector('.gdLeaderLine'),
        legDot: g.querySelector('.gdLeaderDotLeg'),
        halo: g.querySelector('.gdLeaderHalo'),
        endDot: g.querySelector('.gdLeaderDotEnd')
      };
    });
    calloutEls = Array.prototype.slice.call(stageEl.querySelectorAll('.gdCallout')).map(function (el) {
      return {
        icon: el.querySelector('.gdCalloutIcon'),
        title: el.querySelector('strong'),
        sub: el.querySelector('.gdCalloutText span')
      };
    });
  }

  // Point the arrow + the three leader lines at the current phase's anatomy and
  // place the motion label clear of the arrow.
  function updateStageOverlay(idx) {
    var meta = META[idx];
    if (arrowLineEl) {
      arrowLineEl.setAttribute('d', meta.arrow); // measured centerline
      if (arrowGlowEl) arrowGlowEl.setAttribute('d', meta.arrow);
      if (arrowMainEl) arrowMainEl.setAttribute('d', meta.arrow);
      var ribbon = arrowRibbon(arrowLineEl);
      if (ribbon) {
        if (arrowFillEl) arrowFillEl.setAttribute('d', ribbon.fill);
        if (arrowCoreEl) arrowCoreEl.setAttribute('d', ribbon.core);
      }
    }
    if (arrowTagEl && meta.tag) {
      arrowTagEl.style.left = meta.tag[0] + '%';
      arrowTagEl.style.top = meta.tag[1] + '%';
      arrowTagEl.dataset.anchor = meta.tag[2] || 'center';
    }
    if (stageEl && meta.contact) {
      stageEl.style.setProperty('--gd-contact-x', meta.contact[0] + '%');
      stageEl.style.setProperty('--gd-contact-y', meta.contact[1] + '%');
      stageEl.style.setProperty('--gd-contact-w', meta.contact[2] + '%');
      stageEl.style.setProperty('--gd-contact-h', meta.contact[3] + 'px');
      stageEl.style.setProperty('--gd-contact-opacity', String(meta.contact[4]));
    }
    // The compact callout chips end near 36% of the stage width, so the dotted
    // leader starts just outside the chip and ends on the anatomy.
    var CHIP_EDGE = 37;
    leaderEls.forEach(function (l, i) {
      var a = meta.anchors[i];
      if (!a) return;
      var ax = a[0], ay = a[1];
      var endX = Math.min(ax - 3, CHIP_EDGE);
      l.line.setAttribute('x1', ax); l.line.setAttribute('y1', ay);
      l.line.setAttribute('x2', endX); l.line.setAttribute('y2', ay);
      l.legDot.setAttribute('cx', ax); l.legDot.setAttribute('cy', ay);
      l.halo.setAttribute('cx', ax); l.halo.setAttribute('cy', ay);
      l.endDot.setAttribute('cx', endX); l.endDot.setAttribute('cy', ay);
    });
  }

  // ─── SIGNALS ────────────────────────────────────────────────────────────────
  var signalParts = [];
  if (signalsEl) {
    var guideMarkup = [0.25, 0.5, 0.75].map(function (t) {
      var y = (PLOT.top + (PLOT.bottom - PLOT.top) * t).toFixed(2);
      return '<line class="gdSignalGuideLine" x1="' + PLOT.left + '" y1="' + y + '" x2="' + (PLOT.left + PLOT.width) + '" y2="' + y + '"/>';
    }).join('');
    var gridMarkup = PHASE_GRID.map(function (pct) {
      var x = signalX(pct).toFixed(2);
      return '<line class="gdSignalGridLine" x1="' + x + '" y1="' + PLOT.top + '" x2="' + x + '" y2="' + PLOT.bottom + '"/>';
    }).join('');
    d.signals.forEach(function (sig) {
      var key = sig.key || ['pitch', 'vgrf', 'cop'][signalParts.length] || '';
      var card = document.createElement('div');
      card.className = 'gdSignal gdSignal-' + key;
      card.innerHTML =
        '<div class="gdSignalHead">' +
          '<span class="gdSignalName">' + esc(sig.name) + '</span>' +
          '<span class="gdSignalUnit">' + esc(sig.unit) + '</span>' +
        '</div>' +
        '<div class="gdSignalPlot">' +
          '<svg class="gdSignalSvg" viewBox="0 0 100 36" preserveAspectRatio="none">' +
            '<g class="gdSignalGuides">' + guideMarkup + '</g>' +
            '<g class="gdSignalGrid">' + gridMarkup + '</g>' +
            '<rect class="gdSignalBand" x="0" y="0" width="0" height="36"/>' +
            '<rect class="gdSignalBand" x="0" y="0" width="0" height="36"/>' +
            '<path class="gdSignalGlow" d="' + sig.d + '" fill="none" stroke="' + sig.color + '"/>' +
            '<path class="gdSignalTrace" d="' + sig.d + '" fill="none" stroke="' + sig.color + '"/>' +
          '</svg>' +
          '<span class="gdSignalMarker"></span>' +
        '</div>';
      signalsEl.appendChild(card);
      var mk = card.querySelector('.gdSignalMarker');
      // True round HTML marker (an SVG circle would stretch with the plot).
      mk.style.background = sig.color;
      mk.style.boxShadow = '0 0 0 3px ' + sig.color + '2e, 0 0 9px ' + sig.color + '99';
      signalParts.push({
        card: card,
        bands: Array.prototype.slice.call(card.querySelectorAll('.gdSignalBand')),
        trace: card.querySelector('.gdSignalTrace'),
        marker: mk,
        unit: card.querySelector('.gdSignalUnit'),
        key: key,
        unitText: sig.unit,
        color: sig.color
      });
    });
    var axis = document.createElement('div');
    axis.className = 'gdSignalAxis';
    axis.setAttribute('aria-hidden', 'true');
    axis.innerHTML = '<span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>';
    signalsEl.appendChild(axis);
  }

  // Find the point on a monotonic-in-x path at a given x (0..100 viewBox units).
  function pointAtX(path, targetX) {
    var total = path.getTotalLength();
    if (!total) return { x: targetX, y: 18 };
    var lo = 0, hi = total, pt = path.getPointAtLength(total);
    for (var i = 0; i < 26; i++) {
      var mid = (lo + hi) / 2;
      var p = path.getPointAtLength(mid);
      if (p.x < targetX) lo = mid; else { hi = mid; pt = p; }
    }
    return pt;
  }

  function updateSignals(idx) {
    var meta = META[idx];
    var bands = phaseBands(meta);
    signalParts.forEach(function (s) {
      var noContact = s.key === 'cop' && meta.air;
      s.card.classList.toggle('gdSignalNoContact', noContact);
      s.bands.forEach(function (band, i) {
        var b = bands[i];
        if (!b) {
          band.setAttribute('width', 0);
          return;
        }
        band.setAttribute('x', signalX(b[0]).toFixed(2));
        band.setAttribute('width', ((Math.max(0, b[1] - b[0]) / 100) * PLOT.width).toFixed(2));
      });
      var markerX = signalX(meta.marker);
      var pt = pointAtX(s.trace, markerX);
      s.marker.style.left = markerX.toFixed(2) + '%';
      s.marker.style.top = (pt.y / 36 * 100).toFixed(2) + '%';
      s.marker.style.opacity = noContact ? '0' : '1';
      if (s.unit) s.unit.textContent = noContact ? 'no contact' : s.unitText;
    });
  }

  // ─── ANIMATION HELPER ───────────────────────────────────────────────────────
  function flash(el) {
    if (!el || reduce) return;
    el.classList.remove('gdSwap');
    void el.offsetWidth;
    el.classList.add('gdSwap');
  }

  // ─── SELECT ─────────────────────────────────────────────────────────────────
  var activeIdx = DEFAULT_IDX;

  function scrollNodeIntoView(btn) {
    if (!timelineEl || !btn) return;
    var left = btn.offsetLeft, right = left + btn.offsetWidth;
    var scr = timelineEl.scrollLeft, vis = timelineEl.clientWidth;
    if (left < scr) timelineEl.scrollLeft = left - 12;
    else if (right > scr + vis) timelineEl.scrollLeft = right - vis + 12;
  }

  function selectPhase(idx, isInit) {
    activeIdx = ((idx % phases.length) + phases.length) % phases.length;
    var p = phases[activeIdx];
    var meta = META[activeIdx];

    nodeBtns.forEach(function (btn, i) {
      var on = i === activeIdx;
      btn.classList.toggle('gdNodeActive', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.setAttribute('tabindex', on ? '0' : '-1');
    });
    if (lineFill) lineFill.style.width = (activeIdx / (phases.length - 1) * 100) + '%';

    if (stageEl) {
      stageEl.dataset.phase = String(activeIdx);
      stageImgs.forEach(function (img, i) { img.classList.toggle('gdImgActive', i === activeIdx); });
      if (stagePhaseEl) stagePhaseEl.textContent = p.name;
      if (stageRangeEl) stageRangeEl.textContent = p.range;
      if (arrowLabelEl) arrowLabelEl.textContent = p.arrow.label;
      if (arrowSubEl) arrowSubEl.textContent = p.arrow.sub;
      calloutEls.forEach(function (c, i) {
        var data = p.callouts[i];
        if (!data) return;
        if (c.icon && meta.icons[i]) c.icon.innerHTML = meta.icons[i];
        if (c.title) c.title.textContent = data.t;
        if (c.sub) c.sub.textContent = data.s;
      });
      stageEl.classList.toggle('gdAir', !!meta.air);
      stageEl.setAttribute('aria-label', p.name + ' — ' + p.range);
      updateStageOverlay(activeIdx);
      flash(stageEl);
    }

    thinkEls.forEach(function (el, i) {
      if (p.think[i] != null) el.textContent = p.think[i];
    });
    if (glanceEls.human)  glanceEls.human.textContent  = p.human;
    if (glanceEls.senses) glanceEls.senses.textContent = p.senses;
    if (glanceEls.asks)   glanceEls.asks.textContent   = p.asks;
    if (takeawayEl) takeawayEl.textContent = p.takeaway;
    flash(takeawayEl);

    updateSignals(activeIdx);
    if (!isInit) scrollNodeIntoView(nodeBtns[activeIdx]);
  }

  // ─── INTERACTION ────────────────────────────────────────────────────────────
  nodeBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { selectPhase(i); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); selectPhase(i + 1); nodeBtns[activeIdx].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); selectPhase(i - 1); nodeBtns[activeIdx].focus();
      } else if (e.key === 'Home') {
        e.preventDefault(); selectPhase(0); nodeBtns[activeIdx].focus();
      } else if (e.key === 'End') {
        e.preventDefault(); selectPhase(phases.length - 1); nodeBtns[activeIdx].focus();
      }
    });
  });

  // Recompute marker positions once images/layout settle and on resize.
  window.addEventListener('resize', function () { updateSignals(activeIdx); });

  selectPhase(DEFAULT_IDX, true);
})();
