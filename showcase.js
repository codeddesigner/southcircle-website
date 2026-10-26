/* Product showcase: click a product on the Products page and it opens full screen, like a launch reel.
   The product's name sits huge in the middle and its photos and videos float around it; click one to see it
   big. Arrows (or swipe) go to the next product. Photos, videos and highlight words come from
   Admin → Products → Showcase; until a product has some, tiles are made from its icon, colours and details. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const css = document.createElement('style');
  css.textContent = `
    dialog.ps{margin:0;padding:0;border:0;width:100vw;height:100svh;max-width:none;max-height:none;overflow:hidden;background:#0a0a0a;color:#f3f1ec;
      clip-path:circle(0 at var(--ox,50%) var(--oy,50%));transition:clip-path .8s cubic-bezier(.7,0,.2,1)}
    dialog.ps.on{clip-path:circle(150% at var(--ox,50%) var(--oy,50%))}
    dialog.ps::backdrop{background:transparent}
    dialog.ps [hidden]{display:none !important}
    .ps__t{position:absolute;left:0;top:0;margin:0;overflow:hidden;background:#161616;cursor:zoom-in;will-change:transform;transition:opacity .45s;z-index:1}
    .ps__t.front{z-index:3}
    .ps__t img,.ps__t video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
    dialog.ps.focused .ps__t{opacity:.1}
    .ps__name{position:absolute;left:0;right:0;top:50%;z-index:2;margin:0;padding:0;transform:translateY(-50%);text-align:center;font-weight:400;
      letter-spacing:-.055em;line-height:1;white-space:nowrap;pointer-events:none}
    .ps__name i{display:inline-block;overflow:hidden;font-style:normal;padding:0 .02em .06em;vertical-align:top}
    .ps__name span,.ps__hl span{display:inline-block;transform:translateY(110%);animation:psUp .95s cubic-bezier(.19,1,.22,1) forwards;animation-delay:calc(.3s + var(--i) * .035s)}
    @keyframes psUp{to{transform:none}}
    .ps__top{position:absolute;left:0;right:0;top:0;z-index:4;display:grid;grid-template-columns:1fr auto auto 1fr;gap:6vw;align-items:center;padding:20px 28px;font-size:13px}
    .ps__brand{display:flex;gap:10px;align-items:center;font-size:15px;letter-spacing:-.01em;min-width:0}
    .ps__brand b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ps__mark{width:28px;height:28px;flex:none;border-radius:50%;display:grid;place-items:center;overflow:hidden}
    .ps__mark svg{width:56%;height:56%}.ps__mark img{width:100%;height:100%;object-fit:cover}
    .ps__k,.ps__n,.ps__cat{color:rgba(243,241,236,.55)}
    .ps__n{font-variant-numeric:tabular-nums}
    .ps__end{justify-self:end;display:flex;gap:18px;align-items:center}
    .ps__x{width:40px;height:40px;border-radius:50%;border:1px solid rgba(243,241,236,.22);background:rgba(10,10,10,.35);color:inherit;font:inherit;font-size:20px;line-height:1;cursor:pointer;transition:background .2s}
    .ps__x:hover{background:#f3f1ec;color:#0a0a0a}
    .ps__info{position:absolute;left:28px;bottom:26px;z-index:4;width:min(340px,34vw)}
    .ps__tag{font-size:17px;letter-spacing:-.02em;margin:0 0 6px}
    .ps__desc{font-size:13px;line-height:1.5;color:rgba(243,241,236,.6);margin:0 0 14px}
    .ps__cta{display:inline-flex;gap:8px;align-items:center;height:40px;padding:0 18px;border-radius:99px;background:#f3f1ec;color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:500}
    .ps__meta{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:rgba(243,241,236,.45);margin:14px 0 0}
    .ps__hl{position:absolute;right:28px;bottom:46px;z-index:4;list-style:none;margin:0;padding:0;font-size:clamp(22px,2.7vw,46px);font-weight:600;letter-spacing:-.045em;line-height:.93;text-align:left}
    .ps__hl li{overflow:hidden;padding-bottom:.04em}
    .ps__hl span{animation-delay:calc(.65s + var(--i) * .07s)}
    .ps__yr{position:absolute;right:28px;bottom:24px;z-index:4;font-size:11px;letter-spacing:.08em;color:rgba(243,241,236,.45)}
    .ps__nav{position:absolute;left:50%;bottom:24px;z-index:4;display:flex;gap:6px;transform:translateX(-50%)}
    .ps__nav button{height:36px;padding:0 15px;border-radius:99px;border:1px solid rgba(243,241,236,.22);background:rgba(10,10,10,.4);color:inherit;font:inherit;font-size:13px;cursor:pointer;transition:background .2s,color .2s}
    .ps__nav button:hover{background:#f3f1ec;color:#0a0a0a}
    .ps__focus{position:absolute;z-index:10;overflow:hidden;background:#161616;cursor:zoom-out;transition-property:left,top,width,height;transition-duration:.6s;transition-timing-function:cubic-bezier(.19,1,.22,1)}
    .ps__focus img,.ps__focus video{width:100%;height:100%;object-fit:cover;display:block}
    .ps__focus .ps__gen{transition:font-size .6s cubic-bezier(.19,1,.22,1)}
    .ps__gen{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3em;text-align:center;padding:9%;box-sizing:border-box;
      font-size:calc(var(--w) * .1);letter-spacing:-.035em;line-height:1}
    .ps__gen svg{width:54%;height:54%}
    .ps__gen small{font-size:.38em;letter-spacing:.08em;text-transform:uppercase;opacity:.6}
    .ps__gen .dot{display:inline-block;width:.42em;height:.42em;border-radius:50%;background:currentColor;margin-right:.3em;vertical-align:.08em}
    @media (max-width:700px){
      .ps__top{grid-template-columns:1fr auto;gap:12px;padding:14px 16px}
      .ps__k,.ps__n,.ps__cat{display:none}
      .ps__info{left:16px;right:16px;bottom:70px;width:auto}
      .ps__desc,.ps__meta,.ps__hl,.ps__yr{display:none}
      .ps__tag{font-size:15px}
      .ps__nav{bottom:18px}
    }`;
  document.head.appendChild(css);

  const dlg = document.createElement('dialog');
  dlg.className = 'ps'; dlg.setAttribute('aria-labelledby', 'psName');
  dlg.innerHTML = `
    <div class="ps__stage"></div>
    <h2 class="ps__name" id="psName"></h2>
    <header class="ps__top">
      <div class="ps__brand"><span class="ps__mark"></span><b></b></div>
      <span class="ps__k">Showcase</span><span class="ps__n"></span>
      <div class="ps__end"><span class="ps__cat"></span><button class="ps__x" type="button" aria-label="Close">×</button></div>
    </header>
    <div class="ps__info"><p class="ps__tag"></p><p class="ps__desc"></p><a class="ps__cta" target="_blank" rel="noopener">Visit product <span>↗</span></a><p class="ps__meta"></p></div>
    <ul class="ps__hl"></ul><span class="ps__yr"></span>
    <nav class="ps__nav"><button type="button" data-d="-1" aria-label="Previous product">← Prev</button><button type="button" data-d="1" aria-label="Next product">Next →</button></nav>`;
  document.body.appendChild(dlg);
  const q = s => dlg.querySelector(s), stage = q('.ps__stage');

  /* where the tiles sit: x / y are the tile's centre in % of the screen, w its width in % of the screen width;
     "front" tiles pass in front of the name */
  const WIDE = [
    { x: 36, y: 20, w: 10 }, { x: 9, y: 42, w: 13 }, { x: 86, y: 38, w: 14 }, { x: 22, y: 63, w: 9 },
    { x: 62, y: 16, w: 8 }, { x: 58, y: 54, w: 10, front: 1 }, { x: 68, y: 76, w: 9 }, { x: 24, y: 24, w: 6.5 }, { x: 44, y: 80, w: 7 }];
  const NARROW = [
    { x: 26, y: 20, w: 30 }, { x: 74, y: 16, w: 26 }, { x: 58, y: 33, w: 20 }, { x: 22, y: 67, w: 26 },
    { x: 76, y: 68, w: 28 }, { x: 74, y: 44, w: 16, front: 1 }];
  const slots = () => innerWidth < 700 ? NARROW : WIDE;

  let list = [], at = 0, helpers = {}, tiles = [], raf = 0, mx = 0, my = 0, ox = innerWidth / 2, oy = innerHeight / 2, focus = null, onDone = null;
  addEventListener('pointerdown', e => { ox = e.clientX; oy = e.clientY; }, true);   // the showcase opens out of the spot you clicked

  /* tiles made from the product itself, for products without photos or videos yet */
  function madeTiles(p) {
    const mark = helpers.mark ? helpers.mark(p) : '', anim = helpers.anim ? helpers.anim(p.anim) : '';
    const plat = String(p.plat || '').split(',').map(s => s.trim()).filter(Boolean);
    const out = [
      { html: `<div class="ps__gen" style="background:${esc(p.bg)};color:${esc(p.fg)}">${mark}</div>`, r: 1 },
      p.tag && { html: `<div class="ps__gen" style="background:#f3f1ec;color:#0a0a0a;font-size:calc(var(--w) * .095)">${esc(p.tag)}</div>`, r: 0.8 },
      anim && { html: `<div class="ps__gen" style="background:${esc(p.fg)};color:${esc(p.bg)}">${anim}</div>`, r: 1 },
      p.cat && { html: `<div class="ps__gen" style="background:#1c1c1c;color:#f3f1ec;font-size:calc(var(--w) * .16)"><small>Category</small>${esc(p.cat)}</div>`, r: 0.72 },
      p.status && { html: `<div class="ps__gen" style="background:${esc(p.bg)};color:${esc(p.fg)};font-size:calc(var(--w) * .15)"><span><i class="dot"></i>${esc(p.status)}</span></div>`, r: 0.6 },
      plat.length && { html: `<div class="ps__gen" style="background:#e9e6df;color:#0a0a0a;font-size:calc(var(--w) * .13)"><small>Platforms</small>${plat.map(esc).join('<br>')}</div>`, r: 1.15 },
      p.year && { html: `<div class="ps__gen" style="background:#2a2a2a;color:#f3f1ec;font-size:calc(var(--w) * .2)"><small>Since</small>${esc(p.year)}</div>`, r: 0.9 }];
    return out.filter(Boolean);
  }
  const mediaHTML = (m, big) => m.type === 'video'
    ? `<video src="${esc(m.url)}" muted loop playsinline autoplay preload="${big ? 'auto' : 'metadata'}"${big ? ' controls' : ''}></video>`
    : `<img src="${esc(m.url)}" alt="" draggable="false">`;

  /* one card set up in Admin → Products → Showcase: a photo, a video, a text card, the icon or the animation */
  function cardOf(m, p) {
    if (!m || typeof m !== 'object') return null;
    if (m.type === 'image' || m.type === 'video') return m.url ? { ...m, html: mediaHTML(m), r: +m.r || 1.25 } : null;
    if (m.type === 'icon') return { html: `<div class="ps__gen" style="background:${esc(p.bg)};color:${esc(p.fg)}">${helpers.mark ? helpers.mark(p) : ''}</div>`, r: 1 };
    if (m.type === 'anim') { const a = helpers.anim ? helpers.anim(p.anim) : ''; return a ? { html: `<div class="ps__gen" style="background:${esc(p.fg)};color:${esc(p.bg)}">${a}</div>`, r: 1 } : null; }
    if (m.type === 'text') {
      const lines = String(m.text || '').split('\n').map(s => s.trim()).filter(Boolean); if (!lines.length) return null;
      const n = Math.max(...lines.map(l => l.length)), all = lines.join(' ').length;
      const fs = all > 40 ? .085 : n <= 6 ? .2 : n <= 12 ? .15 : n <= 24 ? .11 : .095;
      return { html: `<div class="ps__gen" style="background:${esc(m.bg || '#f3f1ec')};color:${esc(m.fg || '#0a0a0a')};font-size:calc(var(--w) * ${fs})">${m.label ? `<small>${esc(m.label)}</small>` : ''}<span>${lines.map(esc).join('<br>')}</span></div>`,
        r: Math.min(1.2, 0.6 + 0.12 * (lines.length - 1) + (all > 40 ? 0.25 : 0) + (m.label ? 0.1 : 0)) };
    }
    return null;
  }

  function layout(k) {
    const s = k.slot, narrow = innerWidth < 700;
    k.w = Math.max(narrow ? 80 : 96, s.w / 100 * innerWidth);
    k.h = Math.min(k.w * Math.min(1.45, Math.max(0.55, k.r)), innerHeight * (narrow ? 0.17 : 0.3));
    k.sx = s.x / 100 * innerWidth; k.sy = s.y / 100 * innerHeight;
    Object.assign(k.el.style, { width: k.w + 'px', height: k.h + 'px' });
    k.el.style.setProperty('--w', k.w + 'px');
  }
  const ease = x => { const c = 1.35; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };   // a little overshoot, then settle
  function place(k, t) {
    const e = Math.max(0, Math.min(1, (t - k.t0) / (reduce ? 1 : 1000))), E = reduce ? 1 : ease(e);
    const cx = innerWidth / 2, cy = innerHeight / 2, s = t / 1000;
    const fx = reduce ? 0 : Math.sin(s * k.sp + k.ph) * k.amp, fy = reduce ? 0 : Math.cos(s * k.sp * 0.8 + k.ph) * k.amp;
    const x = cx + (k.sx - cx) * E + fx - mx * k.depth, y = cy + (k.sy - cy) * E + fy - my * k.depth;
    k.el.style.transform = `translate3d(${x - k.w / 2}px, ${y - k.h / 2}px, 0) scale(${Math.max(0.001, Math.min(1.08, 0.15 + 0.85 * E))}) rotate(${(1 - Math.min(1, E)) * k.rot}deg)`;
  }
  function loop(t) {
    tiles.forEach(k => place(k, t));
    raf = requestAnimationFrame(loop);
  }

  function show(i) {
    at = (i + list.length) % list.length;
    const p = list[at];
    unfocus(true);
    stage.querySelectorAll('video').forEach(v => v.pause());
    stage.innerHTML = '';
    /* text */
    q('.ps__mark').style.cssText = `background:${p.bg};color:${p.fg}`;
    q('.ps__mark').innerHTML = helpers.mark ? helpers.mark(p) : '';
    q('.ps__brand b').textContent = p.name;
    q('.ps__n').textContent = `${pad(at + 1)} / ${pad(list.length)}`;
    q('.ps__cat').textContent = p.cat || '';
    const name = q('.ps__name');
    name.style.fontSize = Math.min(innerWidth * 0.11, innerWidth * 0.9 / Math.max(1, p.name.length * 0.56), 220) + 'px';
    name.innerHTML = `<i>${[...p.name].map((c, n) => `<span style="--i:${n}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</i>`;
    q('.ps__tag').textContent = p.tag || '';
    q('.ps__desc').textContent = p.desc || '';
    const cta = q('.ps__cta'), live = p.url && p.url !== '#';
    cta.hidden = !live; if (live) cta.href = p.url;
    q('.ps__meta').textContent = [p.plat, p.status, p.year && 'Since ' + p.year].filter(Boolean).join(' · ');
    const hl = String(p.highlights || '').split('\n').map(s => s.trim()).filter(Boolean);
    const words = (hl.length ? hl : [p.cat, ...String(p.plat || '').split(','), p.status].map(s => String(s || '').trim()).filter(Boolean)).slice(0, 6);
    q('.ps__hl').innerHTML = words.map((w, n) => `<li><span style="--i:${n}">${esc(w)}</span></li>`).join('');
    q('.ps__yr').textContent = p.year ? 'YR' + String(p.year).slice(-2) : '';
    q('.ps__nav').hidden = list.length < 2;
    /* tiles */
    const own = Array.isArray(p.media) ? p.media.map(m => cardOf(m, p)).filter(Boolean) : [];
    const media = own.length ? own : madeTiles(p);
    const now = performance.now(), sl = slots();
    tiles = media.slice(0, sl.length).map((m, n) => {
      const el = document.createElement('figure');
      el.className = 'ps__t' + (sl[n].front ? ' front' : ''); el.innerHTML = m.html; el.dataset.n = n;
      const k = { el, m, slot: sl[n], r: m.r, t0: now + 250 + n * 85, sp: 0.35 + Math.random() * 0.35, ph: Math.random() * 6.3, amp: 4 + Math.random() * 8,
        depth: 14 + Math.random() * 40, rot: (Math.random() - 0.5) * 24 };
      layout(k); place(k, now);                                  // in place before it's shown
      stage.appendChild(el);
      const img = el.querySelector('img');
      if (img && !m.r) img.onload = () => { k.r = img.naturalHeight / img.naturalWidth || k.r; layout(k); };
      const vid = el.querySelector('video');
      if (vid) { vid.play().catch(() => {}); if (!m.r) vid.onloadedmetadata = () => { k.r = vid.videoHeight / vid.videoWidth || k.r; layout(k); }; }
      return k;
    });
  }

  /* click a tile to see it big; click again (or Esc) to put it back */
  function fitBox(r) {
    const maxW = innerWidth * (innerWidth < 700 ? 0.92 : 0.7), maxH = innerHeight * 0.74;
    let w = maxW, h = w * r; if (h > maxH) { h = maxH; w = h / r; }
    return { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2, width: w, height: h };
  }
  const setBox = (el, b) => { ['left', 'top', 'width', 'height'].forEach(k => { el.style[k] = b[k] + 'px'; }); el.style.setProperty('--w', b.width + 'px'); };
  function openFocus(k) {
    if (focus) return;
    const r0 = k.el.getBoundingClientRect(), el = document.createElement('div');
    el.className = 'ps__focus';
    el.innerHTML = k.m.type ? mediaHTML(k.m, true) : k.m.html;
    el.style.transition = 'none'; setBox(el, r0);
    dlg.appendChild(el); dlg.classList.add('focused');
    el.getBoundingClientRect(); el.style.transition = '';
    requestAnimationFrame(() => setBox(el, fitBox(k.h / k.w)));
    el.querySelector('video')?.play().catch(() => {});
    focus = { el, k };
  }
  function unfocus(now) {
    if (!focus) return;
    const { el, k } = focus; focus = null;
    dlg.classList.remove('focused');
    if (now || reduce) { el.remove(); return; }
    setBox(el, k.el.getBoundingClientRect());
    setTimeout(() => el.remove(), 600);
  }

  function open(p, all, h, done) {
    list = all && all.length ? all : [p]; helpers = h || {}; onDone = done;
    at = Math.max(0, list.indexOf(p));
    dlg.style.setProperty('--ox', ox + 'px'); dlg.style.setProperty('--oy', oy + 'px');
    show(at);
    dlg.showModal();
    requestAnimationFrame(() => dlg.classList.add('on'));
    q('.ps__x').focus({ preventScroll: true });
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function close() {
    if (focus) return unfocus();
    if (!dlg.classList.contains('on')) return;
    quietUntil = performance.now() + 1200;
    dlg.classList.remove('on');
    setTimeout(() => {
      dlg.close(); cancelAnimationFrame(raf); raf = 0;
      stage.querySelectorAll('video').forEach(v => v.pause()); stage.innerHTML = ''; tiles = [];
      if (onDone) onDone();
    }, reduce ? 0 : 650);
  }

  dlg.addEventListener('click', e => {
    if (e.target.closest('.ps__x')) return close();
    const nav = e.target.closest('[data-d]'); if (nav) return show(at + +nav.dataset.d);
    if (focus && (e.target.closest('.ps__focus') && !e.target.closest('video[controls]') || !e.target.closest('.ps__focus'))) return unfocus();
    const t = e.target.closest('.ps__t'); if (t) openFocus(tiles[+t.dataset.n]);
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dlg.addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  /* keep the page underneath from moving while the showcase is open */
  dlg.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
  /* scrolling (or swiping up / down on a phone) closes the showcase and goes back to the Products page */
  let wheelSum = 0, wheelT = 0, quietUntil = 0;
  dlg.addEventListener('wheel', e => {
    e.stopPropagation(); e.preventDefault();
    if (!dlg.classList.contains('on')) return;
    clearTimeout(wheelT); wheelT = setTimeout(() => { wheelSum = 0; }, 200);
    wheelSum += e.deltaY;
    if (Math.abs(wheelSum) > 60) { wheelSum = 0; close(); }
  }, { passive: false });
  addEventListener('wheel', e => {                                    // the rest of that scroll mustn't flip the page underneath
    if (performance.now() < quietUntil) { e.stopImmediatePropagation(); e.preventDefault(); quietUntil = Math.max(quietUntil, performance.now() + 350); }
  }, { capture: true, passive: false });
  let tx = null, ty = null;
  dlg.addEventListener('touchstart', e => { e.stopPropagation(); tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  dlg.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
  dlg.addEventListener('touchend', e => {
    e.stopPropagation();
    if (tx === null || focus) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = ty = null;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) close();
    else if (Math.abs(dx) > 60) show(at + (dx < 0 ? 1 : -1));
  });
  addEventListener('resize', () => {
    if (!dlg.open) return;
    const sl = slots();
    tiles.forEach((k, n) => { if (sl[n]) { k.slot = sl[n]; layout(k); } });
    if (focus) setBox(focus.el, fitBox(focus.k.h / focus.k.w));
  });

  window.SC_SHOWCASE = open;
})();
