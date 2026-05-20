(function initGaitWheel(){
  const svg = document.querySelector('.gaitWheel');
  if (!svg) return;

  const isZh = window.location.pathname.includes('/zh/');

  const phases = [
    {
      en: { name: 'Heel Strike', desc: 'Impact detection via IMU spike; controller pre-loads damping to absorb load.' },
      zh: { name: '脚跟触地', desc: 'IMU 检测冲击信号，控制器预载阻尼以吸收冲击力。' },
      pct: 0.10, color: '#2b6cff'
    },
    {
      en: { name: 'Loading', desc: 'Knee flexion controlled by impedance model; weight transfers onto leading leg.' },
      zh: { name: '负重期', desc: '阻抗模型控制膝关节屈曲，体重逐步转移至前导腿。' },
      pct: 0.20, color: '#00a8e8'
    },
    {
      en: { name: 'Mid-Stance', desc: 'Center of pressure migrates forward; trunk balance is the primary concern.' },
      zh: { name: '站立中期', desc: '压力中心向前迁移，躯干平衡控制为主要目标。' },
      pct: 0.20, color: '#00c2a0'
    },
    {
      en: { name: 'Push-Off', desc: 'Ankle plantarflexion generates propulsion; powered prosthesis adds torque here.' },
      zh: { name: '蹬地期', desc: '踝关节跖屈产生推进力，动力假肢在此阶段施加额外力矩。' },
      pct: 0.10, color: '#f59e0b'
    },
    {
      en: { name: 'Swing', desc: 'Foot clears ground via hip flexion; intent recognition predicts next terrain.' },
      zh: { name: '摆动期', desc: '髋关节屈曲完成离地摆动，意图识别预判下一步地形。' },
      pct: 0.40, color: '#7c3aed'
    }
  ];

  const cx = 200, cy = 200, outerR = 168, innerR = 64;
  const GAP = 0.018;

  const nameEl = document.querySelector('.gaitPhaseName');
  const descEl = document.querySelector('.gaitPhaseDesc');

  if (nameEl) nameEl.textContent = isZh ? '悬停选择阶段' : 'Hover a phase';
  if (descEl) descEl.textContent = isZh ? '每个阶段需要不同的控制策略。' : 'Each phase requires a different control strategy.';

  function polar(angle, r) {
    return { x: cx + r * Math.cos(angle - Math.PI / 2), y: cy + r * Math.sin(angle - Math.PI / 2) };
  }

  function arcPath(sa, ea, r1, r2) {
    const s = sa + GAP / 2, e = ea - GAP / 2;
    const p1 = polar(s, r1), p2 = polar(e, r1);
    const p3 = polar(e, r2), p4 = polar(s, r2);
    const large = (e - s) > Math.PI ? 1 : 0;
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${r1} ${r1} 0 ${large} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${r2} ${r2} 0 ${large} 0 ${p4.x} ${p4.y}`,
      'Z'
    ].join(' ');
  }

  const paths = [];
  let angle = 0;

  phases.forEach((phase, i) => {
    const start = angle;
    const end = angle + phase.pct * Math.PI * 2;
    const mid = (start + end) / 2;
    const label = isZh ? phase.zh.name : phase.en.name;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', arcPath(start, end, outerR, innerR));
    path.setAttribute('fill', phase.color);
    path.setAttribute('opacity', '0.72');
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'button');
    path.setAttribute('aria-label', label);
    path.style.cursor = 'pointer';
    path.style.transition = 'opacity 140ms ease, transform 140ms ease';
    path.style.transformBox = 'view-box';
    path.style.transformOrigin = '50% 50%';

    // Label text — skip for narrow wedges (< 15%)
    if (phase.pct >= 0.15) {
      const lp = polar(mid, (outerR + innerR) / 2);
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', lp.x);
      txt.setAttribute('y', lp.y);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('font-size', '12');
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('fill', '#fff');
      txt.setAttribute('pointer-events', 'none');
      txt.textContent = label;
      svg.appendChild(txt);
    }

    function activate() {
      paths.forEach(p => { p.setAttribute('opacity', '0.45'); p.style.transform = 'scale(1)'; });
      path.setAttribute('opacity', '1');
      path.style.transform = 'scale(1.06)';
      if (nameEl) nameEl.textContent = isZh ? phase.zh.name : phase.en.name;
      if (descEl) descEl.textContent = isZh ? phase.zh.desc : phase.en.desc;
    }

    path.addEventListener('mouseenter', activate);
    path.addEventListener('focus', activate);
    path.addEventListener('click', activate);
    path.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });

    svg.appendChild(path);
    paths.push(path);
    angle = end;
  });

  // Center label
  ['100%', isZh ? '步态周期' : 'Gait Cycle'].forEach((line, i) => {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', cx);
    t.setAttribute('y', cy + (i === 0 ? -8 : 10));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('font-size', '11');
    t.setAttribute('font-weight', '700');
    t.setAttribute('fill', '#5b6b82');
    t.setAttribute('pointer-events', 'none');
    t.textContent = line;
    svg.appendChild(t);
  });
})();
