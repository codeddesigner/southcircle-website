/* Stats page: the figures count up each time the page comes into view.
   The figures and labels are edited in Admin → Stats (stored as the "numbers" setting);
   what's written in the page is the fallback. */
(() => {
  const grid = document.querySelector('#stats .nums__grid');
  if (!grid) return;
  const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co', SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (n, dp = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });   // 20000 -> 20,000
  const dpOf = el => +(el.dataset.dp || 0);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let els = [...grid.querySelectorAll('[data-to]')], raf = 0, shown = false;
  const reset = () => { cancelAnimationFrame(raf); els.forEach(el => { el.textContent = '0'; }); };
  const run = () => {
    shown = true;
    if (reduce) return els.forEach(el => { el.textContent = fmt(+el.dataset.to, dpOf(el)); });
    reset();
    const t0 = performance.now() + 350;                       // wait for the page to slide in
    const tick = now => {
      let busy = false;
      els.forEach((el, i) => {
        const p = Math.min(1, Math.max(0, (now - t0 - i * 120) / 1400)), e = 1 - Math.pow(1 - p, 4);
        const k = 10 ** dpOf(el); el.textContent = fmt(Math.round(+el.dataset.to * e * k) / k, dpOf(el));
        if (p < 1) busy = true;
      });
      if (busy) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const label = l => { l = String(l || '').trim(); const parts = l.includes('\n') ? l.split('\n') : l.split(/\s+/); return parts.length > 1 ? esc(parts[0]) + '<br>' + esc(parts.slice(1).join(' ')) : esc(l); };
  const num = n => Math.max(0, +n.value || 0), dp = n => Math.min(2, (String(n.value).split('.')[1] || '').length);
  const render = items => {
    grid.innerHTML = items.map((n, i) => `<div class="num rv" style="--d:${i + 1}"><span class="num__l">${label(n.label)}</span><span class="num__v">${esc(n.prefix)}<b data-to="${num(n)}" data-dp="${dp(n)}">${fmt(num(n), dp(n))}</b>${esc(n.suffix)}</span></div>`).join('');
    grid.style.setProperty('--cols', items.length);
    els = [...grid.querySelectorAll('[data-to]')];
    if (document.body.dataset.page === 'stats' && shown) run();
  };
  fetch(`${SB_URL}/rest/v1/sc_settings?key=eq.numbers&select=value`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : null)
    .then(rows => {
      const items = rows && rows[0] && JSON.parse(rows[0].value);
      if (Array.isArray(items) && items.length) {
        render(items.slice(0, 4));
      }
    }).catch(() => {});
  let was = document.body.dataset.page;
  if (was === 'stats') run();
  new MutationObserver(() => {
    const p = document.body.dataset.page;
    if (p === was) return;
    if (p === 'stats') run(); else if (was === 'stats') setTimeout(reset, 700);
    was = p;
  }).observe(document.body, { attributes: true, attributeFilter: ['data-page'] });
})();
