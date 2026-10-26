/* Careers page: past and present team as floating circles, edited in Admin → Team.
   Circles squash, stretch and wobble when dragged, like the Gallery. Hover (or tap on phones)
   shows the person's details as text beside the photo: name, what they worked as, what they do now, social links. */
(() => {
  const wall = document.getElementById('team');
  if (!wall) return;
  const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co', SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* where each circle sits: x / y in % of the page, w = width in vw, z = how much it follows the mouse, m = hidden on phones */
  const SLOTS = [
    { x: 4, y: 16, w: 7.5, z: 14 }, { x: 27, y: 9, w: 6.2, z: 8 }, { x: 47, y: 4, w: 5, z: 18, m: 1 }, { x: 66, y: 12, w: 7, z: 10 },
    { x: 86, y: 7, w: 5.6, z: 6 }, { x: 80, y: 33, w: 8.4, z: 22 }, { x: 8, y: 50, w: 4.6, z: 12, m: 1 }, { x: 14, y: 76, w: 7.4, z: 18 },
    { x: 33, y: 80, w: 4.4, z: 9 }, { x: 52, y: 88, w: 6.6, z: 14 }, { x: 71, y: 80, w: 8.6, z: 24 }, { x: 92, y: 66, w: 4.6, z: 8, m: 1 },
    { x: 90, y: 92, w: 5.2, z: 12, m: 1 }, { x: -1, y: 92, w: 5.4, z: 10, m: 1 }
  ];
  const TINTS = [['#2b2b2b', '#ff4a12'], ['#1f9e8e', '#f0c9a0'], ['#a0623a', '#2d3cff'], ['#3a2f2a', '#f3f1ec'], ['#6f7f88', '#ff7a1a'], ['#c8331b', '#ffd166'], ['#cbb9a2', '#3a2f2a'], ['#20262b', '#e86a92']];
  const PLACEHOLDER = Array.from({ length: 10 }, () => ({ name: 'Team member' }));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const person = (b, f) => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="100" height="100" fill="${b}"/><circle cx="50" cy="40" r="17" fill="#3b2418"/><path d="M33 34a17 14 0 0 1 34 0z" fill="${f}"/><path d="M16 100c2-26 16-40 34-40s32 14 34 40z" fill="${f}"/></svg>`;
  const SITES = { 'instagram.com': 'Instagram', 'x.com': 'X', 'twitter.com': 'X', 'linkedin.com': 'LinkedIn', 'behance.net': 'Behance', 'dribbble.com': 'Dribbble', 'github.com': 'GitHub', 'tiktok.com': 'TikTok', 'youtube.com': 'YouTube', 'medium.com': 'Medium', 'read.cv': 'Read.cv', 'threads.net': 'Threads', 'vimeo.com': 'Vimeo' };
  /* social links: one per line, either "https://…" or "Label | https://…" */
  const links = t => String(t || '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 6).map(l => {
    let [label, url] = l.includes('|') ? l.split('|').map(s => s.trim()) : ['', l];
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) url = (url.includes('@') && !url.includes('/') ? 'mailto:' : 'https://') + url;
    if (!label) { try { const h = new URL(url).hostname.replace(/^www\./, ''); label = SITES[h] || (url.startsWith('mailto:') ? 'Email' : h); } catch (e) { label = 'Link'; } }
    return { label, url };
  });

  function render(list) {
    wall.innerHTML = list.slice(0, SLOTS.length).map((p, i) => {
      const s = SLOTS[i], [b, f] = TINTS[i % TINTS.length], ls = links(p.links);
      const side = s.x > 62 ? ' lft' : '';                         // near the right edge: text goes on the left
      return `<figure class="ph tm${s.m ? ' hide-m' : ''}${side}" style="--x:${s.x}%;--y:${s.y}%;--w:${s.w}vw;--z:${s.z / 10};--i:${i};--t:${5 + (i % 4) * 1.3}s;--dl:${-i * 1.1}s;--bg:${b}">
        <span class="ph__drag"><span class="ph__in">${p.photo_url ? `<img src="${esc(p.photo_url)}" alt="${esc(p.name)}" loading="lazy" draggable="false">` : person(b, f)}</span></span>
        <figcaption class="tm__info"><b>${esc(p.name)}</b>${p.role ? `<span class="tm__f"><i>Worked as</i>${esc(p.role)}</span>` : ''}${p.currently ? `<span class="tm__f"><i>Currently</i>${esc(p.currently)}</span>` : ''}${ls.length ? `<span class="tm__f"><i>Socials</i><span class="tm__links">${ls.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</span></span>` : ''}</figcaption>
      </figure>`;
    }).join('');
    wall.querySelectorAll('.tm').forEach(bindDrag);
  }

  /* the Gallery's squish: stretch along the way it moves, squash when grabbed, wobble back when let go */
  let dragging = false;
  function bindDrag(fig) {
    const el = fig.querySelector('.ph__drag');
    const st = { x: 0, y: 0, s: 0, v: 0, a: 0, target: 0, raf: 0 };
    let held = null;
    const draw = () => {
      el.style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.a}rad) scale(${1 + st.s}, ${1 - st.s * 0.8}) rotate(${-st.a}rad)`;
      fig.style.setProperty('--dx', st.x + 'px'); fig.style.setProperty('--dy', st.y + 'px');
    };
    const step = () => {
      st.v += (st.target - st.s) * 0.18; st.v *= 0.74; st.s += st.v;
      draw();
      if (held || Math.abs(st.v) > 0.0005 || Math.abs(st.target - st.s) > 0.0005) st.raf = requestAnimationFrame(step);
      else { st.raf = 0; st.s = st.target; draw(); }
    };
    const kick = () => { if (!reduce && !st.raf) st.raf = requestAnimationFrame(step); };
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      held = { px: e.clientX, py: e.clientY, t: performance.now(), t0: performance.now(), moved: 0 };
      dragging = true; fig.classList.add('held');
      st.target = 0; st.a = Math.PI / 2; st.v -= 0.09;
      kick();
    });
    el.addEventListener('pointermove', e => {
      if (!held) return;
      const now = performance.now(), dx = e.clientX - held.px, dy = e.clientY - held.py, dt = Math.max(8, now - held.t);
      st.x += dx; st.y += dy; held.moved += Math.abs(dx) + Math.abs(dy);
      const speed = Math.hypot(dx, dy) / dt;
      if (speed > 0.05) st.a = Math.atan2(dy, dx);
      st.target = Math.min(0.32, speed * 0.12);
      held = { ...held, px: e.clientX, py: e.clientY, t: now };
      if (reduce) draw(); else kick();
    });
    const drop = e => {
      if (!held) return;
      const tap = e && e.type === 'pointerup' && held.moved < 8 && performance.now() - held.t0 < 450;
      if (tap) {                                                   // a tap shows or hides the details (phones)
        const was = fig.classList.contains('open');
        wall.querySelectorAll('.tm.open').forEach(o => o.classList.remove('open'));
        if (!was) fig.classList.add('open');
      }
      held = null; st.target = 0; st.v -= st.s * 0.5;
      fig.classList.remove('held');
      setTimeout(() => { dragging = false; }, 0);
      kick();
    };
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
    el.addEventListener('lostpointercapture', drop);
  }
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.tm')) wall.querySelectorAll('.tm.open').forEach(o => o.classList.remove('open')); });

  render(PLACEHOLDER);
  fetch(`${SB_URL}/rest/v1/sc_team?select=*&published=eq.true&order=sort.asc,created_at.asc`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : []).then(rows => { if (rows.length) render(rows); }).catch(() => {});

  /* the faces lean away from the mouse, the nearer ones more */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce)
    addEventListener('pointermove', e => {
      if (document.body.dataset.page !== 'careers' || dragging) return;
      wall.style.setProperty('--mx', ((innerWidth / 2 - e.clientX) / innerWidth * 70).toFixed(2));
      wall.style.setProperty('--my', ((innerHeight / 2 - e.clientY) / innerHeight * 70).toFixed(2));
    });
})();
