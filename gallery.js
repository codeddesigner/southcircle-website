/* Gallery page: move the cursor and photos spill out behind it in a 3D trail, newest on top and blurred
   as it flies in; stop and the trail folds away. Click a photo to open it big. Phones (no hover) get a
   gentle automatic trail instead. Photos come from Admin → Gallery. */
(() => {
  const page = document.getElementById('gallery');
  if (!page) return;
  const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co', SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const here = () => document.body.dataset.page === 'gallery';

  const trail = document.createElement('div'); trail.className = 'gt'; trail.setAttribute('aria-hidden', 'true');
  page.append(trail);

  /* ---------- photos ---------- */
  /* your gallery photos first; until there are enough of them, stand-in photos fill the gaps */
  const FILL = 24;
  const stand = i => `https://picsum.photos/seed/southcircle${i}/${i % 3 ? 480 : 640}/${i % 3 ? 620 : 440}`;
  let pics = [], at = 0;
  const load = src => new Promise(res => { const im = new Image(); im.decoding = 'async'; im.onload = () => res({ src, r: im.naturalHeight / im.naturalWidth || 1.25 }); im.onerror = () => res(null); im.src = src; });
  fetch(`${SB_URL}/rest/v1/sc_gallery?select=src&published=eq.true&order=sort.asc,created_at.asc`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : []).catch(() => []).then(async rows => {
      const own = rows.filter(g => g.src).map(g => g.src);
      const extra = Array.from({ length: Math.max(0, FILL - own.length) }, (_, i) => stand(i + 1));
      const mine = (await Promise.all(own.map(load))).filter(Boolean);
      const more = (await Promise.all(extra.map(load))).filter(Boolean);
      for (let i = more.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [more[i], more[j]] = [more[j], more[i]]; }
      pics = [];                                                        // spread your photos evenly through the stand-ins
      const step = mine.length ? Math.max(1, Math.round((mine.length + more.length) / mine.length)) : 0;
      while (mine.length || more.length) pics.push(step && pics.length % step === 0 && mine.length ? mine.shift() : (more.shift() || mine.shift()));
    });

  /* ---------- the trail: every card is moved by hand each frame, so it's smooth and nothing fades ---------- */
  const cards = [];
  let lastMove = 0, z = 1, running = false, prev = null;
  const MAX = 38;
  const size = () => Math.max(innerWidth < 700 ? 110 : 150, Math.min(330, innerWidth * 0.19));
  function spawn(x, y) {
    if (!pics.length) return;
    const pi = at++ % pics.length, p = pics[pi], w = size(), h = Math.min(w * 1.4, Math.max(w * 0.68, w * p.r));
    const el = document.createElement('div'); el.className = 'gt__c';
    el.style.cssText = `width:${w}px;height:${h}px;z-index:${z++}`; el.dataset.i = pi;
    el.innerHTML = `<img src="${p.src}" alt="" draggable="false">`;
    const from = prev || { x, y, s: 0.6 };                              // each new card shoots out from the one before it
    const c = { el, w, h, x: from.x, y: from.y, s: from.s ?? 1, tx: x, ty: y, ts: 1, d: 0, td: 0, rz: (Math.random() - 0.5) * 4, blur: -1, dead: false };
    place(c, trail.clientWidth || innerWidth);                          // in position before it's shown, so it never flashes in the corner
    trail.appendChild(el);
    cards.push(c); prev = c;
    cards.forEach((k, i) => { k.td = -(cards.length - 1 - i) * 16; });  // older cards sink back into the page
    while (cards.filter(k => !k.dead).length > MAX) kill(cards.find(k => !k.dead));
    run();
  }
  function kill(c) {                                                    // leave by shooting into the next card and shrinking away
    if (c.dead) return;
    c.dead = true;
    const i = cards.indexOf(c), next = cards.slice(i + 1).find(k => !k.dead);
    if (next) { c.tx = next.tx; c.ty = next.ty; }
    c.ts = 0;
  }
  const place = (c, W) => {
    const ry = ((c.x / W) - 0.5) * -38;
    c.el.style.transform = `translate3d(${c.x - c.w / 2}px, ${c.y - c.h / 2}px, ${c.d}px) rotateY(${ry}deg) rotateZ(${c.rz}deg) scale(${Math.max(0.001, c.s)})`;
  };
  function frame() {
    const W = trail.clientWidth || innerWidth;
    for (let i = cards.length - 1; i >= 0; i--) {
      const c = cards[i], k = c.dead ? 0.28 : 0.2;
      const dx = (c.tx - c.x) * k, dy = (c.ty - c.y) * k;
      c.x += dx; c.y += dy; c.s += (c.ts - c.s) * (c.dead ? 0.3 : 0.2); c.d += (c.td - c.d) * 0.12;
      const speed = Math.hypot(dx, dy) + Math.abs(c.ts - c.s) * 60;
      const blur = Math.min(14, speed * 0.32);
      place(c, W);
      const b = Math.round(blur * 2) / 2;
      if (b !== c.blur) { c.el.style.filter = b > 0.4 ? `blur(${b}px)` : 'none'; c.blur = b; }
      if (c.dead && c.s < 0.03) { c.el.remove(); cards.splice(i, 1); if (prev === c) prev = null; }
    }
    if (cards.length && !folding && performance.now() - lastMove > 1100) fold();
    if (cards.length) requestAnimationFrame(frame); else { running = false; prev = null; }
  }
  const run = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
  let folding = 0;
  function fold() {                                                     // the cursor stopped: the tail runs up into the newest card
    folding = setInterval(() => {
      const c = cards.find(k => !k.dead);
      if (!c || performance.now() - lastMove < 1100) { clearInterval(folding); folding = 0; return; }
      kill(c);
    }, 34);
  }
  const clear = () => { cards.forEach(kill); };
  let moved = null;
  function track(x, y) {
    if (!here() || view.open) return;
    const box = trail.getBoundingClientRect(); x -= box.left; y -= box.top;
    lastMove = performance.now();
    const gap = size() * 0.26;
    if (!moved) { moved = { x, y }; spawn(x, y); return; }
    const d = Math.hypot(x - moved.x, y - moved.y);
    if (d < gap) return;
    const n = Math.min(3, Math.floor(d / gap));
    for (let i = 1; i <= n; i++) spawn(moved.x + (x - moved.x) * i / n, moved.y + (y - moved.y) * i / n);
    moved = { x, y };
  }
  setInterval(() => { if (moved && performance.now() - lastMove > 1100) moved = null; }, 200);

  if (hover && !reduce) addEventListener('pointermove', e => { if (e.pointerType === 'mouse') track(e.clientX, e.clientY); }, { passive: true });
  if (!hover && !reduce) {                                            // phones: an automatic wandering trail
    let t0 = 0;
    const tick = t => {
      if (here()) {
        if (!t0) t0 = t;
        const s = (t - t0) / 1000, w = innerWidth, h = innerHeight;
        track(w * (0.5 + 0.3 * Math.sin(s * 0.8)), h * (0.5 + 0.2 * Math.sin(s * 1.3 + 1)));
      } else t0 = 0;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  /* ---------- click a photo to open it ---------- */
  const view = document.createElement('dialog'); view.className = 'gv'; view.setAttribute('aria-label', 'Photo');
  view.innerHTML = `<div class="gv__bg"></div><img class="gv__img" alt="">
    <button class="gv__btn gv__close" type="button" aria-label="Close">×</button>
    <button class="gv__btn gv__prev" type="button" aria-label="Previous photo">←</button>
    <button class="gv__btn gv__next" type="button" aria-label="Next photo">→</button>`;
  document.body.appendChild(view);
  const vImg = view.querySelector('.gv__img');
  let vAt = 0;
  const fit = r => {                                                   // the open size: as big as fits, keeping the shape
    const maxW = Math.min(innerWidth * (innerWidth < 700 ? 0.92 : 0.8), 1300), maxH = innerHeight * 0.8;
    let w = maxW, h = w * r; if (h > maxH) { h = maxH; w = h / r; }
    return { w, h, x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 };
  };
  const put = (b, extra = '') => { vImg.style.cssText = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;${extra}`; };
  function show(i, from) {
    vAt = (i + pics.length) % pics.length;
    const p = pics[vAt], end = fit(p.r);
    vImg.src = p.src;
    if (from) {                                                        // grow out of the photo that was clicked
      put({ x: from.left, y: from.top, w: from.width, h: from.height }, 'transition:none');
      vImg.getBoundingClientRect();
      requestAnimationFrame(() => put(end));
    } else put(end, 'transition:none');
  }
  function openAt(i, rect) {
    if (view.open) return;
    view.showModal(); view.classList.add('on');
    show(i, rect);
  }
  function closeView() {
    view.classList.remove('on');
    setTimeout(() => { if (!view.classList.contains('on')) view.close(); }, 320);
  }
  trail.addEventListener('click', e => {
    const card = e.target.closest('.gt__c'); if (!card) return;
    openAt(+card.dataset.i, card.getBoundingClientRect());
  });
  view.addEventListener('click', e => {
    if (e.target.closest('.gv__prev')) return show(vAt - 1);
    if (e.target.closest('.gv__next')) return show(vAt + 1);
    closeView();
  });
  view.addEventListener('cancel', e => { e.preventDefault(); closeView(); });
  view.addEventListener('keydown', e => {
    e.stopPropagation();                                               // keep the page from changing underneath
    if (e.key === 'ArrowRight') show(vAt + 1);
    if (e.key === 'ArrowLeft') show(vAt - 1);
  });
  view.addEventListener('wheel', e => { e.stopPropagation(); e.preventDefault(); }, { passive: false });
  let vx = null;
  view.addEventListener('touchstart', e => { vx = e.touches[0].clientX; }, { passive: true });
  view.addEventListener('touchend', e => {
    e.stopPropagation();
    if (vx === null) return;
    const dx = e.changedTouches[0].clientX - vx; vx = null;
    if (Math.abs(dx) > 50) { e.preventDefault(); show(vAt + (dx < 0 ? 1 : -1)); }
  });
  addEventListener('resize', () => { if (view.open) put(fit(pics[vAt].r), 'transition:none'); });
  new MutationObserver(() => { if (!here()) clear(); }).observe(document.body, { attributes: true, attributeFilter: ['data-page'] });
})();
