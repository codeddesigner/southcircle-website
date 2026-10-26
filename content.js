/* Editable site content and page order.
   The admin saves two settings in Supabase: "content" (text for every field below) and "pages"
   (the order, names and visibility of the middle pages). This file applies them to the page,
   then starts the main site script, so paging, the menu and the counter follow the saved order.
   The admin loads this same file to get the field list (it does nothing else there). */
(() => {
  const FIELDS = [
    { group: 'General', key: 'nav_cta', label: 'Top-right button', def: 'Start a project ↗' },
    { group: 'General', key: 'ring', label: 'Spinning ring text', def: 'IMAGINE MORE' },
    { group: 'General', key: 'intro', label: 'Intro words (before the word cycle)', def: 'We build products with' },
    { group: 'Home', key: 'trust', label: 'Line above client logos', def: 'Trusted by teams building real products:' },
    { group: 'Products', key: 'statement', label: 'Statement (put *stars* around words to highlight them)', def: 'We create and operate *consumer apps* designed to become part of *everyday life.*', long: 1 },
    { group: 'Products', key: 'products_hint', label: 'Hint at the bottom', def: 'Hover a circle to pause · click to open' },
    { group: 'Services', key: 'services_title', label: 'Heading', def: 'Services' },
    ...[['Product', 'We find the problem worth solving and shape the smallest product that proves it: research, strategy, roadmaps and clickable prototypes.', 'Start a product project'],
        ['Design', 'Interfaces people understand at a glance and enjoy coming back to: UX and interface design, design systems, motion and brand for product.', 'Start a design project'],
        ['Engineering', 'Fast, reliable web and mobile software, from APIs and payments to data and AI features, tested and shipped to your users every week.', 'Start an engineering project'],
        ['Operations', 'We don’t hand over and leave. Cloud, monitoring, security and growth experiments keep your product up and improving, 24/7.', 'Start an operations project']]
      .flatMap(([n, d, c], i) => [
        { group: 'Services', key: `svc${i}_name`, label: `Service ${i + 1}: name`, def: n },
        { group: 'Services', key: `svc${i}_desc`, label: `Service ${i + 1}: description`, def: d, long: 1 },
        { group: 'Services', key: `svc${i}_cta`, label: `Service ${i + 1}: button`, def: c }]),
    { group: 'Gallery', key: 'gallery_title', label: 'Title', def: 'The life we live outside building products.', long: 1 },
    { group: 'Gallery', key: 'gallery_hint', label: 'Hint under the title', def: 'Move your cursor around the page.' },
    { group: 'Careers', key: 'careers_title', label: 'Title', def: 'Past and present members of our team have contributed to the world’s greatest projects.', long: 1 },
    { group: 'Careers', key: 'careers_note', label: 'Line under the title (after “Hover”)', def: 'a face to see their work' },
    { group: 'Careers', key: 'careers_link', label: 'Link text', def: 'Join us ↗' },
    { group: 'Careers', key: 'careers_email', label: 'Careers email', def: 'careers@southcircle.io' },
    { group: 'Contact', key: 'contact_label', label: 'Small label', def: 'Contact' },
    { group: 'Contact', key: 'contact_title', label: 'Big title', def: 'Start a Conversation' },
    { group: 'Contact', key: 'contact_email', label: 'Main email', def: 'hello@southcircle.io' },
    { group: 'Contact', key: 'contact_btn', label: 'Message button', def: 'Send us a message' },
    { group: 'Footer', key: 'instagram', label: 'Instagram link', def: 'https://instagram.com/southcircle' },
    { group: 'Footer', key: 'x', label: 'X link', def: 'https://x.com/southcircle' },
    { group: 'Footer', key: 'linkedin', label: 'LinkedIn link', def: 'https://www.linkedin.com/company/southcircle' },
    { group: 'Footer', key: 'tiktok', label: 'TikTok link', def: 'https://www.tiktok.com/@southcircle' },
    { group: 'Footer', key: 'handle', label: 'Social handle', def: '@southcircle' },
    { group: 'Footer', key: 'partners_email', label: 'Partnership email', def: 'partnerships@southcircle.io' },
    { group: 'Footer', key: 'press_email', label: 'Press email', def: 'press@southcircle.io' },
    { group: 'Footer', key: 'office', label: 'Office', def: 'Lagos, Nigeria' },
    { group: 'Footer', key: 'tagline', label: 'Bottom line', def: 'We create and operate consumer apps.' }
  ];
  const PAGES = [['products', 'Products'], ['stats', 'Stats'], ['services', 'Services'], ['gallery', 'Gallery'], ['careers', 'Careers']].map(([id, label]) => ({ id, label, show: true }));
  window.SC_CONTENT = { FIELDS, PAGES };

  const stage = document.getElementById('stage');
  if (!stage) return;                                      // the admin only needs the lists above

  const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co', SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const setText = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
  const mail = (el, v, arrow) => { if (!el) return; el.href = 'mailto:' + v; el.innerHTML = esc(v) + (arrow ? ' <span>↗</span>' : ''); };

  function applyContent(c) {
    const v = k => (c && typeof c[k] === 'string' && c[k].trim() !== '' ? c[k] : FIELDS.find(f => f.key === k).def);
    setText('.nav__cta', v('nav_cta'));
    const ring = $('#ring'); if (ring) ring.dataset.text = v('ring').trim().toUpperCase() + ' ';
    const intro = $('.ld__intro'); if (intro) intro.innerHTML = v('intro').trim().split(/\s+/).map(w => `<span>${esc(w)}</span>`).join(' ');
    setText('.trust__k', v('trust'));
    const say = $('#products .say');
    if (say) {                                              // *highlighted* words get the outlined style
      let hi = false, i = 0;
      const words = v('statement').trim().split(/\s+/).map(w => {
        const open = w.startsWith('*'), close = w.endsWith('*') && (w.length > 1 || !open);
        if (open) hi = true;
        const t = esc(w.replace(/^\*|\*$/g, ''));
        const html = hi ? `<span class="w em" style="--i:${i}"><b>${t}</b><i>${t}</i></span>` : `<span class="w" style="--i:${i};--r:${[-2, 1.5, -1, 2, -1.5, 0, 1][i % 7]}deg">${t}</span>`;
        if (close) hi = false;
        i++; return html;
      });
      say.innerHTML = words.join(' ');
    }
    setText('#products .orbit-hint', v('products_hint'));
    setText('.svx__head h2', v('services_title'));
    for (let i = 0; i < 4; i++) {
      setText(`.svx__row[data-svc="${i}"] .svx__name`, v(`svc${i}_name`));
      setText(`.svx__pane[data-pane="${i}"] .svx__desc`, v(`svc${i}_desc`));
      setText(`.svx__pane[data-pane="${i}"] .svx__cta`, v(`svc${i}_cta`));
      const art = $(`.svx__pane[data-pane="${i}"] .svx__art`); if (art) art.setAttribute('aria-label', v(`svc${i}_name`));
    }
    const gal = $('#gallery'), car = $('#careers');
    if (gal) { gal.querySelector('.life__title').textContent = v('gallery_title'); gal.querySelector('.life__center p').textContent = v('gallery_hint'); }
    if (car) {
      car.querySelector('.life__title').textContent = v('careers_title');
      car.querySelector('.team__note').innerHTML = `<span class="hv">Hover</span><span class="tp-only">Tap</span> ${esc(v('careers_note'))} · <a href="mailto:${esc(v('careers_email'))}" data-join>${esc(v('careers_link'))}</a>`;
    }
    setText('#contact .label', v('contact_label'));
    const ct = $('#contact .contact__title');                // a new line after the first comma
    if (ct) ct.innerHTML = esc(v('contact_title')).replace(/,\s*/, ',<br>');
    mail($('.contact__mail'), v('contact_email'), true);
    setText('.contact__btn', v('contact_btn'));
    const cols = $$('.foot__cols > div');
    if (cols[1]) {
      const a = cols[1].querySelectorAll('a');
      ['instagram', 'x', 'linkedin', 'tiktok'].forEach((k, i) => { if (a[i]) { a[i].href = v(k); a[i].hidden = !c || c[k] !== '' ? false : true; } });
      const p = cols[1].querySelector('p'); if (p) p.textContent = v('handle');
    }
    if (cols[2]) { const a = cols[2].querySelectorAll('a'); mail(a[0], v('partners_email')); mail(a[1], v('press_email')); }
    if (cols[3]) { const p = cols[3].querySelector('p'); if (p) p.textContent = v('office'); }
    const legal = $$('.foot__legal > span');
    if (legal[1]) legal[1].textContent = v('office');
    if (legal[2]) legal[2].textContent = v('tagline');
    const priv = $('.foot__legal a'); if (priv) priv.href = '/privacy';
    document.dispatchEvent(new Event('sc-content'));
  }

  function applyPages(list) {
    const known = PAGES.map(p => p.id);
    let order = Array.isArray(list) ? list.filter(p => p && known.includes(p.id)) : [];
    PAGES.forEach(p => { if (!order.find(o => o.id === p.id)) order.push({ ...p }); });   // pages added later still appear
    const all = id => document.getElementById(id);
    const home = all('home'), contact = all('contact');
    const shown = order.filter(p => p.show !== false && all(p.id));
    stage.append(home);
    order.forEach(p => { const el = all(p.id); if (!el) return; el.dataset.name = p.label || el.dataset.name; const on = p.show !== false; el.classList.toggle('page', on); el.hidden = !on; stage.append(el); });
    stage.append(contact);
    order.forEach(p => { const el = all(p.id); if (el && p.show === false) stage.append(el); });   // hidden pages stay in the page, out of the way
    const idx = id => [home, ...shown.map(p => all(p.id)), contact].findIndex(el => el && el.id === id);
    const links = shown.map(p => `<a href="/${p.id}" data-go="${idx(p.id)}">${esc(p.label || p.id)}</a>`).join('');
    const nav = $('.nav__links'); if (nav) nav.innerHTML = links;
    const fc = $('.foot__cols > div'); if (fc) fc.innerHTML = '<h6>Company</h6>' + links;
    $$('[href="/contact"][data-go]').forEach(a => { a.dataset.go = idx('contact'); });
  }

  /* site settings from Admin → Settings: intro animation on/off, and whether visitors pick a colour
     or the site stays in one fixed colour. Saved for the next visit so they apply before anything shows. */
  const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const rgbHex = c => '#' + c.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const mixC = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
  const lum = c => { const [r, g, b] = c.map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const customOf = hex => { const p = hexRgb(hex), dark = mixC(p, [0, 0, 0], 0.88), light = mixC(p, [1, 1, 1], 0.93), inkDark = lum(p) > 0.18;
    return { hex, tint: [dark, p, light], v: { '--paper': hex, '--ink': rgbHex(inkDark ? dark : light), '--accent': inkDark ? rgbHex(light) : '#ffffff' } }; };
  function applySite(cfg) {
    const c = cfg && typeof cfg === 'object' ? cfg : {};
    const popup = 'popup' in c ? c.popup !== false : c.picker !== false;      // older saves had one switch for both
    const button = 'button' in c ? c.button !== false : c.picker !== false;
    const root = document.documentElement;
    root.classList.toggle('no-intro', c.intro === false);
    root.classList.toggle('no-pick', !button);
    try {
      const ls = localStorage;
      ls.setItem('sc-site', JSON.stringify({ intro: c.intro !== false, picker: button }));
      if (ls.getItem('sc-theme-fixed')) { ls.setItem('sc-theme-auto', ls.getItem('sc-theme') || ''); ls.removeItem('sc-theme-fixed'); }
      const auto = ls.getItem('sc-theme-auto'), mine = ls.getItem('sc-theme');
      const ours = auto !== null && mine === auto;                    // the colour we set, not one the visitor picked
      const setDefault = () => {
        const t = c.theme || 'blue';
        if (t === 'custom' && /^#[0-9a-f]{6}$/i.test(c.custom || '')) { ls.setItem('sc-custom', JSON.stringify(customOf(c.custom))); ls.setItem('sc-theme', 'custom'); }
        else ls.setItem('sc-theme', t === 'custom' ? 'blue' : t);
        ls.setItem('sc-theme-auto', ls.getItem('sc-theme'));
      };
      if (!popup && !button) setDefault();                            // no choosing at all: everyone gets the set colour
      else if (!popup) { if (!mine || ours) setDefault(); }           // no question on arrival: start in the set colour
      else if (ours) { ls.removeItem('sc-theme'); ls.removeItem('sc-theme-auto'); }   // asking again: let them pick
    } catch (e) {}
  }

  let cache = null;
  try { cache = JSON.parse(localStorage.getItem('sc-content') || 'null'); } catch (e) {}
  const apply = d => { if (!d) return; try { applySite(d.site); applyContent(d.content); applyPages(d.pages); } catch (e) { console.warn(e); } };
  apply(cache || { content: null, pages: null });

  /* client logos on the first page: only the real ones (remembered from the last visit, so they show
     straight away), never stand-in names while the page loads */
  const trust = $('.trust'), trustList = $('.trust__list');
  const showClients = list => {
    if (!trust || !Array.isArray(list)) return;
    trustList.innerHTML = list.map(c => {
      const inner = c.logo_url ? `<img src="${esc(c.logo_url)}" alt="${esc(c.name)}" style="filter:var(--logo-filter,brightness(0))">` : esc(c.name);
      return `<li>${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${inner}</a>` : inner}</li>`;
    }).join('');
    trust.hidden = !list.length;
  };
  try { showClients(JSON.parse(localStorage.getItem('sc-clients') || 'null')); } catch (e) {}
  fetch(`${SB_URL}/rest/v1/sc_clients?select=name,url,logo_url&published=eq.true&order=sort.asc,created_at.asc`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : null).then(list => { if (!list) return; showClients(list); try { localStorage.setItem('sc-clients', JSON.stringify(list)); } catch (e) {} })
    .catch(() => {});

  let started = false;
  const start = () => {                                      // now start the site itself
    if (started) return; started = true;
    const j = document.createElement('script'); j.src = '/join.js?t=' + (window.SCV || ''); document.body.appendChild(j);   // the Careers "Join us" form
    const s = document.createElement('script'); s.src = '/site.js?v=27&t=' + (window.SCV || '');
    s.onload = () => {
      const r = document.createElement('script'); r.src = '/ring.js?t=' + (window.SCV || ''); document.body.appendChild(r);   // the ring you can spin by hand
      if (document.documentElement.classList.contains('no-intro')) document.getElementById('loader')?.click(); };   // intro switched off: skip it
    document.body.appendChild(s);
  };
  const timer = setTimeout(start, 1500);                     // don't keep visitors waiting on a slow network
  fetch(`${SB_URL}/rest/v1/sc_settings?key=in.(content,pages,site)&select=key,value`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : [])
    .then(rows => {
      const get = k => { const r = rows.find(x => x.key === k); try { return r ? JSON.parse(r.value) : null; } catch (e) { return null; } };
      const fresh = { content: get('content'), pages: get('pages'), site: get('site') };
      try { localStorage.setItem('sc-content', JSON.stringify(fresh)); } catch (e) {}
      if (!started) apply(fresh);
      else if (JSON.stringify(fresh) !== JSON.stringify(cache)) applyContent(fresh.content);   // too late to re-page; text still updates
    })
    .catch(() => {})
    .finally(() => { clearTimeout(timer); start(); });
})();
