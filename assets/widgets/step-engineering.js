(function initStepEngineering() {
  var section = document.getElementById('step-engineering');
  if (!section) return;

  var isZh   = window.location.pathname.includes('/zh/');
  var gaitAssetRoot = isZh ? '../' : '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS     = 'http://www.w3.org/2000/svg';
  var TW = 400, TH = 60;

  // Phase x-ranges in the 400px viewBox (proportional to gait cycle %)
  var PHASE_X = [
    [{ x:   0, w:  48 }],                  // Heel Strike   0-12%
    [{ x:  48, w:  76 }],                  // Loading      12-31%
    [{ x: 124, w:  76 }],                  // Mid-Stance   31-50%
    [{ x: 200, w:  48 }],                  // Push-Off     50-62%
    [{ x: 248, w: 152 }],                  // Swing        62-100%
    [{ x: 386, w:  14 }, { x: 0, w: 14 }]  // Next contact wraps 100% to 0%
  ];
  var PHASE_COLORS = ['#2b6cff','#00a8e8','#00c2a0','#f59e0b','#7c3aed','#e11d48'];

  // Phase boundary x positions (for grid lines inside each plot)
  var GRID_X = [48, 124, 200, 248, 386];

  // ─── SIGNAL PATHS (viewBox 0 0 400 60) ───────────────────────────────────
  //
  // Foot Pitch: sagittal foot angle over one gait cycle
  //   near neutral at heel strike → slight drop to flat foot during loading
  //   gradual rise through stance (increasing plantarflexion)
  //   strong plantarflexion at push-off → rapid dorsiflexion in swing → recovery
  var PATH_PITCH = [
    'M0,28',
    'C16,29 28,32 48,34',         // heel strike to loading: foot lowers
    'C72,36 100,38 124,40',       // loading: foot approaches flat
    'C148,42 176,44 200,47',      // mid-stance: gradual plantarflexion
    'C214,50 226,53 238,52',      // push-off: plantarflexion peak
    'C250,48 258,34 268,23',      // early swing: rapid dorsiflexion
    'C282,12 306,12 332,15',      // mid-swing: clearance
    'C356,18 382,24 400,27'       // late swing: prepare for next contact
  ].join(' ');

  // vGRF: vertical ground reaction force — classic walking double-hump
  //   near-zero at heel strike → first hump (loading) → mid-stance valley
  //   second hump (push-off) → drop to zero in swing
  var PATH_VGRF = [
    'M0,57 L2,57',
    'C4,42 9,18 18,8',            // heel strike: rapid force rise
    'C30,4 46,8 62,16',           // loading: first peak then unloading
    'C86,27 112,34 140,34',       // mid-stance: force valley
    'C164,33 190,24 205,14',      // terminal stance: rise toward second peak
    'C218,7 232,12 244,30',       // push-off: second peak and unloading
    'C252,42 258,53 264,57 L400,57' // swing: foot off ground, force near zero
  ].join(' ');



  // ─── DATA ─────────────────────────────────────────────────────────────────
  var EN = {
    intro: 'A single step contains more information than it seems. For wearable robots, each stride is a stream of clues: intent, terrain, balance, timing, and safety. My work focuses on turning those clues into real-time control decisions that feel natural outside the lab.',
    loopLabel: 'Real-time Control Loop',
    feedbackLabel: 'closed-loop feedback',
    loopNodes: [
      { name:'Sense Motion',   sub:'Multi-modal sensor input',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="2"/><path d="M9.2 9.2a4 4 0 0 0 0 5.6"/><path d="M14.8 9.2a4 4 0 0 1 0 5.6"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4"/><path d="M17.7 6.3a8 8 0 0 1 0 11.4"/></svg>' },
      { name:'Infer Intent',   sub:'Sit · stand · walk · stairs · speed up · slow down · stop and more',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v4.5"/><path d="M11 12L6.8 17"/><path d="M13 12L17.2 17"/></svg>' },
      { name:'Decide Control', sub:'Human-in-the-loop assistance synchronized to motion',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3"/></svg>' },
      { name:'Assist Motion',  sub:'Smooth, timely motor output',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="3"/><path d="M12 12h7"/><path d="M15.5 9.5l3.5 2.5-3.5 2.5"/></svg>' }
    ],
    telemetryTitle: 'Live signals behind each control decision',
    telemetryCaption: 'Illustrative signals, simplified for visualization.',
    signals: [
      { name:'Foot Pitch', unit:'deg', color:'#4d8fff', d: PATH_PITCH },
      { name:'vGRF',       unit:'%BW', color:'#00c2a0', d: PATH_VGRF  }
    ],
    phases: [
      { icon:'◉︎', name:'Heel Strike', pct:'0–12%',
        human:  'The foot contacts the ground. Body weight begins transferring onto the leading leg.',
        senses: 'Impact timing, rapid force rise, foot orientation, and angular velocity from the IMU.',
        ctrl:   '"Has stance begun? Is this a normal step, a sudden stop, or an uneven surface?"' },
      { icon:'⬇︎', name:'Loading', pct:'12–31%',
        human:  'The body loads onto the foot. The user commits full weight to this step.',
        senses: 'Force increase rate, IMU pitch change, motor load response, and load distribution.',
        ctrl:   '"Is the user accelerating, braking, stepping onto a slope, or preparing for stairs?"' },
      { icon:'◎︎', name:'Mid-Stance', pct:'31–50%',
        human:  'The center of mass passes directly over the support foot.',
        senses: 'Stable force plateau, foot orientation, walking speed, and sensor consistency.',
        ctrl:   '"Is the user maintaining speed? Is terrain changing? Has intent shifted?"' },
      { icon:'⇒︎', name:'Push-Off', pct:'50–62%',
        human:  'The trailing foot extends to propel the body forward and upward.',
        senses: 'Force shift toward toes, heel unloading, ankle rotation, and forward velocity.',
        ctrl:   '"How much propulsive assistance should be delivered before the foot leaves the ground?"' },
      { icon:'↗︎', name:'Swing', pct:'62–100%',
        human:  'The foot clears the ground and swings forward to prepare for next contact.',
        senses: 'IMU trajectory, estimated stride timing, foot clearance estimate, and step symmetry.',
        ctrl:   '"Where will contact happen next? Prepare for level ground, ramp, or staircase?"' },
      { icon:'↺︎', name:'Next Heel Strike', pct:'100%→0%',
        human:  'The cycle begins again. The foot contacts the ground and a new stride starts.',
        senses: 'Stride timing, step length, speed change, and bilateral coordination signals.',
        ctrl:   '"Should the system hold its current behavior, or adapt before the user even notices?"' }
    ],
    humanLabel:'Human', sensesLabel:'Robot senses', ctrlLabel:'Controller asks',
    facts: [
      { tag:'Control Theory', hook:'A step is not just a step.',  body:'Every stride is a real-time control loop: sense motion, infer intent, update state, and command the actuators — all before the next gait phase arrives.' },
      { tag:'Timing',         hook:'Intent has a deadline.',      body:'For wearable robots, a decision that is technically correct but arrives late still feels wrong. Latency is not a detail — it is part of the algorithm.' },
      { tag:'Design',         hook:'Good robotics feels invisible.', body:"The goal is not to make the robot feel powerful. The goal is to make the user feel natural, confident, and in control — even when the system is doing a lot underneath." }
    ],
    refHtml: 'Gait-phase terminology follows clinical convention (Rancho Los Amigos). Wearable robotics concepts draw from real-time prosthetic and exoskeleton control research. <a href="#projects">See Projects</a> for related work.'
  };

  var ZH = {
    intro: '一步之中，信息远比表面丰富。对可穿戴机器人而言，每一步都是一连串信号：意图、地形、平衡、时序与安全。我的工作，就是将这些信号实时转化为让用户感觉自然的控制决策。',
    loopLabel: '实时控制回路',
    feedbackLabel: '闭环反馈',
    loopNodes: [
      { name:'感知运动',   sub:'多模态传感器输入',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="2"/><path d="M9.2 9.2a4 4 0 0 0 0 5.6"/><path d="M14.8 9.2a4 4 0 0 1 0 5.6"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4"/><path d="M17.7 6.3a8 8 0 0 1 0 11.4"/></svg>' },
      { name:'推断意图',   sub:'坐 · 站 · 走 · 楼梯 · 加速 · 减速 · 停止等',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v4.5"/><path d="M11 12L6.8 17"/><path d="M13 12L17.2 17"/></svg>' },
      { name:'决策控制',   sub:'与运动同步的人在环辅助',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3"/></svg>' },
      { name:'辅助运动',   sub:'平稳、及时的电机输出',
        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="3"/><path d="M12 12h7"/><path d="M15.5 9.5l3.5 2.5-3.5 2.5"/></svg>' }
    ],
    telemetryTitle: '每次控制决策背后的实时信号',
    telemetryCaption: '示意信号，已作简化处理，仅供可视化参考。',
    signals: [
      { name:'脚部俯仰角', unit:'deg', color:'#4d8fff', d: PATH_PITCH },
      { name:'垂直地反力', unit:'%BW', color:'#00c2a0', d: PATH_VGRF  }
    ],
    phases: [
      { icon:'◉︎', name:'脚跟触地', pct:'0–12%',
        human:  '脚接触地面，体重开始向前腿转移。',
        senses: '冲击时序、力的快速上升、脚部朝向以及 IMU 角速度。',
        ctrl:   '"是否进入支撑相？这是正常步伐、突然停止，还是不平整地面？"' },
      { icon:'⬇︎', name:'负重期', pct:'12–31%',
        human:  '身体重量完全加载到支撑脚，用户将体重投入此步。',
        senses: '力的增长速率、IMU 俯仰变化、电机负载响应与荷载分布。',
        ctrl:   '"用户是在加速、减速、踏上坡道，还是准备上楼梯？"' },
      { icon:'◎︎', name:'站立中期', pct:'31–50%',
        human:  '质心通过支撑脚正上方。',
        senses: '稳定的力平台、脚部朝向、行走速度与传感器一致性。',
        ctrl:   '"用户是否在保持速度？地形是否在变化？意图是否已改变？"' },
      { icon:'⇒︎', name:'蹬地期', pct:'50–62%',
        human:  '后脚伸展发力，推动身体向前向上。',
        senses: '力向脚尖偏移、脚跟卸荷、踝关节旋转与前进速度。',
        ctrl:   '"在离地前，应施加多少推进辅助力？"' },
      { icon:'↗︎', name:'摆动期', pct:'62–100%',
        human:  '脚离地并向前摆动，准备下一次着地。',
        senses: 'IMU 轨迹、估算步幅时序、脚部离地间隙与步态对称性。',
        ctrl:   '"下一次着地在哪里？应为平地、坡道还是楼梯做准备？"' },
      { icon:'↺︎', name:'下次脚跟触地', pct:'100%→0%',
        human:  '新的步态周期开始，脚再次接触地面，下一步就此展开。',
        senses: '步频、步长、速度变化与双侧协调信号。',
        ctrl:   '"系统应保持当前行为，还是在用户察觉前主动适应？"' }
    ],
    humanLabel:'人体动作', sensesLabel:'机器人感知', ctrlLabel:'控制器决策',
    facts: [
      { tag:'控制理论', hook:'一步不只是一步。',               body:'每一步都是一个实时控制回路：感知运动、推断意图、更新状态、驱动执行器——在下一个步态阶段到来之前全部完成。' },
      { tag:'时序',     hook:'意图识别有时间窗口。',           body:'对可穿戴机器人而言，技术上正确但来得太晚的决策，体验依然很差。延迟不是细节——它是算法的一部分。' },
      { tag:'设计哲学', hook:'好的机器人系统，让你感觉不到它的存在。', body:'目标不是让机器人看起来强大，而是让用户感到自然、自信，并始终掌握主动——即便系统在背后默默承担着大量工作。' }
    ],
    refHtml: '步态阶段术语参考 Rancho Los Amigos 临床分类。概念来源于实时假肢与外骨骼控制研究。<a href="#projects">查看项目</a>了解相关工作。'
  };

  var d = isZh ? ZH : EN;

  // ─── DOM REFS ─────────────────────────────────────────────────────────────
  var introEl  = section.querySelector('.stepEngIntro');
  var loopEl   = section.querySelector('.controlLoop');
  var tlEl     = section.querySelector('.stepTimeline');
  var progFill = section.querySelector('.timelineProgressFill');
  var wavesEl  = section.querySelector('.signalWaves');
  var seHuman  = section.querySelector('#seHuman');
  var seSenses = section.querySelector('#seSenses');
  var seCtrl   = section.querySelector('#seCtrl');
  var factGrid = section.querySelector('.factGrid');
  var refEl    = section.querySelector('.stepRef');
  var stageEl  = section.querySelector('.seStage');

  if (loopEl) loopEl.innerHTML = '';
  if (tlEl) tlEl.innerHTML = '';
  if (wavesEl) wavesEl.innerHTML = '';
  if (factGrid) factGrid.innerHTML = '';

  // ─── INTRO ────────────────────────────────────────────────────────────────
  if (introEl) introEl.textContent = d.intro;

  // ─── CONTROL LOOP ─────────────────────────────────────────────────────────
  if (loopEl) {
    var loopLbl = document.createElement('div');
    loopLbl.className = 'seLoopLabel';
    loopLbl.textContent = d.loopLabel;
    loopEl.appendChild(loopLbl);

    var pipeline = document.createElement('div');
    pipeline.className = 'seLoopPipeline';

    var nodesRow = document.createElement('div');
    nodesRow.className = 'seLoopNodesRow';

    d.loopNodes.forEach(function(node) {
      var wrap = document.createElement('div');
      wrap.className = 'seLoopNodeWrap';

      var dot = document.createElement('div');
      dot.className = 'seLoopNodeDot';
      dot.setAttribute('aria-hidden', 'true');
      dot.innerHTML = node.icon;
      wrap.appendChild(dot);

      var nameEl = document.createElement('div');
      nameEl.className = 'seLoopNodeName';
      nameEl.textContent = node.name;
      wrap.appendChild(nameEl);

      var subEl = document.createElement('div');
      subEl.className = 'seLoopNodeSub';
      subEl.textContent = node.sub;
      wrap.appendChild(subEl);

      nodesRow.appendChild(wrap);
    });

    // Auto-cycle nodes, same pattern as phase buttons
    var nodeWraps = Array.prototype.slice.call(nodesRow.querySelectorAll('.seLoopNodeWrap'));
    var loopIdx = 0;
    var loopPaused = false;
    var loopTimer = null;

    function activateNode(idx) {
      loopIdx = ((idx % nodeWraps.length) + nodeWraps.length) % nodeWraps.length;
      nodeWraps.forEach(function(n) { n.classList.remove('seActive'); });
      nodeWraps[loopIdx].classList.add('seActive');
    }

    function startLoopAuto() {
      if (reduce) return;
      clearInterval(loopTimer);
      loopTimer = setInterval(function() {
        if (!loopPaused) activateNode(loopIdx + 1);
      }, 3000);
    }

    nodeWraps.forEach(function(w, i) {
      w.addEventListener('mouseenter', function() {
        loopPaused = true;
        activateNode(i);
      });
      w.addEventListener('mouseleave', function() {
        setTimeout(function() { loopPaused = false; }, 800);
      });
    });

    activateNode(0);
    startLoopAuto();

    pipeline.appendChild(nodesRow);

    var fb = document.createElement('div');
    fb.className = 'seLoopFeedback';
    fb.setAttribute('aria-hidden', 'true');
    fb.innerHTML =
      '<div class="seLoopFbLine"></div>' +
      '<span class="seLoopFbLabel">↺ ' + d.feedbackLabel + '</span>' +
      '<div class="seLoopFbLine seLoopFbLineR"></div>';
    pipeline.appendChild(fb);

    loopEl.appendChild(pipeline);
  }

  // ─── PHASE BUTTONS ────────────────────────────────────────────────────────
  var phaseBtns = [];
  if (tlEl) {
    d.phases.forEach(function(phase, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sePhase';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
      btn.setAttribute('aria-label', phase.name);
      btn.dataset.idx = i;
      btn.innerHTML =
        '<span class="sePhaseIcon" aria-hidden="true">' + phase.icon + '</span>' +
        '<span class="sePhaseName">' + phase.name + '</span>' +
        '<span class="sePhasePct">' + phase.pct + '</span>';
      tlEl.appendChild(btn);
      phaseBtns.push(btn);
      if (i < d.phases.length - 1) {
        var conn = document.createElement('div');
        conn.className = 'sePhaseConn';
        conn.setAttribute('aria-hidden', 'true');
        tlEl.appendChild(conn);
      }
    });
  }

  // ─── SIGNAL PLOTS ─────────────────────────────────────────────────────────
  var highlightRects = [];

  if (wavesEl) {
    if (reduce) {
      wavesEl.hidden = true;
    } else {
      var telWrap = document.createElement('div');
      telWrap.className = 'seTelemetry';

      var telTitle = document.createElement('div');
      telTitle.className = 'seTelemetryTitle';
      telTitle.textContent = d.telemetryTitle;
      telWrap.appendChild(telTitle);

      var telStack = document.createElement('div');
      telStack.className = 'seTelemetryStack';
      telWrap.appendChild(telStack);

      d.signals.forEach(function(sig) {
        var card = document.createElement('div');
        card.className = 'seSignalCard seSignalCardLarge';

        var hdr = document.createElement('div');
        hdr.className = 'seCardHeader';
        hdr.innerHTML =
          '<span class="seCardName">' + sig.name + '</span>' +
          '<span class="seCardUnit">' + sig.unit + '</span>';

        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + TW + ' ' + TH);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('class', 'seTraceSvg seTraceSvgLarge');

        // Phase boundary grid lines
        GRID_X.forEach(function(gx) {
          var gl = document.createElementNS(NS, 'line');
          gl.setAttribute('x1', gx); gl.setAttribute('x2', gx);
          gl.setAttribute('y1', 0);  gl.setAttribute('y2', TH);
          gl.setAttribute('stroke', 'currentColor');
          gl.setAttribute('stroke-width', '0.5');
          gl.setAttribute('opacity', '0.18');
          gl.setAttribute('stroke-dasharray', '3 3');
          svg.appendChild(gl);
        });

        // Phase highlight rects (updated on phase change; supports wrapped phases)
        var rectGroup = [];
        for (var hr = 0; hr < 2; hr++) {
          var rect = document.createElementNS(NS, 'rect');
          rect.setAttribute('x', '0');
          rect.setAttribute('y', '0');
          rect.setAttribute('width', '0');
          rect.setAttribute('height', TH);
          rect.setAttribute('rx', '3');
          rect.setAttribute('fill', PHASE_COLORS[0]);
          rect.setAttribute('opacity', '0');
          rect.setAttribute('class', 'seHighlightRect');
          svg.appendChild(rect);
          rectGroup.push(rect);
        }
        highlightRects.push(rectGroup);

        // Signal trace
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', sig.d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', sig.color);
        path.setAttribute('stroke-width', '1.8');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('class', 'seTracePath');
        svg.appendChild(path);

        card.appendChild(hdr);
        card.appendChild(svg);
        telStack.appendChild(card);
      });

      // Caption
      var caption = document.createElement('p');
      caption.className = 'seTelemetryCaption';
      caption.textContent = d.telemetryCaption;
      telWrap.appendChild(caption);

      wavesEl.appendChild(telWrap);
    }
  }

  // ─── RENDERED GAIT-PHASE STAGE ────────────────────────────────────────────
  var phaseImages = [];
  var stagePhaseEl = null, stagePctEl = null;
  var overlayEls = {};
  var activeStageIdx = 0;
  var STAGE_PHASES = [
    {
      image:'heel-strike.webp',
      contactPx:{x:650,y:780,rx:105,ry:16,opacity:.36}, focusPx:{x:650,y:765}, haloPx:{rx:76,ry:34}, callout:{x:88,y:74}, anchor:'start',
      label:isZh ? 'heel contact' : 'heel contact', air:false
    },
    {
      image:'loading.webp',
      contactPx:{x:678,y:782,rx:165,ry:16,opacity:.30}, focusPx:{x:678,y:765}, haloPx:{rx:118,ry:34}, callout:{x:82,y:72}, anchor:'start',
      label:isZh ? 'load transfer' : 'load transfer', air:false
    },
    {
      image:'mid-stance.webp',
      contactPx:{x:745,y:776,rx:132,ry:16,opacity:.28}, focusPx:{x:745,y:760}, haloPx:{rx:100,ry:32}, callout:{x:318,y:78}, anchor:'end',
      label:isZh ? 'stable support' : 'stable support', air:false
    },
    {
      image:'push-off.webp',
      contactPx:{x:770,y:770,rx:58,ry:16,opacity:.42}, focusPx:{x:770,y:758}, haloPx:{rx:62,ry:32}, callout:{x:318,y:74}, anchor:'end',
      label:isZh ? 'propulsion' : 'propulsion', air:false
    },
    {
      image:'swing.webp',
      contactPx:{x:582,y:768,rx:58,ry:14,opacity:0}, focusPx:{x:582,y:748}, haloPx:{rx:72,ry:34}, callout:{x:318,y:76}, anchor:'end',
      label:isZh ? 'clearance' : 'clearance', air:true
    },
    {
      image:'next-heel-strike.webp',
      contactPx:{x:650,y:780,rx:105,ry:16,opacity:.34}, focusPx:{x:650,y:765}, haloPx:{rx:76,ry:34}, callout:{x:82,y:76}, anchor:'start',
      label:isZh ? 'next contact' : 'next contact', air:false
    }
  ];

  function escStage(s) {
    return String(s).replace(/[&<>"']/g, function(ch) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch];
    });
  }

  function phaseImageSrc(file) {
    return gaitAssetRoot + 'public/assets/gait/' + file;
  }

  function imageFit(img) {
    var imgRect = img.getBoundingClientRect();
    var stageRect = stageEl.getBoundingClientRect();
    var naturalW = img.naturalWidth || 1400;
    var naturalH = img.naturalHeight || 900;
    var imageAspect = naturalW / naturalH;
    var boxAspect = imgRect.width / imgRect.height;
    var renderW = imgRect.width;
    var renderH = imgRect.height;
    var offsetX = 0;
    var offsetY = 0;
    if (boxAspect > imageAspect) {
      renderW = imgRect.height * imageAspect;
      offsetX = (imgRect.width - renderW) / 2;
    } else {
      renderH = imgRect.width / imageAspect;
      offsetY = (imgRect.height - renderH) / 2;
    }
    return {
      stageRect: stageRect,
      imgRect: imgRect,
      naturalW: naturalW,
      naturalH: naturalH,
      renderW: renderW,
      renderH: renderH,
      offsetX: offsetX,
      offsetY: offsetY,
      sx: 400 / stageRect.width,
      sy: 240 / stageRect.height
    };
  }

  function imagePointToStage(fit, point) {
    return {
      x: (fit.imgRect.left - fit.stageRect.left + fit.offsetX + point.x / fit.naturalW * fit.renderW) * fit.sx,
      y: (fit.imgRect.top - fit.stageRect.top + fit.offsetY + point.y / fit.naturalH * fit.renderH) * fit.sy
    };
  }

  function imageSizeToStage(fit, size) {
    return {
      x: size.x / fit.naturalW * fit.renderW * fit.sx,
      y: size.y / fit.naturalH * fit.renderH * fit.sy
    };
  }

  function overlayPath(focus, callout, anchor) {
    var side = anchor === 'end' ? -1 : 1;
    var c1x = focus.x + side * 38;
    var c1y = Math.max(92, focus.y - 34);
    var c2x = callout.x - side * 28;
    var c2y = callout.y + 8;
    return 'M' + focus.x.toFixed(1) + ',' + focus.y.toFixed(1) +
      ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) +
      ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) +
      ' ' + callout.x + ',' + callout.y;
  }

  function motionArcPath(focus, callout, anchor) {
    var side = anchor === 'end' ? -1 : 1;
    var startX = Math.max(56, Math.min(344, focus.x - side * 84));
    var endX = Math.max(56, Math.min(344, focus.x + side * 78));
    var y = Math.max(70, Math.min(116, focus.y - 128));
    var lift = Math.max(48, y - 28);
    return 'M' + startX.toFixed(1) + ',' + (y + 16).toFixed(1) +
      ' C' + (startX + side * 38).toFixed(1) + ',' + lift.toFixed(1) +
      ' ' + (endX - side * 28).toFixed(1) + ',' + lift.toFixed(1) +
      ' ' + endX.toFixed(1) + ',' + y.toFixed(1);
  }

  function renderPhaseImage(p, idx) {
    var phase = d.phases[idx] || d.phases[0];
    return '<img class="sePhaseImage' + (idx === 0 ? ' seImageActive' : '') + '" src="' + phaseImageSrc(p.image) + '" alt="' + escStage(phase.name + ' lower-limb gait phase render') + '" loading="' + (idx === 0 ? 'eager' : 'lazy') + '" decoding="async" data-phase="' + idx + '"/>';
  }

  if (stageEl) {
    var imageMarkup = STAGE_PHASES.map(renderPhaseImage).join('');
    stageEl.innerHTML =
      '<div class="seGridBackground" aria-hidden="true"></div>' +
      '<div class="seStageLabel">' +
        '<span class="seStagePhase"></span>' +
        '<span class="seStagePct"></span>' +
      '</div>' +
      '<div class="seImageStack" aria-hidden="true">' + imageMarkup + '</div>' +
      '<svg viewBox="0 0 400 240" class="seStageOverlay" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="seOverlayArc" d="M78 84 C120 44 198 38 280 70"/>' +
        '<line class="seOverlayGround" x1="34" y1="214" x2="366" y2="214"/>' +
        '<ellipse class="seOverlayContact" cx="226" cy="212" rx="28" ry="5"/>' +
        '<ellipse class="seOverlayHalo" cx="218" cy="204" rx="24" ry="14"/>' +
        '<circle class="seOverlayMarker" cx="218" cy="204" r="3.6"/>' +
        '<path class="seOverlayCallout" d="M218,204 C152,160 86,72 86,72"/>' +
        '<circle class="seOverlayDot" cx="86" cy="72" r="2.4"/>' +
        '<text class="seOverlayNote" x="86" y="62" text-anchor="start">heel contact</text>' +
      '</svg>';
    phaseImages = Array.prototype.slice.call(stageEl.querySelectorAll('.sePhaseImage'));
    stagePhaseEl = stageEl.querySelector('.seStagePhase');
    stagePctEl   = stageEl.querySelector('.seStagePct');
    overlayEls = {
      arc: stageEl.querySelector('.seOverlayArc'),
      ground: stageEl.querySelector('.seOverlayGround'),
      contact: stageEl.querySelector('.seOverlayContact'),
      halo: stageEl.querySelector('.seOverlayHalo'),
      marker: stageEl.querySelector('.seOverlayMarker'),
      callout: stageEl.querySelector('.seOverlayCallout'),
      dot: stageEl.querySelector('.seOverlayDot'),
      note: stageEl.querySelector('.seOverlayNote')
    };
    phaseImages.forEach(function(img) {
      img.addEventListener('load', function() { updateStageOverlay(activeStageIdx); });
    });
    window.addEventListener('resize', function() { updateStageOverlay(activeStageIdx); });
  }
  function updateStageOverlay(idx) {
    var p = STAGE_PHASES[idx] || STAGE_PHASES[0];
    var img = phaseImages[idx] || phaseImages[0];
    if (!stageEl || !img || !img.getBoundingClientRect) return;
    var fit = imageFit(img);
    var focus = imagePointToStage(fit, p.focusPx);
    var contact = imagePointToStage(fit, { x: p.contactPx.x, y: p.contactPx.y });
    var contactSize = imageSizeToStage(fit, { x: p.contactPx.rx, y: p.contactPx.ry });
    var haloSize = imageSizeToStage(fit, { x: p.haloPx.rx, y: p.haloPx.ry });
    var groundY = p.air ? Math.max(204, contact.y + 8) : contact.y + 5;
    if (overlayEls.arc) overlayEls.arc.setAttribute('d', motionArcPath(focus, p.callout, p.anchor));
    if (overlayEls.ground) {
      overlayEls.ground.setAttribute('y1', groundY.toFixed(1));
      overlayEls.ground.setAttribute('y2', groundY.toFixed(1));
    }
    if (overlayEls.contact) {
      overlayEls.contact.setAttribute('cx', contact.x.toFixed(1));
      overlayEls.contact.setAttribute('cy', contact.y.toFixed(1));
      overlayEls.contact.setAttribute('rx', Math.max(16, contactSize.x).toFixed(1));
      overlayEls.contact.setAttribute('ry', Math.max(3.5, contactSize.y).toFixed(1));
      overlayEls.contact.style.opacity = p.contactPx.opacity;
    }
    if (overlayEls.halo) {
      overlayEls.halo.setAttribute('cx', focus.x.toFixed(1));
      overlayEls.halo.setAttribute('cy', focus.y.toFixed(1));
      overlayEls.halo.setAttribute('rx', Math.max(18, haloSize.x).toFixed(1));
      overlayEls.halo.setAttribute('ry', Math.max(8, haloSize.y).toFixed(1));
    }
    if (overlayEls.marker) {
      overlayEls.marker.setAttribute('cx', focus.x.toFixed(1));
      overlayEls.marker.setAttribute('cy', focus.y.toFixed(1));
    }
    if (overlayEls.callout) overlayEls.callout.setAttribute('d', overlayPath(focus, p.callout, p.anchor));
    if (overlayEls.dot) {
      overlayEls.dot.setAttribute('cx', p.callout.x);
      overlayEls.dot.setAttribute('cy', p.callout.y);
    }
    if (overlayEls.note) {
      overlayEls.note.setAttribute('x', p.callout.x);
      overlayEls.note.setAttribute('y', p.callout.y - 10);
      overlayEls.note.setAttribute('text-anchor', p.anchor);
      overlayEls.note.textContent = p.label;
    }
  }
  function setPose(idx) {
    var p = STAGE_PHASES[idx] || STAGE_PHASES[0];
    activeStageIdx = idx;
    phaseImages.forEach(function(img, i) {
      img.classList.toggle('seImageActive', i === idx);
    });
    if (stageEl) {
      stageEl.classList.toggle('seAirborne', !!p.air);
      stageEl.classList.remove('sePoseChanged');
      if (!reduce) {
        void stageEl.offsetWidth;
        stageEl.classList.add('sePoseChanged');
      }
    }
    updateStageOverlay(idx);
    if (stagePhaseEl) stagePhaseEl.textContent = d.phases[idx].name;
    if (stagePctEl)   stagePctEl.textContent   = d.phases[idx].pct;
  }

  function updateDetail(phase) {
    if (seHuman)  seHuman.innerHTML  = '<h4>' + d.humanLabel  + '</h4><p>' + phase.human  + '</p>';
    if (seSenses) seSenses.innerHTML = '<h4>' + d.sensesLabel + '</h4><p>' + phase.senses + '</p>';
    if (seCtrl)   seCtrl.innerHTML   = '<h4>' + d.ctrlLabel   + '</h4><p><em>' + phase.ctrl + '</em></p>';
  }

  function updatePlots(idx) {
    var segments = PHASE_X[idx] || PHASE_X[0];
    var color = PHASE_COLORS[idx];
    var opac  = idx === 5 ? '0.13' : '0.16';
    highlightRects.forEach(function(group) {
      group.forEach(function(r, i) {
        var px = segments[i];
        r.setAttribute('x',       px ? px.x : 0);
        r.setAttribute('width',   px ? px.w : 0);
        r.setAttribute('fill',    color);
        r.setAttribute('opacity', px ? opac : 0);
      });
    });
  }

  // ─── INTERACTION ──────────────────────────────────────────────────────────
  var activeIdx = 0;
  var isPaused  = false;
  var autoTimer = null;

  function scrollPhaseInView(btn) {
    if (!tlEl || !btn) return;
    var left  = btn.offsetLeft;
    var right = left + btn.offsetWidth;
    var vis   = tlEl.clientWidth;
    var scr   = tlEl.scrollLeft;
    if (left < scr)             tlEl.scrollLeft = left - 8;
    else if (right > scr + vis) tlEl.scrollLeft = right - vis + 8;
  }

  function selectPhase(idx, isInit) {
    activeIdx = ((idx % d.phases.length) + d.phases.length) % d.phases.length;
    phaseBtns.forEach(function(btn, i) {
      var active = i === activeIdx;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.setAttribute('tabindex',      active ? '0'    : '-1');
    });
    updateDetail(d.phases[activeIdx]);
    updatePlots(activeIdx);
    setPose(activeIdx);
    if (progFill) progFill.style.width = ((activeIdx + 1) / d.phases.length * 100) + '%';
    if (!isInit) scrollPhaseInView(phaseBtns[activeIdx]);
  }

  function startAuto() {
    if (reduce) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(function() {
      if (!isPaused) selectPhase(activeIdx + 1);
    }, 3000);
  }

  phaseBtns.forEach(function(btn, i) {
    btn.addEventListener('click',      function() { isPaused = true; selectPhase(i); });
    btn.addEventListener('mouseenter', function() { isPaused = true; selectPhase(i); });
    btn.addEventListener('mouseleave', function() { setTimeout(function() { isPaused = false; }, 800); });
    btn.addEventListener('keydown',    function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); selectPhase(i + 1); phaseBtns[activeIdx].focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); selectPhase(i - 1); phaseBtns[activeIdx].focus();
      }
    });
  });

  // ─── FACT CARDS ───────────────────────────────────────────────────────────
  if (factGrid) {
    d.facts.forEach(function(fact) {
      var card = document.createElement('div');
      card.className = 'seFactCard';
      card.innerHTML =
        '<div class="seFactTag">'  + fact.tag  + '</div>' +
        '<div class="seFactHook">' + fact.hook + '</div>' +
        '<p class="seFactBody">'   + fact.body + '</p>';
      factGrid.appendChild(card);
    });
  }

  if (refEl) refEl.innerHTML = d.refHtml;

  selectPhase(0, true);
  startAuto();
})();
