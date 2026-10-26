/* =========================================================================
   PRODUCTS: placeholder names and details; replace with the real ones.
   mark: an SVG drawn in a 24x24 box, filled with currentColor.
   anim: which tiny animation sits beside the description (see ANIMS).
   ========================================================================= */
const PRODUCTS = [
  { name: 'Ledgerly', tag: 'Bookkeeping for small businesses', cat: 'Fintech', plat: 'Web, iOS', year: '2024', status: 'Live', anim: 'bars',
    desc: 'Invoices, expenses and cash flow in one place, built for owners who would rather run their business than their spreadsheets.',
    bg: '#ff4a12', fg: '#0b0b0b', url: '#',
    mark: '<path d="M12 2a10 10 0 1 0 0 20V2Z"/><circle cx="17" cy="12" r="3"/>' },
  { name: 'Haul', tag: 'Dispatch and delivery tracking', cat: 'Logistics', plat: 'Android, Web', year: '2023', status: 'Live', anim: 'route',
    desc: 'Assigns riders, tracks every package in real time and settles payouts automatically at the end of the day.',
    bg: '#2d3cff', fg: '#f3f1ec', url: '#',
    mark: '<path d="M3 20 12 4l9 16H3Z"/>' },
  { name: 'Kin', tag: 'Family health records', cat: 'Health', plat: 'iOS, Android', year: '2025', status: 'Beta', anim: 'pulse',
    desc: 'One shared, private record for the whole family: appointments, prescriptions and reminders that actually get read.',
    bg: '#ff9cc9', fg: '#0b0b0b', url: '#',
    mark: '<circle cx="8" cy="12" r="5"/><circle cx="17" cy="12" r="3.5"/>' },
  { name: 'Stall', tag: 'Online storefronts for market traders', cat: 'Commerce', plat: 'Web, WhatsApp', year: '2024', status: 'Live', anim: 'shop',
    desc: 'A shop link in minutes. Take orders and payments through the chat apps customers already use.',
    bg: '#0b0b0b', fg: '#f3f1ec', url: '#',
    mark: '<path d="M3 9h18v11H3zM5 4h14l2 5H3z"/>' },
  { name: 'Pulse', tag: 'Audio news in local languages', cat: 'Media', plat: 'iOS, Android', year: '2025', status: 'Building', anim: 'audio',
    desc: 'Short daily audio briefings, written by editors and voiced in the languages people speak at home.',
    bg: '#f3f1ec', fg: '#2d3cff', url: '#',
    mark: '<rect x="3" y="9" width="3" height="6" rx="1.5"/><rect x="8.5" y="5" width="3" height="14" rx="1.5"/><rect x="14" y="2" width="3" height="20" rx="1.5"/><rect x="19.5" y="8" width="3" height="8" rx="1.5"/>' },
  { name: 'Grid', tag: 'Solar usage monitoring', cat: 'Energy', plat: 'IoT, Web', year: '2025', status: 'Pilot', anim: 'solar',
    desc: 'Live readings from home solar kits, so owners and installers can see problems before the lights go out.',
    bg: '#ffb21e', fg: '#0b0b0b', url: '#',
    mark: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><circle cx="17" cy="17" r="4"/>' }
];

/* CONTENT now comes from the admin (southcircle.io/admin), stored in Supabase.
   The lists in this file are only a fallback if Supabase can't be reached. */
const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co';
const SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';

/* GALLERY: the life we live outside building products.
   Each photo takes the next slot below (x / y: position on the page in %, w: width in vw, z: how much it follows the mouse, m: hidden on phones). */
const GALLERY = [
  { src: '', alt: 'Studio session',      x: -2, y: 22, w: 7,   ar: 1,    z: 14, art: 'music',  bg: '#2b2b2b', fg: '#ff4a12' },
  { src: '', alt: 'Sunday plates',       x: 28, y: 15, w: 7.5, ar: 1.55, z: 8,  art: 'swirl',  bg: '#1f9e8e', fg: '#f0c9a0' },
  { src: '', alt: 'Team portrait',       x: 36, y: 2,  w: 8,   ar: 1,    z: 22, art: 'person', bg: '#a0623a', fg: '#2d3cff' },
  { src: '', alt: 'Dinner with friends', x: 62, y: 11, w: 5.6, ar: 1,    z: 10, art: 'table',  bg: '#3a2f2a', fg: '#f3f1ec' },
  { src: '', alt: 'Weekend drive',       x: 89, y: 4,  w: 4.4, ar: 1.55, z: 6,  art: 'road',   bg: '#5b6b74', fg: '#f3f1ec', m: 1 },
  { src: '', alt: 'Courtside',           x: 79, y: 30, w: 9.6, ar: .95,  z: 26, art: 'ball',   bg: '#6f7f88', fg: '#ff7a1a' },
  { src: '', alt: 'Shades on',           x: 7,  y: 52, w: 3.8, ar: 1.15, z: 12, art: 'sun',    bg: '#c8331b', fg: '#ffd166' },
  { src: '', alt: 'Long ride',           x: 15, y: 79, w: 7.2, ar: 1.15, z: 18, art: 'bike',   bg: '#e9e6df', fg: '#0b0b0b' },
  { src: '', alt: 'Breakfast',           x: 29, y: 75, w: 3.8, ar: 1.3,  z: 9,  art: 'cup',    bg: '#cbb9a2', fg: '#3a2f2a', m: 1 },
  { src: '', alt: 'Gallery visit',       x: 70, y: 86, w: 10,  ar: 1,    z: 24, art: 'flower', bg: '#20262b', fg: '#e86a92' },
  { src: '', alt: 'Morning light',       x: 96, y: 68, w: 3.4, ar: .8,   z: 8,  art: 'person', bg: '#d9cfc3', fg: '#0b0b0b', m: 1 },
  { src: '', alt: 'Beach day',           x: 53, y: 96, w: 6.4, ar: 1.5,  z: 12, art: 'wave',   bg: '#7fb3c8', fg: '#f3f1ec' },
  { src: '', alt: 'Matchday',            x: 47, y: 24, w: 3.4, ar: 1,    z: 7,  art: 'ball',   bg: '#2d3cff', fg: '#f3f1ec', m: 1 },
  { src: '', alt: 'Out of office',       x: 88, y: 56, w: 4.2, ar: 1.2,  z: 10, art: 'road',   bg: '#ff4a12', fg: '#0b0b0b' }
];
const SLOTS = GALLERY.map(({ x, y, w, z, m }) => ({ x, y, w, z, m }));

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();
  const svg = m => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${m}</svg>`;

  /* ---- tiny product animations ---- */
  const rays = [...Array(8)].map((_, i) => {
    const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${(36 + c * 18).toFixed(1)}" y1="${(38 + s * 18).toFixed(1)}" x2="${(36 + c * 25).toFixed(1)}" y2="${(38 + s * 25).toFixed(1)}"/>`;
  }).join('');
  const ROUTE = 'M16 96 C 36 40, 58 104, 74 58 S 102 34, 104 22';
  const ANIMS = {
    bars: `<svg viewBox="0 0 120 120"><g class="an-bars"><rect x="20" y="34" width="16" height="64" style="--d:0s;--lo:.3"/><rect x="43" y="34" width="16" height="64" style="--d:.18s;--lo:.15"/><rect x="66" y="34" width="16" height="64" style="--d:.36s;--lo:.45"/><rect x="89" y="34" width="16" height="64" style="--d:.54s;--lo:.2"/></g><line x1="12" y1="98.5" x2="112" y2="98.5" stroke="currentColor" stroke-width="2"/></svg>`,
    route: `<svg viewBox="0 0 120 120"><path d="${ROUTE}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5" opacity=".6"/><circle cx="16" cy="96" r="4" fill="currentColor"/><circle cx="104" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle r="7" fill="currentColor"><animateMotion dur="3.2s" repeatCount="indefinite" path="${ROUTE}" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".6 0 .4 1"/></circle></svg>`,
    pulse: `<svg viewBox="0 0 120 120"><path class="an-ecg" pathLength="100" d="M6 66 H34 L42 46 L52 90 L62 30 L70 66 H114" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path class="an-beat" d="M96 24c-3-5-11-4-11 3 0 6 11 12 11 12s11-6 11-12c0-7-8-8-11-3z" fill="currentColor"/></svg>`,
    shop: `<svg viewBox="0 0 120 120"><path d="M22 52 H98 V102 H22 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14 52 L26 28 H94 L106 52" fill="none" stroke="currentColor" stroke-width="2.5"/><g class="an-drop"><rect x="32" y="74" width="16" height="16" style="--d:0s"/><circle cx="60" cy="82" r="8" style="--d:.35s"/><path d="M76 90 L84 74 L92 90 Z" style="--d:.7s"/></g></svg>`,
    audio: `<svg viewBox="0 0 120 120"><g class="an-eq">${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${14 + i * 14}" y="24" width="8" height="72" rx="4" style="--d:${(i * 0.13 % 0.6).toFixed(2)}s"/>`).join('')}</g></svg>`,
    solar: `<svg viewBox="0 0 120 120"><g class="an-sun"><circle cx="36" cy="38" r="12" fill="currentColor"/><g stroke="currentColor" stroke-width="3" stroke-linecap="round">${rays}</g></g><rect x="56" y="70" width="46" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="102" y="78" width="5" height="10" fill="currentColor"/><rect class="an-fill" x="60" y="74" width="38" height="18" fill="currentColor"/></svg>`
  };

  /* ---- IMAGINE MORE: real text on a 3D ring ---- */
  const ring = document.getElementById('ring');
  const cv = document.createElement('canvas').getContext('2d');
  function buildRing() {
    const W = Math.max(300, Math.min(innerWidth * (innerWidth < 700 ? 0.86 : 0.56), 1500));
    const R = W * 0.44;                                   // ring radius in px, drawn at true size (no scaling = sharp)
    const text = (ring.dataset.text || 'IMAGINE MORE ').repeat(+ring.dataset.reps || 1);
    const f0 = 100;
    cv.font = `340 ${f0}px Geist, system-ui, sans-serif`;
    const w0 = [...text].map(c => cv.measureText(c).width + f0 * 0.04);
    const circ0 = w0.reduce((a, b) => a + b, 0);
    const k = (2 * Math.PI * R) / circ0;                   // font size that wraps the text exactly once around
    const fs = f0 * k, widths = w0.map(w => w * k);
    ring.style.setProperty('--w', W + 'px');
    ring.style.setProperty('--h', W * 0.62 + 'px');
    ring.style.setProperty('--fs', fs.toFixed(2) + 'px');
    ring.style.setProperty('--r', R.toFixed(2) + 'px');
    ring.style.setProperty('--dur', (reduce ? 80 : 7) + 's');
    let acc = 0, html = '';
    [...text].forEach((c, i) => {
      const a = ((acc + widths[i] / 2) / (2 * Math.PI * R)) * 360;
      acc += widths[i];
      html += `<span style="--a:${a.toFixed(3)}deg">${c === ' ' ? '&nbsp;' : c}</span>`;
    });
    ring.innerHTML = `<div class="ring__tilt" style="transform:rotateZ(18deg) rotateX(-16deg)"><div class="ring__spin">${html}</div></div>`;
  }
  buildRing();

  /* ring leans toward the mouse a little */
  if (fine && !reduce) addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    ring.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  });

  /* ---- gallery: scattered photos (placeholder drawings until real photos are added) ---- */
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ART = {
    music: (b, f) => `<rect width="100" height="100" fill="${b}"/>${[...Array(16)].map((_, i) => `<rect x="${18 + (i % 4) * 17}" y="${22 + Math.floor(i / 4) * 15}" width="12" height="10" rx="1.5" fill="${i % 5 === 0 ? f : '#555'}"/>`).join('')}`,
    swirl: (b, f) => `<rect width="100" height="100" fill="${b}"/><path d="M30 80c20-6 40-20 30-34s-34-4-22 10 40 6 36-18" fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"/>`,
    person: (b, f) => `<rect width="100" height="100" fill="${b}"/><circle cx="50" cy="40" r="17" fill="#3b2418"/><path d="M33 34a17 14 0 0 1 34 0z" fill="${f}"/><path d="M16 100c2-26 16-40 34-40s32 14 34 40z" fill="${f}"/>`,
    table: (b, f) => `<rect width="100" height="100" fill="${b}"/><ellipse cx="50" cy="66" rx="44" ry="26" fill="${f}"/><circle cx="36" cy="64" r="11" fill="#d8d2c8"/><circle cx="36" cy="64" r="6" fill="#8a5a2b"/><rect x="58" y="24" width="7" height="34" rx="3" fill="#6b2a1a"/><rect x="70" y="30" width="6" height="28" rx="3" fill="#c9a24a"/>`,
    road: (b, f) => `<rect width="100" height="100" fill="${b}"/><path d="M40 100 L48 40 L52 40 L60 100z" fill="${f}" opacity=".85"/><path d="M50 96v-8M50 80v-8M50 64v-6" stroke="${b}" stroke-width="2"/><circle cx="78" cy="22" r="9" fill="${f}" opacity=".7"/>`,
    ball: (b, f) => `<rect width="100" height="100" fill="${b}"/><circle cx="62" cy="46" r="20" fill="${f}"/><path d="M42 46h40M62 26v40M48 32c8 8 8 20 0 28M76 32c-8 8-8 20 0 28" fill="none" stroke="#2b1a10" stroke-width="1.6"/><path d="M14 100c4-24 12-36 22-36s16 12 18 36z" fill="#d7dde0"/>`,
    sun: (b, f) => `<rect width="100" height="100" fill="${b}"/><circle cx="50" cy="52" r="24" fill="#5a1a10"/><rect x="28" y="44" width="18" height="10" rx="4" fill="${f}"/><rect x="54" y="44" width="18" height="10" rx="4" fill="${f}"/><path d="M46 49h8" stroke="${f}" stroke-width="2"/>`,
    bike: (b, f) => `<rect width="100" height="100" fill="${b}"/><circle cx="28" cy="70" r="16" fill="none" stroke="${f}" stroke-width="3"/><circle cx="74" cy="70" r="16" fill="none" stroke="${f}" stroke-width="3"/><path d="M28 70l16-26h24l6 26M44 44l10 26 14-26" fill="none" stroke="${f}" stroke-width="3"/><circle cx="52" cy="24" r="6" fill="${f}"/><path d="M50 30l-8 14h18" fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round"/>`,
    cup: (b, f) => `<rect width="100" height="100" fill="${b}"/><ellipse cx="50" cy="62" rx="36" ry="18" fill="#f3f1ec"/><path d="M34 40h32v18a16 10 0 0 1-32 0z" fill="${f}"/><path d="M66 46c8 0 8 10 0 10" fill="none" stroke="${f}" stroke-width="3"/><circle cx="76" cy="66" r="6" fill="#a8752e"/>`,
    flower: (b, f) => `<rect width="100" height="100" fill="${b}"/>${[[30, 40, f], [56, 30, '#f4a259'], [70, 52, '#7fb3c8'], [44, 58, '#f3f1ec'], [24, 66, '#c8331b'], [62, 72, f]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="10" fill="${c}"/><circle cx="${x}" cy="${y}" r="3.5" fill="${b}"/>`).join('')}<path d="M48 100V70M30 100l14-22M70 100L58 80" stroke="#3f6b3a" stroke-width="3"/>`,
    wave: (b, f) => `<rect width="100" height="100" fill="${b}"/><rect y="62" width="100" height="38" fill="#e8d7b5"/><path d="M0 60c12-8 22 8 34 0s22-8 34 0 22 8 32 0v8H0z" fill="${f}"/><circle cx="76" cy="24" r="10" fill="#ffd166"/>`,
    palette: (b, f) => `<rect width="100" height="100" fill="${b}"/><path d="M50 18c-20 0-34 14-34 32 0 16 12 30 28 30 6 0 8-4 6-8s0-8 6-8h8c10 0 20-6 20-18 0-16-14-28-34-28z" fill="${f}"/>${[[32, 40, '#ff4a12'], [46, 30, '#ffd166'], [62, 34, '#2d3cff'], [70, 48, '#ff9cc9']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`).join('')}`,
    code: (b, f) => `<rect width="100" height="100" fill="${b}"/>${[[20, 26, 34], [26, 36, 44], [26, 46, 28], [32, 56, 38], [26, 66, 22], [20, 76, 30]].map(([x, y, w], i) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="${i % 3 === 1 ? '#ff4a12' : f}" opacity="${i % 3 === 2 ? .5 : 1}"/>`).join('')}`,
    phone: (b, f) => `<rect width="100" height="100" fill="${b}"/><rect x="32" y="14" width="36" height="72" rx="7" fill="${f}"/><rect x="36" y="22" width="28" height="54" rx="3" fill="${b}"/><circle cx="50" cy="42" r="8" fill="${f}"/><rect x="40" y="56" width="20" height="4" rx="2" fill="${f}"/>`,
    group: (b, f) => `<rect width="100" height="100" fill="${b}"/><circle cx="28" cy="50" r="10" fill="${f}"/><path d="M10 100c0-22 8-34 18-34s18 12 18 34z" fill="${f}"/><circle cx="72" cy="50" r="10" fill="${f}"/><path d="M54 100c0-22 8-34 18-34s18 12 18 34z" fill="${f}"/><circle cx="50" cy="40" r="12" fill="#ff4a12"/><path d="M28 100c0-26 10-42 22-42s22 16 22 42z" fill="#ff4a12"/>`
  };
  const life = document.getElementById('life');
  let dragging = false, galList = [];
  function buildGallery(list) {
    life.innerHTML = list.map((g, i) => {
      const slot = SLOTS[i % SLOTS.length], alt = esc(g.alt);
      return `
    <figure class="ph${slot.m ? ' hide-m' : ''}" style="--x:${slot.x}%;--y:${slot.y}%;--w:${slot.w}vw;--z:${slot.z / 10};--i:${i};--t:${5 + (i % 4) * 1.3}s;--dl:${-i * 1.1}s;--bg:${esc(g.bg)}">
      <span class="ph__drag"><span class="ph__in">${g.src ? `<img src="${esc(g.src)}" alt="${alt}" draggable="false">` : `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${alt}">${(ART[g.art] || ART.wave)(esc(g.bg), esc(g.fg))}</svg>`}</span></span>
      ${g.alt ? `<figcaption>${alt}</figcaption>` : ''}
    </figure>`;
    }).join('');
    galList = list;
    life.querySelectorAll('.ph').forEach(bindDrag);
  }
  /* drag a photo: it stretches along the way it moves, squashes when grabbed, and wobbles back when let go */
  function bindDrag(fig, idx) {
    const el = fig.querySelector('.ph__drag');
    const st = { x: 0, y: 0, s: 0, v: 0, a: 0, target: 0, raf: 0 };
    let held = null;
    const draw = () => {
      el.style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.a}rad) scale(${1 + st.s}, ${1 - st.s * 0.8}) rotate(${-st.a}rad)`;
      fig.style.setProperty('--dx', st.x + 'px'); fig.style.setProperty('--dy', st.y + 'px');
    };
    const step = () => {
      st.v += (st.target - st.s) * 0.18; st.v *= 0.74; st.s += st.v;   // spring: overshoots a little = wobble
      draw();
      if (held || Math.abs(st.v) > 0.0005 || Math.abs(st.target - st.s) > 0.0005) st.raf = requestAnimationFrame(step);
      else { st.raf = 0; st.s = st.target; draw(); }
    };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(step); };
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      held = { px: e.clientX, py: e.clientY, t: performance.now(), t0: performance.now(), moved: 0 };
      dragging = true; fig.classList.add('held');
      st.target = 0; st.a = Math.PI / 2; st.v -= 0.09;              // squash on grab
      kick();
    });
    el.addEventListener('pointermove', e => {
      if (!held) return;
      const now = performance.now(), dx = e.clientX - held.px, dy = e.clientY - held.py, dt = Math.max(8, now - held.t);
      st.x += dx; st.y += dy; held.moved += Math.abs(dx) + Math.abs(dy);
      const speed = Math.hypot(dx, dy) / dt;                          // px per ms
      if (speed > 0.05) st.a = Math.atan2(dy, dx);
      st.target = Math.min(0.32, speed * 0.12);                       // stretch with speed
      held = { ...held, px: e.clientX, py: e.clientY, t: now };
      kick();
    });
    const drop = e => {
      if (!held) return;
      const tap = e && e.type === 'pointerup' && held.moved < 8 && performance.now() - held.t0 < 450;
      if (tap) setTimeout(() => openLb(idx), 30); // a tap (not a drag) opens the photo
      held = null; st.target = 0; st.v -= st.s * 0.5;                 // let go: snap back with a jiggle
      fig.classList.remove('held');
      setTimeout(() => { dragging = false; }, 0);
      kick();
    };
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
    el.addEventListener('lostpointercapture', drop);
  }
  buildGallery(GALLERY);

  /* ---- gallery lightbox: the circle grows into the full photo, in colour ---- */
  const lb = document.createElement('dialog');
  lb.className = 'lb';
  lb.innerHTML = `<div class="lb__bg"></div><div class="lb__img"></div><p class="lb__cap"></p>
    <button class="lb__btn lb__close" type="button" aria-label="Close">×</button>
    <button class="lb__btn lb__prev" type="button" aria-label="Previous photo">←</button>
    <button class="lb__btn lb__next" type="button" aria-label="Next photo">→</button>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('.lb__img'), lbCap = lb.querySelector('.lb__cap');
  let lbAt = -1, lbBusy = false;
  const EASE = 'cubic-bezier(.19,1,.22,1)';
  const figAt = i => life.querySelectorAll('.ph')[i];
  function lbBox(i) { // where the photo sits when open
    const src = figAt(i)?.querySelector('img');
    const r = src && src.naturalWidth ? src.naturalWidth / src.naturalHeight : 1;
    const maxW = Math.min(innerWidth * (innerWidth < 700 ? 0.92 : 0.8), 1200), maxH = innerHeight * 0.74;
    let w = maxW, h = w / r; if (h > maxH) { h = maxH; w = h * r; }
    return { w, h, x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - 12 };
  }
  function lbFill(i) {
    const g = galList[i], fig = figAt(i), b = lbBox(i);
    lbImg.innerHTML = fig.querySelector('.ph__in').innerHTML;
    lbImg.querySelector('img')?.removeAttribute('loading');
    Object.assign(lbImg.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px', background: g.bg || '#222' });
    lbCap.textContent = g.alt || '';
    lb.querySelector('.lb__prev').hidden = lb.querySelector('.lb__next').hidden = galList.length < 2;
    return b;
  }
  function fromCircle(i, b) { // keyframe that matches the circle on the page
    const c = figAt(i).querySelector('.ph__in').getBoundingClientRect();
    const m = Math.min(b.w, b.h), k = c.width / m;
    const dx = c.left + c.width / 2 - (b.x + b.w / 2), dy = c.top + c.height / 2 - (b.y + b.h / 2);
    return { transform: `translate(${dx}px, ${dy}px) scale(${k})`, clipPath: `inset(${(b.h - m) / 2}px ${(b.w - m) / 2}px round ${m / 2}px)`, filter: 'grayscale(1)' };
  }
  const OPEN = { transform: 'none', clipPath: 'inset(0px 0px round 18px)', filter: 'grayscale(0)' };
  function openLb(i) {
    if (lb.open || lbBusy || !galList[i]) return;
    lbAt = i; lbBusy = true;
    const b = lbFill(i);
    lb.showModal(); lb.classList.add('on');
    figAt(i).classList.add('lb-src');
    const a = lbImg.animate([fromCircle(i, b), OPEN], { duration: reduce ? 1 : 750, easing: EASE, fill: 'both' });
    a.onfinish = () => { lbBusy = false; };
  }
  function closeLb() {
    if (!lb.open || lbBusy) return;
    lbBusy = true; lb.classList.remove('on');
    const b = lbBox(lbAt);
    const a = lbImg.animate([OPEN, fromCircle(lbAt, b)], { duration: reduce ? 1 : 600, easing: EASE, fill: 'both' });
    a.onfinish = () => { figAt(lbAt)?.classList.remove('lb-src'); lb.close(); lbImg.getAnimations().forEach(x => x.cancel()); lbBusy = false; };
  }
  function stepLb(d) {
    if (!lb.open || lbBusy || galList.length < 2) return;
    lbBusy = true;
    const out = lbImg.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 40}px) scale(.96)` }], { duration: 220, easing: 'ease-in', fill: 'both' });
    out.onfinish = () => {
      figAt(lbAt)?.classList.remove('lb-src');
      lbAt = (lbAt + d + galList.length) % galList.length;
      figAt(lbAt).classList.add('lb-src');
      lbImg.getAnimations().forEach(x => x.cancel());
      lbFill(lbAt);
      const inn = lbImg.animate([{ opacity: 0, transform: `translateX(${d * 40}px) scale(.96)`, clipPath: OPEN.clipPath }, { opacity: 1, transform: 'none', clipPath: OPEN.clipPath }], { duration: 420, easing: EASE, fill: 'both' });
      inn.onfinish = () => { lbBusy = false; };
    };
  }
  lb.addEventListener('click', e => {
    if (e.target.closest('.lb__prev')) return stepLb(-1);
    if (e.target.closest('.lb__next')) return stepLb(1);
    closeLb();
  });
  lb.addEventListener('cancel', e => { e.preventDefault(); closeLb(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') stepLb(1); if (e.key === 'ArrowLeft') stepLb(-1); });
  let lbX = null;
  lb.addEventListener('touchstart', e => { lbX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (lbX === null) return; const dx = e.changedTouches[0].clientX - lbX; lbX = null; if (Math.abs(dx) > 50) { e.preventDefault(); stepLb(dx < 0 ? 1 : -1); } });

  /* photos lean away from the mouse, the nearer ones more */
  if (fine && !reduce) addEventListener('pointermove', e => {
    if (document.body.dataset.page !== 'gallery' || dragging) return;
    life.style.setProperty('--mx', ((innerWidth / 2 - e.clientX) / innerWidth * 70).toFixed(2));
    life.style.setProperty('--my', ((innerHeight / 2 - e.clientY) / innerHeight * 70).toFixed(2));
  });

  /* ---- product orbit ---- */
  const orbit = document.getElementById('orbit');
  const markHTML = p => p.icon ? `<img src="${esc(p.icon)}" alt="" draggable="false">` : svg(p.mark);
  let items = [];
  function buildOrbit(list) {
    orbit.innerHTML = '';
    items = list.map((p, i) => {
      const b = document.createElement('button');
      b.className = 'prod';
      b.setAttribute('aria-label', `${p.name}: ${p.tag}`);
      b.innerHTML = `<span class="prod__mark" style="--bg:${esc(p.bg)};--fg:${esc(p.fg)}">${markHTML(p)}</span><span class="prod__name">${esc(p.name)}</span>`;
      orbit.appendChild(b);
      const it = { el: b, p, off: (i / list.length) * Math.PI * 2 };
      b.addEventListener('pointerenter', () => { hovering++; b.classList.add('hot'); orbit.classList.add('hovering'); cursor.classList.add('big'); });
      b.addEventListener('pointerleave', () => { hovering = Math.max(0, hovering - 1); b.classList.remove('hot'); if (!hovering) orbit.classList.remove('hovering'); cursor.classList.remove('big'); });
      b.addEventListener('focus', () => { hovering++; b.classList.add('hot'); orbit.classList.add('hovering'); });
      b.addEventListener('blur', () => { hovering = Math.max(0, hovering - 1); b.classList.remove('hot'); if (!hovering) orbit.classList.remove('hovering'); });
      b.addEventListener('click', () => openProduct(p));
      return it;
    });
    hovering = 0; orbit.classList.remove('hovering');
  }
  let theta = 0, speed = 0, target = reduce ? 0.0006 : 0.0032, hovering = 0;
  const TILT = 0;
  const say = document.querySelector('#products .say');
  function layout() {
    const narrow = innerWidth < 700;
    const ps = Math.max(44, Math.min(72, innerWidth * 0.05));
    orbit.style.setProperty('--ps', ps + 'px');
    const t = say.getBoundingClientRect();
    if (narrow) {                                            // phones: circles orbit in the space under the sentence
      const top = t.bottom + ps * 0.6, avail = innerHeight - top - 56;
      return { R: innerWidth * 0.36, ry: Math.max(24, avail / 2 - ps * 0.7), cy: top + avail / 2 };
    }
    const R = Math.min((t.width / 2 + ps) * 1.3, innerWidth / 2 - ps - 48);
    const ry = Math.min((t.height / 2 + ps) * 1.7, innerHeight / 2 - ps - 40);
    return { R, ry, cy: t.top + t.height / 2 };              // a ring that clears the text on every side
  }
  let geo = layout();
  function tick() {
    speed += ((hovering ? 0 : target) - speed) * 0.06;     // ease to a stop on hover
    theta += speed;
    const cx = innerWidth / 2;
    for (const it of items) {
      const a = theta + it.off;
      const x0 = Math.cos(a) * geo.R, y0 = Math.sin(a) * geo.ry;
      const x = x0 * Math.cos(TILT) - y0 * Math.sin(TILT);
      const y = x0 * Math.sin(TILT) + y0 * Math.cos(TILT);
      const depth = Math.sin(a);                               // -1 back … 1 front
      const sc = 0.72 + 0.28 * (depth + 1) / 2;
      it.el.style.transform = `translate3d(${cx + x}px, ${geo.cy + y}px, 0) scale(${sc})`;
      it.el.style.zIndex = depth > 0 ? 25 : 15;                // pass in front of / behind the ring
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const cursor = document.getElementById('cursor');
  buildOrbit(PRODUCTS);

  /* ---- product dialog ---- */
  const dlg = document.getElementById('pd');
  const $ = id => document.getElementById(id);
  function openProduct(p) {
    if (window.SC_SHOWCASE) {                                    // the full-screen showcase (showcase.js)
      cursor.classList.remove('big');
      return window.SC_SHOWCASE(p, items.map(i => i.p), { mark: markHTML, anim: k => ANIMS[k] || '' },
        () => { hovering = 0; orbit.classList.remove('hovering'); items.forEach(i => i.el.classList.remove('hot')); });
    }
    $('pdCard').style.cssText = `--bg:${p.bg};--fg:${p.fg}`;
    $('pdLogo').innerHTML = markHTML(p);
    $('pdAnim').innerHTML = ANIMS[p.anim] || '';
    $('pdStatus').textContent = p.status;
    $('pdName').textContent = p.name;
    $('pdTag').textContent = p.tag;
    $('pdDesc').textContent = p.desc;
    $('pdCat').textContent = p.cat;
    $('pdPlat').textContent = p.plat;
    $('pdYear').textContent = p.year;
    $('pdLink').href = p.url || '#';
    $('pdLink').style.display = p.url && p.url !== '#' ? '' : 'none';
    dlg.showModal();
    cursor.classList.remove('big');
  }
  $('pdClose').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { hovering = 0; orbit.classList.remove('hovering'); items.forEach(i => i.el.classList.remove('hot')); $('pdAnim').innerHTML = ''; });

  { const s = document.createElement('script'); s.src = '/showcase.js?t=' + (window.SCV || ''); document.body.appendChild(s); }

  /* ---- custom cursor ---- */
  if (fine) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    (function follow() {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---- One section, pages change on scroll ---- */
  const stage = document.getElementById('stage');
  const pages = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('[data-go]')];
  const progress = document.querySelector('.progress');
  const counter = document.getElementById('counter');
  const pad = n => String(n).padStart(2, '0');
  pages.forEach((p, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', p.dataset.name);
    b.onclick = () => go(i);
    progress.appendChild(b);
  });
  const dots = [...progress.children];

  let cur = 0, locked = false, loading = true;
  function setTheme(page) {
    const dark = page.hasAttribute('data-dark');
    stage.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    document.body.dataset.page = page.id;
    orbit.classList.toggle('on', page.id === 'products');
  }
  function move(dir) { go(cur + dir); }
  function go(n) {
    n = Math.max(0, Math.min(pages.length - 1, n));
    if (n === cur || locked || dlg.open) return;
    locked = true;
    const down = n > cur;
    const from = pages[cur], to = pages[n];
    from.classList.remove('is-active');
    from.classList.add('is-leaving');
    from.classList.toggle('to-below', !down);
    to.classList.toggle('from-above', !down);
    void to.offsetWidth;
    to.classList.add('is-active');
    requestAnimationFrame(() => to.classList.remove('from-above'));
    setTheme(to);
    setTimeout(() => from.classList.remove('is-leaving', 'to-below'), 700);
    setTimeout(() => { locked = false; }, reduce ? 300 : 1000);
    cur = n;
    sync();
    history.replaceState(null, '', to.id === 'home' ? '/' : '/' + to.id);   // clean addresses: southcircle.io/products
  }
  function sync() {
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
    links.forEach(l => l.classList.toggle('on', +l.dataset.go === cur && cur > 0));
    counter.textContent = pad(cur + 1);
  }
  links.forEach(l => l.addEventListener('click', e => { e.preventDefault(); go(+l.dataset.go); }));

  let acc = 0, accTimer;
  addEventListener('wheel', e => {
    if (dlg.open || msgDlg.open || lb.open || loading) return;
    e.preventDefault();
    if (locked) return;
    acc += e.deltaY;
    clearTimeout(accTimer);
    accTimer = setTimeout(() => { acc = 0; }, 160);
    if (Math.abs(acc) > 40) { move(acc > 0 ? 1 : -1); acc = 0; }
  }, { passive: false });

  let ty = null;
  addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', e => { if (!dlg.open && !msgDlg.open) e.preventDefault(); }, { passive: false });
  addEventListener('touchend', e => {
    if (ty === null || dlg.open || msgDlg.open || lb.open || loading) return;
    const dy = ty - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50 && !dragging) move(dy > 0 ? 1 : -1);
    ty = null;
  });

  addEventListener('keydown', e => {
    if (dlg.open || msgDlg.open || lb.open || loading || e.target.closest('input,textarea,select,button')) return;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); move(1); }
    if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); move(-1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(pages.length - 1);
  });

  /* the page comes from the address (/products); old links with #products still work and get tidied */
  const want = (location.pathname.replace(/^\/+|\/+$/g, '') || location.hash.slice(1)).toLowerCase();
  const start = pages.findIndex(p => p.id === want);
  if (location.hash && !/^#(access_token|error)/.test(location.hash)) history.replaceState(null, '', start > 0 ? '/' + pages[start].id : '/');
  else if (want && start < 0) history.replaceState(null, '', '/');
  if (start > 0) {
    pages[0].classList.remove('is-active');
    pages[start].classList.add('is-active');
    cur = start;
  }
  setTheme(pages[cur]);
  sync();
  if (document.fonts) document.fonts.ready.then(() => { buildRing(); geo = layout(); });

  /* ---- services: hover or tap a service to show it; they also step through on their own ---- */
  const svxRows = [...document.querySelectorAll('.svx__row')], svxPanes = [...document.querySelectorAll('.svx__pane')];
  let svxAt = 0, svxHold = false, svxPicked = false;
  const setSvc = n => {
    svxAt = n;
    svxRows.forEach((r, i) => { r.classList.toggle('on', i === n); r.setAttribute('aria-pressed', i === n); });
    svxPanes.forEach((p, i) => p.classList.toggle('on', i === n));
  };
  svxRows.forEach((r, i) => {
    r.addEventListener('click', () => { svxPicked = true; setSvc(i); });
    if (fine) r.addEventListener('pointerenter', () => setSvc(i));
  });
  const svxBody = document.querySelector('.svx__body');
  if (svxBody) {
    svxBody.addEventListener('pointerenter', () => { svxHold = true; });
    svxBody.addEventListener('pointerleave', () => { svxHold = false; });
    if (!reduce) setInterval(() => { if (document.body.dataset.page === 'services' && !svxHold && !svxPicked && svxRows.length) setSvc((svxAt + 1) % svxRows.length); }, 4500);
  }

  /* ---- live content from the admin (Supabase); the lists above stay if it can't load ---- */
  const sb = (path, opts = {}) => fetch(`${SB_URL}/rest/v1/${path}`, { ...opts, headers: { apikey: SB_KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  /* product logo style from the admin: in colour, or neutral black / white until hovered */
  const setLogos = v => { if (v === 'black' || v === 'white') orbit.dataset.logos = v; else delete orbit.dataset.logos; };
  try { setLogos(localStorage.getItem('sc-logos')); } catch (e) {}
  sb('sc_settings?select=key,value').then(r => r.ok ? r.json() : []).then(rows => {
    const v = (rows.find(x => x.key === 'product_logos') || {}).value || 'colour';
    setLogos(v); try { localStorage.setItem('sc-logos', v); } catch (e) {}
  }).catch(() => {});
  const trustList = document.querySelector('.trust__list');
  function buildClients(list) {
    trustList.innerHTML = list.map(c => {
      const inner = c.logo_url ? `<img src="${esc(c.logo_url)}" alt="${esc(c.name)}" style="filter:var(--logo-filter,brightness(0))">` : esc(c.name);
      return `<li>${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${inner}</a>` : inner}</li>`;
    }).join('');
    trustList.closest('.trust').hidden = !list.length;
  }
  (async () => {
    try {
      const get = t => sb(`${t}?select=*&published=eq.true&order=sort.asc,created_at.asc`).then(r => { if (!r.ok) throw r.status; return r.json(); });
      const [prods, gal, cli] = await Promise.all([get('sc_products'), get('sc_gallery'), get('sc_clients')]);
      buildOrbit(prods.map(p => ({ name: p.name, tag: p.tag, desc: p.description, cat: p.category, plat: p.platforms, year: p.year, status: p.status,
        anim: p.anim, bg: p.bg, fg: p.fg, url: p.url, mark: p.mark, icon: p.icon_url, media: p.media, highlights: p.highlights })));
      buildGallery(gal.map(g => ({ src: g.src, alt: g.caption, art: g.art || 'wave', bg: g.bg, fg: g.fg })));
      buildClients(cli);
      geo = layout();
    } catch (err) { /* keep the built-in content */ }
  })();

  /* ---- contact form: messages land in the admin inbox ---- */
  const msgDlg = document.getElementById('msg'), msgForm = document.getElementById('msgForm'), msgNote = document.getElementById('msgNote');
  document.querySelectorAll('[data-msg]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); msgForm.hidden = false; msgNote.textContent = ''; msgDlg.showModal(); }));
  document.getElementById('msgClose').onclick = () => msgDlg.close();
  msgDlg.addEventListener('click', e => { if (e.target === msgDlg) msgDlg.close(); });
  msgForm.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(msgForm);
    if (f.get('website')) return;                                   // bots fill the hidden field
    const btn = msgForm.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const r = await sb('sc_messages', { method: 'POST', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ name: f.get('name').trim(), email: f.get('email').trim(), company: (f.get('company') || '').trim(), budget: f.get('budget') || '', message: f.get('message').trim() }) });
      if (!r.ok) throw new Error(r.status);
      msgForm.reset(); msgForm.hidden = true;
      msgNote.textContent = 'Thanks, we’ve got your message. We’ll be in touch soon.';
    } catch (err) {
      msgNote.textContent = 'That didn’t send. Please try again, or email hello@southcircle.io.';
    }
    btn.disabled = false; btn.textContent = 'Send message';
  });

  /* ---- colour themes: picked before the intro on a first visit, remembered for next time ---- */
  const THEMES = { light: '#f3f1ec', dark: '#0d0d0d', orange: '#ff4a12', green: '#1ea866', blue: '#2d3cff', lime: '#57ff1a', custom: '' };
  const tp = document.getElementById('tp'), tpOpts = [...tp.querySelectorAll('.tp__o')];
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let saved = null; try { saved = localStorage.getItem('sc-theme'); } catch (e) {}
  if (!(saved in THEMES)) saved = null;
  /* custom colour: the picked colour is the background; text and pictures use darker / lighter shades of it */
  const tpC = tp.querySelector('.tp__c'), tpColor = tp.querySelector('.tp__color'), tintFn = [...document.querySelectorAll('#tint-custom feFuncR, #tint-custom feFuncG, #tint-custom feFuncB')];
  const rgbOf = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const hexOf = c => '#' + c.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const mixC = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
  const lumOf = c => { const [r, g, b] = c.map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  function customOf(hex) {
    const p = rgbOf(hex), dark = mixC(p, [0, 0, 0], 0.88), light = mixC(p, [1, 1, 1], 0.93), inkDark = lumOf(p) > 0.18;
    return { hex, tint: [dark, p, light], v: { '--paper': hex, '--ink': hexOf(inkDark ? dark : light), '--accent': inkDark ? hexOf(light) : '#ffffff' } };
  }
  let custom = null; try { custom = JSON.parse(localStorage.getItem('sc-custom')); } catch (e) {}
  if (!custom || !custom.hex) { custom = null; if (saved === 'custom') saved = null; }
  if (custom) { tpColor.value = custom.hex; tpC.style.setProperty('--b', custom.hex); }
  let chosen = saved || 'blue';
  const root = document.documentElement;
  function applyTheme(t, c = custom) {
    if (t === 'custom' && !c) t = 'blue';
    ['--paper', '--ink', '--accent'].forEach(k => root.style.removeProperty(k));
    if (t === 'custom') {
      Object.entries(c.v).forEach(([k, v]) => root.style.setProperty(k, v));
      tintFn.forEach((f, i) => f.setAttribute('tableValues', c.tint.map(x => x[i].toFixed(3)).join(' ')));
    }
    root.dataset.theme = t; themeMeta.content = t === 'custom' ? c.hex : THEMES[t];
    /* client logos: solid black or white, matching the theme's text colour */
    const ink = getComputedStyle(root).getPropertyValue('--ink').trim();
    root.style.setProperty('--logo-filter', /^#[0-9a-f]{6}$/i.test(ink) && lumOf(rgbOf(ink)) > 0.5 ? 'brightness(0) invert(1)' : 'brightness(0)');
  }
  applyTheme(chosen);
  const markChosen = () => { tpOpts.forEach(o => o.setAttribute('aria-pressed', o.dataset.theme === chosen)); tpC.classList.toggle('is-on', chosen === 'custom'); };
  function openPicker() {
    loading = true; markChosen();
    tp.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => tp.classList.add('on')));
    setTimeout(() => (tp.querySelector('[aria-pressed="true"]') || tpOpts[0]).focus({ preventScroll: true }), 300);
  }
  let introNext = null; // set while the intro waits for a first pick
  function closePicker() {
    applyTheme(chosen);
    try { localStorage.setItem('sc-theme', chosen); if (custom) localStorage.setItem('sc-custom', JSON.stringify(custom)); } catch (e) {}
    tp.classList.remove('on');
    const next = introNext; introNext = null;
    setTimeout(() => { tp.hidden = true; if (next) next(); else loading = false; }, 500);
  }
  tpOpts.forEach(o => {
    o.addEventListener('pointerenter', () => applyTheme(o.dataset.theme));
    o.addEventListener('focus', () => applyTheme(o.dataset.theme));
    o.addEventListener('click', () => { chosen = o.dataset.theme; closePicker(); });
  });
  tp.querySelector('.tp__opts').addEventListener('pointerleave', () => { if (document.activeElement !== tpColor) applyTheme(document.activeElement.closest?.('.tp__o')?.dataset.theme || chosen); });
  tpC.addEventListener('pointerenter', () => { if (custom) applyTheme('custom'); });
  tpColor.addEventListener('input', () => { custom = customOf(tpColor.value); tpC.style.setProperty('--b', custom.hex); applyTheme('custom'); });
  tpColor.addEventListener('change', () => { custom = customOf(tpColor.value); chosen = 'custom'; closePicker(); });
  tp.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); closePicker(); }
    if (['ArrowRight', 'ArrowLeft'].includes(e.key)) { const i = tpOpts.indexOf(document.activeElement); if (i > -1) { e.preventDefault(); tpOpts[(i + (e.key === 'ArrowRight' ? 1 : tpOpts.length - 1)) % tpOpts.length].focus(); } }
  });
  tp.addEventListener('click', e => { if (e.target === tp) closePicker(); });
  document.getElementById('themeBtn').addEventListener('click', openPicker);

  /* ---- loader ---- */
  (() => {
    const L = document.getElementById('loader');
    const intro = [...L.querySelectorAll('.ld__intro span')];
    const blue = L.querySelector('.ld__blue'), bg = L.querySelector('.ld__bg');
    const WALL = ['code', 'design', 'data', 'cloud', 'APIs', 'apps', 'payments', 'AI', 'uptime', 'craft', 'care', 'research', 'security', 'scale', 'empathy', 'iteration', 'platforms', 'patience'];
    const CYCLE = ['code', 'design', 'data', 'empathy', 'APIs', 'cloud', 'craft', 'AI', 'payments', 'patience', 'uptime', 'care', 'imagination'];
    const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
    const line = () => shuffle([...WALL, ...WALL]).join(' ');
    const fs = parseFloat(getComputedStyle(bg).fontSize) || 60;
    let n = Math.ceil(innerHeight / (fs * 1.04)) + 2; if (n % 2 === 0) n++;
    const mid = Math.floor(n / 2);
    bg.innerHTML = [...Array(n)].map((_, i) => i === mid
      ? `<div class="ld__mid"><span class="ld__l"><span>${line()}</span></span><span class="ld__word">code</span><span class="ld__r">${line()}</span></div>`
      : `<div class="ld__row" style="--t:${7 + i % 4 * 2}s">${line()}</div>`).join('');
    const word = bg.querySelector('.ld__word');
    let done = false;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      L.classList.add('out');
      loading = false;
      setTimeout(() => L.remove(), 1200);
    }
    L.addEventListener('click', finish);
    addEventListener('keydown', () => { if (!done && blue.classList.contains('on')) finish(); });
    function play() {
      if (reduce) { later(finish, 300); return; }
      let t = 350;
      intro.forEach(s => { later(() => s.classList.add('on'), t); t += 260; });
      t += 450;
      later(() => blue.classList.add('on'), t);
      CYCLE.forEach((w, i) => { later(() => { word.textContent = w; }, t); t += i === CYCLE.length - 1 ? 750 : 200; });
      later(finish, t);
    }
    if (saved) play(); else { introNext = play; openPicker(); } // first visit: pick a colour, then the intro plays in it
  })();

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { buildRing(); geo = layout(); }, 150); });
})();
