/* Careers → "Join us": an application form with the open roles in a dropdown. Roles come from
   Admin → Hiring; applications land there too. Works on any link or button marked data-join. */
(() => {
  const SB_URL = 'https://yjunyikzjnvffpzkcduz.supabase.co', SB_KEY = 'sb_publishable_9vTENY-4Qajb5zaDcqI6FQ_QTrCmM5M';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const OTHER = 'Something else';
  const css = document.createElement('style');
  css.textContent = `
    .jn__sub{margin-top:10px;font-size:15px;color:var(--mute);max-width:46ch}
    .jn__role{font-size:13px;line-height:1.45;color:var(--mute);margin-top:-4px}
    .jn__role:empty{display:none}`;
  document.head.appendChild(css);

  const dlg = document.createElement('dialog');
  dlg.className = 'msg jn'; dlg.setAttribute('aria-labelledby', 'jnTitle');
  dlg.innerHTML = `
    <button class="msg__close" type="button" aria-label="Close">×</button>
    <h3 class="msg__title" id="jnTitle">Join SouthCircle</h3>
    <p class="jn__sub">Tell us who you are and the role you’d like. We read every application.</p>
    <form class="msg__form" novalidate>
      <label>Full name<input name="name" required maxlength="200" autocomplete="name"></label>
      <label>Email<input name="email" type="email" required maxlength="320" autocomplete="email"></label>
      <label class="msg__wide">Role<select name="role" required><option value="">Loading roles…</option></select></label>
      <p class="jn__role msg__wide" aria-live="polite"></p>
      <label>Phone <i>(optional)</i><input name="phone" type="tel" maxlength="60" autocomplete="tel"></label>
      <label>Where are you based? <i>(optional)</i><input name="location" maxlength="200" autocomplete="address-level2" placeholder="Lagos, Nigeria"></label>
      <label class="msg__wide">Portfolio, LinkedIn or CV link <i>(optional)</i><input name="link" type="url" maxlength="500" placeholder="https://"></label>
      <label class="msg__wide">Why SouthCircle, and what have you worked on?<textarea name="message" required maxlength="5000" rows="5"></textarea></label>
      <label class="msg__hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <button class="msg__send" type="submit">Send application</button>
    </form>
    <p class="msg__note" role="status"></p>`;
  document.body.appendChild(dlg);
  const form = dlg.querySelector('form'), note = dlg.querySelector('.msg__note'), sel = form.elements.role, about = dlg.querySelector('.jn__role');

  /* the open roles, newest order from the admin */
  let roles = [], loaded = false;
  const fill = () => {
    sel.innerHTML = '<option value="">Choose a role</option>' +
      roles.map(r => `<option value="${esc(r.title)}">${esc(r.title)}${r.type || r.location ? ' · ' + esc([r.type, r.location].filter(Boolean).join(', ')) : ''}</option>`).join('') +
      `<option value="${OTHER}">${roles.length ? 'Something else (tell us below)' : 'General application'}</option>`;
  };
  const load = () => fetch(`${SB_URL}/rest/v1/sc_roles?select=title,team,type,location,description&published=eq.true&order=sort.asc,created_at.asc`, { headers: { apikey: SB_KEY } })
    .then(r => r.ok ? r.json() : []).catch(() => []).then(list => { roles = list; loaded = true; fill(); });
  load();
  sel.addEventListener('change', () => {
    const r = roles.find(x => x.title === sel.value);
    about.textContent = r ? [r.team, r.description].filter(Boolean).join(' — ') : sel.value === OTHER ? 'Tell us below what you’d like to do.' : '';
  });

  const open = role => {
    form.hidden = false; note.textContent = '';
    if (!loaded) load();
    if (role) { sel.value = role; sel.dispatchEvent(new Event('change')); }
    dlg.showModal();
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-join]'); if (!t) return;
    e.preventDefault(); open(t.dataset.join || '');
  });
  dlg.querySelector('.msg__close').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  /* keep the pages behind the form from changing while it's open */
  ['wheel', 'keydown', 'touchstart', 'touchmove', 'touchend'].forEach(t => dlg.addEventListener(t, e => e.stopPropagation(), { passive: true }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(form), val = k => String(f.get(k) || '').trim();
    if (val('website')) return;                                      // bots fill the hidden field
    const bad = !val('name') ? 'Please add your name.' : !/^\S+@\S+\.\S+$/.test(val('email')) ? 'Please add a valid email address.'
      : !val('role') ? 'Please choose a role.' : !val('message') ? 'Please tell us a little about yourself.' : '';
    if (bad) { note.textContent = bad; return; }
    let link = val('link'); if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    const btn = form.querySelector('.msg__send'); btn.disabled = true; btn.textContent = 'Sending…'; note.textContent = '';
    try {
      const r = await fetch(`${SB_URL}/rest/v1/sc_applications`, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name: val('name'), email: val('email'), phone: val('phone'), role: val('role'), location: val('location'), link, message: val('message') }) });
      if (!r.ok) throw new Error(r.status);
      form.reset(); about.textContent = ''; form.hidden = true;
      note.textContent = `Thanks, ${val('name').split(/\s+/)[0]}. We’ve got your application and we’ll be in touch if there’s a fit.`;
    } catch (err) {
      note.textContent = 'That didn’t send. Please try again, or email careers@southcircle.io.';
    }
    btn.disabled = false; btn.textContent = 'Send application';
  });
})();
