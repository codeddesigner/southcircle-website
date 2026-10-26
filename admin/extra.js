/* Admin: Content (every piece of text on the site) and Pages (order, names, show or hide).
   Uses the field list from /content.js and saves to the "content" and "pages" settings. */
(() => {
  const { FIELDS, PAGES } = window.SC_CONTENT;
  const getSetting = async key => {
    const r = await api(`/rest/v1/sc_settings?key=eq.${key}&select=value`);
    try { return r && r[0] ? JSON.parse(r[0].value) : null; } catch (e) { return null; }
  };
  const putSetting = (key, value) => api('/rest/v1/sc_settings', { method: 'POST', body: { key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
  const css = document.createElement('style');
  css.textContent = `
    .cgroup{background:var(--card);border-radius:var(--r);padding:18px;margin-bottom:12px}
    .cgroup h3{font-size:17px;font-weight:500;letter-spacing:-.02em;margin-bottom:12px}
    .cgroup .form{gap:12px}
    .cgroup .f textarea{min-height:64px}
    .cbar{position:sticky;bottom:0;display:flex;gap:10px;align-items:center;padding:14px 0;background:var(--paper);border-top:1px solid var(--line);margin-top:8px}
    .pgrow{background:var(--card);border-radius:var(--r);padding:10px 14px;display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center}
    .pgrow.off{opacity:.55}
    .pgrow i{font-style:normal;color:var(--mute);font-size:12px;font-variant-numeric:tabular-nums}
    .pgrow input{font-size:15px;border:1px solid var(--line);border-radius:10px;padding:8px 10px;width:100%;max-width:320px;outline:none;background:#fff}
    .pgrow input:focus{border-color:var(--ink)}
    .pgrow small{display:block;color:var(--mute);font-size:12px;margin-top:3px}
    .tabs button{padding:0 11px}.top__in{gap:16px}.top__right{white-space:nowrap}
    .pgfix{background:transparent;border:1px dashed var(--line);border-radius:var(--r);padding:12px 14px;color:var(--mute);font-size:13px}`;
  document.head.appendChild(css);

  VIEWS.content = async () => {
    const v = $('#view');
    const saved = (await getSetting('content')) || {};
    const groups = [...new Set(FIELDS.map(f => f.group))];
    v.innerHTML = `
      <div class="head"><div><h2>Content</h2><p>All the words on the website. Change any of them and press Save. Leave a box empty to use the original text. For the products statement, put *stars* around the words that should be outlined.</p></div></div>
      <form id="cf2">${groups.map(g => `<div class="cgroup"><h3>${esc(g)}</h3><div class="form">${FIELDS.filter(f => f.group === g).map(f => {
        const val = typeof saved[f.key] === 'string' ? saved[f.key] : f.def;
        return `<label class="f">${esc(f.label)}${f.long ? `<textarea name="${f.key}" rows="2">${esc(val)}</textarea>` : `<input name="${f.key}" value="${esc(val)}">`}</label>`;
      }).join('')}</div></div>`).join('')}
        <div class="cbar"><button class="btn" type="submit">Save content</button><button class="btn ghost" type="button" id="cReset">Restore original text</button><span class="note" id="cnote2"></span></div>
      </form>
      <p style="color:var(--mute);font-size:13px;margin-top:10px">The Stats figures, products, gallery, clients and team are edited in their own tabs.</p>`;
    const form = $('#cf2'), note = $('#cnote2');
    form.onsubmit = async e => {
      e.preventDefault();
      const out = {}; FIELDS.forEach(f => { const x = form.elements[f.key].value.trim(); out[f.key] = x === f.def ? undefined : x; });
      const btn = form.querySelector('[type=submit]'); btn.disabled = true; note.textContent = 'Saving…'; note.className = 'note';
      try { await putSetting('content', JSON.parse(JSON.stringify(out))); note.textContent = ''; toast('Content saved. Reload the site to see it.'); }
      catch (err) { note.textContent = err.message; note.className = 'note err'; }
      btn.disabled = false;
    };
    $('#cReset').onclick = () => { if (!confirm('Put all the original text back in the boxes? Nothing changes on the site until you save.')) return; FIELDS.forEach(f => { form.elements[f.key].value = f.def; }); };
  };

  VIEWS.pages = async () => {
    const v = $('#view');
    const saved = await getSetting('pages');
    let list = Array.isArray(saved) ? saved.filter(p => PAGES.find(d => d.id === p.id)) : [];
    PAGES.forEach(p => { if (!list.find(o => o.id === p.id)) list.push({ ...p }); });
    const render = () => {
      v.innerHTML = `
        <div class="head"><div><h2>Pages</h2><p>The order visitors scroll through the site, and the names in the menu. Use the arrows to move a page, the eye to hide or show it, and type to rename it. The first page and Contact stay first and last.</p></div></div>
        <div class="rows">
          <div class="pgfix">01 · Home (always first)</div>
          ${list.map((p, i) => `
          <div class="pgrow ${p.show === false ? 'off' : ''}" data-i="${i}">
            <i>${p.show === false ? '—' : String(list.slice(0, i + 1).filter(x => x.show !== false).length + 1).padStart(2, '0')}</i>
            <div><input value="${esc(p.label)}" maxlength="24" data-label><small>${p.show === false ? 'Hidden from the site' : 'In the menu as “' + esc(p.label) + '”'}</small></div>
            <div class="row__ctl">
              <button class="icon-btn" data-act="up" title="Move up" ${i ? '' : 'disabled'}>${ICON.up}</button>
              <button class="icon-btn" data-act="down" title="Move down" ${i < list.length - 1 ? '' : 'disabled'}>${ICON.down}</button>
              <button class="icon-btn" data-act="pub" title="${p.show === false ? 'Show on site' : 'Hide from site'}">${p.show === false ? ICON.hidden : ICON.eye}</button>
            </div>
          </div>`).join('')}
          <div class="pgfix">${String(list.filter(x => x.show !== false).length + 2).padStart(2, '0')} · Contact and footer (always last)</div>
        </div>
        <div class="cbar"><button class="btn" id="pgSave">Save order</button><span class="note" id="pgNote">Changes go live when you save.</span></div>`;
    };
    render();
    v.onclick = async e => {
      const b = e.target.closest('[data-act]');
      if (b) {
        const i = +b.closest('[data-i]').dataset.i;
        if (b.dataset.act === 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
        if (b.dataset.act === 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
        if (b.dataset.act === 'pub') list[i].show = list[i].show === false;
        render(); $('#pgNote').textContent = 'Not saved yet.'; return;
      }
      if (e.target.id === 'pgSave') {
        e.target.disabled = true;
        try { await putSetting('pages', list); toast('Page order saved. Reload the site to see it.'); render(); }
        catch (err) { toast(err.message, 1); e.target.disabled = false; }
      }
    };
    v.oninput = e => { const inp = e.target.closest('[data-label]'); if (!inp) return; list[+inp.closest('[data-i]').dataset.i].label = inp.value.trim() || PAGES.find(d => d.id === list[+inp.closest('[data-i]').dataset.i].id).label; $('#pgNote').textContent = 'Not saved yet.'; };
  };
  /* Settings: the intro animation, and whether visitors pick the site's colour or it stays one colour */
  const THEMES = [['light', 'Light', '#f3f1ec'], ['dark', 'Dark', '#0d0d0d'], ['orange', 'Orange', '#ff4a12'], ['green', 'Green', '#1ea866'], ['blue', 'Blue', '#2d3cff'], ['lime', 'Lime', '#57ff1a'], ['custom', 'Custom', '']];
  css.textContent += `.sw{display:flex;gap:10px;flex-wrap:wrap}.sw label{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:99px;padding:6px 12px 6px 6px;background:#fff;cursor:pointer;font-size:14px;color:var(--ink)}
    .sw label:has(input:checked){border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}.sw input{position:absolute;opacity:0;pointer-events:none}.sw i{width:22px;height:22px;border-radius:50%;border:1px solid var(--line)}
    .opt{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:var(--ink);cursor:pointer}.opt input{width:auto;margin-top:4px}.opt small{display:block;color:var(--mute);font-size:13px;margin-top:2px}
    .tog{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:15px;color:var(--ink)}.tog small{display:block;color:var(--mute);font-size:13px}
    .tog input{appearance:none;width:44px;height:26px;border-radius:99px;background:#d9d6cf;position:relative;cursor:pointer;flex:none;transition:background .2s}
    .tog input::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}
    .tog input:checked{background:var(--ink)}.tog input:checked::after{transform:translateX(18px)}`;
  VIEWS.settings = async () => {
    const v = $('#view');
    const raw = (await getSetting('site')) || {};
    const s = Object.assign({ intro: true, theme: 'blue', custom: '#7a3cff' }, raw);
    s.popup = 'popup' in raw ? raw.popup !== false : raw.picker !== false;   // older saves had one switch for both
    s.button = 'button' in raw ? raw.button !== false : raw.picker !== false;
    const tog = (name, on, title, sub) => `<label class="tog"><span>${title}<small>${sub}</small></span><input type="checkbox" name="${name}" ${on ? 'checked' : ''}></label>`;
    v.innerHTML = `
      <div class="head"><div><h2>Settings</h2><p>How the website opens and how its colours work.</p></div></div>
      <form id="sf">
        <div class="cgroup"><h3>Intro animation</h3>
          ${tog('intro', s.intro, 'Show the intro animation when the site opens', 'The “We build products with…” word animation. Turn it off to go straight to the home page.')}
        </div>
        <div class="cgroup"><h3>Colour</h3>
          <div class="form" style="gap:18px">
            ${tog('popup', s.popup, 'Ask new visitors to pick a colour when the site opens', 'The “Pick a colour for the site” window on a first visit.')}
            ${tog('button', s.button, 'Show the colour button in the menu', 'The half-filled circle at the top right that lets anyone change the colour at any time.')}
            <div id="sfFixed">
              <p style="font-size:15px;color:var(--ink);margin-bottom:4px" id="sfLabel"></p>
              <p style="font-size:13px;color:var(--mute);margin-bottom:10px" id="sfHelp"></p>
              <div class="sw">${THEMES.map(([k, l, c]) => `<label><input type="radio" name="theme" value="${k}" ${s.theme === k ? 'checked' : ''}><i style="background:${k === 'custom' ? esc(s.custom) : c}"></i>${l}</label>`).join('')}</div>
              <label class="f" id="sfCustom" style="margin-top:12px;max-width:260px" ${s.theme === 'custom' ? '' : 'hidden'}>Custom colour<span class="color"><input type="color" name="custom" value="${esc(s.custom)}"><input name="customx" value="${esc(s.custom)}" maxlength="7"></span></label>
            </div>
          </div>
        </div>
        <div class="cbar"><button class="btn" type="submit">Save settings</button><span class="note" id="sfNote">Changes reach visitors the next time they open the site.</span></div>
      </form>`;
    const f = $('#sf');
    const sync = () => {
      const popup = f.elements.popup.checked, button = f.elements.button.checked;
      $('#sfFixed').hidden = popup;                                     // asked on arrival: they choose, no starting colour needed
      $('#sfLabel').textContent = button ? 'Starting colour' : 'Site colour';
      $('#sfHelp').textContent = button ? 'Visitors start in this colour and can change it with the button in the menu.' : 'Everyone sees the site in this colour.';
      $('#sfCustom').hidden = new FormData(f).get('theme') !== 'custom';
    };
    sync();
    f.oninput = e => {
      if (e.target.name === 'custom') f.elements.customx.value = e.target.value;
      if (e.target.name === 'customx' && /^#[0-9a-f]{6}$/i.test(e.target.value)) f.elements.custom.value = e.target.value;
      const sw = f.querySelector('input[name=theme][value=custom] + i'); if (sw) sw.style.background = f.elements.custom.value;
      sync(); $('#sfNote').textContent = 'Not saved yet.';
    };
    f.onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(f), btn = f.querySelector('[type=submit]');
      const out = { intro: !!fd.get('intro'), popup: !!fd.get('popup'), button: !!fd.get('button'), theme: fd.get('theme') || 'blue', custom: fd.get('custom') || '#7a3cff' };
      btn.disabled = true;
      try { await putSetting('site', out); $('#sfNote').textContent = 'Saved.'; toast('Settings saved. Reload the site to see them.'); }
      catch (err) { $('#sfNote').textContent = err.message; }
      btn.disabled = false;
    };
  };
  /* Settings → Privacy policy: the text on southcircle.io/privacy (standard text from /privacy.js) */
  const privacyDefault = () => window.SC_PRIVACY_DEFAULT ? Promise.resolve() : new Promise(res => {
    const s = document.createElement('script'); s.src = '/privacy.js?t=' + Date.now(); s.onload = s.onerror = res; document.head.appendChild(s);
  });
  const settingsView = VIEWS.settings;
  VIEWS.settings = async () => {
    await settingsView();
    await privacyDefault();
    const saved = (await getSetting('privacy')) || {};
    const box = document.createElement('form');
    box.className = 'cgroup'; box.id = 'pvf';
    box.innerHTML = `<h3>Privacy policy</h3>
      <p style="font-size:13px;color:var(--mute);margin:-4px 0 12px">The page at <a href="/privacy" target="_blank" rel="noopener">southcircle.io/privacy</a>, linked in the footer. Start a line with “## ” for a heading and “- ” for a bullet point; leave an empty line between paragraphs.</p>
      <label class="f"><textarea name="text" rows="18" style="font-size:14px;line-height:1.55">${esc(saved.text || window.SC_PRIVACY_DEFAULT || '')}</textarea></label>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px"><button class="btn" type="submit">Save privacy policy</button><button class="btn ghost" type="button" id="pvReset">Restore the standard text</button><span class="note" id="pvNote">${saved.updated ? 'Last updated ' + esc(saved.updated) : 'Showing the standard policy.'}</span></div>`;
    $('#sf').after(box);
    $('#pvReset').onclick = () => { if (confirm('Replace the text in the box with the standard policy? Nothing changes on the site until you save.')) box.elements.text.value = window.SC_PRIVACY_DEFAULT || ''; };
    box.onsubmit = async e => {
      e.preventDefault();
      const text = box.elements.text.value.trim(), btn = box.querySelector('[type=submit]');
      const updated = new Date().toISOString().slice(0, 10);
      btn.disabled = true;
      try { await putSetting('privacy', { text, updated }); $('#pvNote').textContent = 'Saved. Last updated ' + updated; toast('Privacy policy saved'); }
      catch (err) { $('#pvNote').textContent = err.message; }
      btn.disabled = false;
    };
  };

  /* Hiring: the roles in the Careers "Join us" form, and the applications that come in */
  const ROLE_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  css.textContent += '@media (max-width:1400px){.top__in{flex-wrap:wrap;row-gap:10px}.tabs{order:3;width:100%;margin-left:0}}';   // ten tabs: give them their own row
  let hiringBox = 'new';
  const unreadApps = async () => {
    try {
      const r = await api('/rest/v1/sc_applications?select=id&read=eq.false&archived=eq.false');
      const b = $('#unreadApps'); if (b) { b.textContent = r.length; b.hidden = !r.length; }
    } catch (e) {}
  };
  VIEWS.hiring = async () => {
    const v = $('#view');
    let apps = await db.list('sc_applications', 'order=created_at.desc'), roles = await db.list('sc_roles'), sel = null, part = 'apps';
    const render = () => {
      const list = apps.filter(a => hiringBox === 'new' ? !a.archived : a.archived);
      if (sel && !list.find(a => a.id === sel)) sel = null;
      const cur = list.find(a => a.id === sel);
      const unread = apps.filter(a => !a.read && !a.archived).length;
      v.innerHTML = `
        <div class="head"><div><h2>Hiring</h2><p>Applications sent from “Join us” on the Careers page, and the roles people can choose in that form.</p></div>
          <div class="head__actions"><div class="seg"><button data-part="apps" class="${part === 'apps' ? 'on' : ''}">Applications${unread ? ` (${unread})` : ''}</button><button data-part="roles" class="${part === 'roles' ? 'on' : ''}">Roles (${roles.filter(r => r.published).length} open)</button></div>
          ${part === 'roles' ? '<button class="btn" data-addrole>Add role</button>' : ''}</div></div>
        ${part === 'apps' ? `
          <div style="margin-bottom:14px"><div class="seg"><button data-box="new" class="${hiringBox === 'new' ? 'on' : ''}">Inbox</button><button data-box="archived" class="${hiringBox === 'archived' ? 'on' : ''}">Archived</button></div></div>
          ${list.length ? `<div class="inbox">
            <div class="mlist">${list.map(a => `<button class="mitem ${a.read ? '' : 'unread'} ${a.id === sel ? 'on' : ''}" data-id="${a.id}"><time>${when(a.created_at)}</time><b>${esc(a.name)}</b><span>${esc(a.role || 'No role chosen')}</span></button>`).join('')}</div>
            <div class="mview">${cur ? `
              <h3>${esc(cur.name)}</h3>
              <div class="meta"><span><b style="font-weight:500;color:var(--ink)">${esc(cur.role || 'No role chosen')}</b></span><a href="mailto:${esc(cur.email)}">${esc(cur.email)}</a>${cur.phone ? `<a href="tel:${esc(cur.phone)}">${esc(cur.phone)}</a>` : ''}${cur.location ? `<span>${esc(cur.location)}</span>` : ''}<span>${new Date(cur.created_at).toLocaleString()}</span></div>
              ${cur.link ? `<p style="margin-bottom:14px"><a href="${esc(cur.link)}" target="_blank" rel="noopener noreferrer">${esc(cur.link)} ↗</a></p>` : ''}
              <div class="body">${esc(cur.message)}</div>
              <div class="actions">
                <a class="btn" href="mailto:${esc(cur.email)}?subject=${encodeURIComponent('Your application to South Circle' + (cur.role ? ': ' + cur.role : ''))}">Reply by email</a>
                <button class="btn ghost" data-act="read">${cur.read ? 'Mark as unread' : 'Mark as read'}</button>
                <button class="btn ghost" data-act="archive">${cur.archived ? 'Move to inbox' : 'Archive'}</button>
                <button class="btn danger" data-act="delete">Delete</button>
              </div>` : '<p style="color:var(--mute)">Pick an application to read it.</p>'}</div>
          </div>` : `<div class="empty">${hiringBox === 'new' ? 'No applications yet. When someone uses “Join us” on the Careers page, it shows up here.' : 'Nothing archived.'}</div>`}`
        : roles.length ? `<div class="rows">${roles.map((r, i) => `
          <div class="row ${r.published ? '' : 'off'}" data-i="${i}">
            <span class="clogo"><svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="12" height="8.5" rx="1.5"/><path d="M5.5 5V3.5h5V5M2 9h12"/></svg></span>
            <div><div class="row__title">${esc(r.title)}</div><div class="row__sub">${esc([r.team, r.type, r.location].filter(Boolean).join(' · ') || 'No details')}${r.published ? '' : ' · hidden from the form'}</div></div>
            <div class="row__ctl">
              <button class="icon-btn" data-ract="up" title="Move up" ${i ? '' : 'disabled'}>${ICON.up}</button>
              <button class="icon-btn" data-ract="down" title="Move down" ${i < roles.length - 1 ? '' : 'disabled'}>${ICON.down}</button>
              <button class="icon-btn" data-ract="pub" title="${r.published ? 'Close this role (hide it from the form)' : 'Open this role'}">${r.published ? ICON.eye : ICON.hidden}</button>
              <button class="icon-btn" data-ract="edit" title="Edit">${ICON.edit}</button>
              <button class="icon-btn" data-ract="del" title="Delete">${ICON.trash}</button>
            </div>
          </div>`).join('')}</div>`
        : '<div class="empty">No roles yet. Until you add one, the form offers “General application”.</div>'}`;
    };
    const reload = async () => { [apps, roles] = await Promise.all([db.list('sc_applications', 'order=created_at.desc'), db.list('sc_roles')]); render(); unreadApps(); };
    const editRole = r => {
      const n = !r; r = r || { title: '', team: '', type: 'Full-time', location: 'Lagos / Remote', description: '', published: true };
      openDrawer(`
        <div class="drawer__head"><h3>${n ? 'Add role' : 'Edit role'}</h3><button class="icon-btn" data-close title="Close">×</button></div>
        <form class="form" id="rf">
          <label class="f">Role title<input name="title" required maxlength="120" value="${esc(r.title)}" placeholder="Senior Product Designer"></label>
          <div class="grid2">
            <label class="f">Team <i style="font-style:normal">(optional)</i><input name="team" maxlength="60" value="${esc(r.team)}" placeholder="Design"></label>
            <label class="f">Type<select name="type">${ROLE_TYPES.map(t => `<option ${t === r.type ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
          </div>
          <label class="f">Location<input name="location" maxlength="80" value="${esc(r.location)}" placeholder="Lagos / Remote"></label>
          <label class="f">Short description <i style="font-style:normal">(optional)</i><textarea name="description" rows="3" maxlength="240" placeholder="What they’ll do, in a sentence.">${esc(r.description)}</textarea><small>Shows under the dropdown when someone picks this role.</small></label>
          <label class="f" style="display:flex;flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" name="published" ${r.published ? 'checked' : ''} style="width:auto"> Open: show it in the Join us form</label>
          <div class="drawer__foot"><button class="btn" type="submit">${n ? 'Add role' : 'Save changes'}</button><button class="btn ghost" type="button" data-close>Cancel</button><span class="note" id="rnote"></span></div>
        </form>`);
      $('#rf').onsubmit = async e => {
        e.preventDefault();
        const f = new FormData(e.target);
        const row = { title: f.get('title').trim(), team: f.get('team').trim(), type: f.get('type'), location: f.get('location').trim(), description: f.get('description').trim(), published: !!f.get('published'), updated_at: new Date().toISOString() };
        if (!row.title) { $('#rnote').textContent = 'Give the role a title.'; $('#rnote').className = 'note err'; return; }
        try {
          if (n) await db.insert('sc_roles', { ...row, sort: nextSort(roles) }); else await db.update('sc_roles', r.id, row);
          closeDrawer(); toast(n ? 'Role added' : 'Saved'); await reload();
        } catch (err) { $('#rnote').textContent = err.message; $('#rnote').className = 'note err'; }
      };
    };
    render();
    v.onclick = async e => {
      const pt = e.target.closest('[data-part]'); if (pt) { part = pt.dataset.part; render(); return; }
      const bx = e.target.closest('[data-box]'); if (bx) { hiringBox = bx.dataset.box; sel = null; render(); return; }
      if (e.target.closest('[data-addrole]')) return editRole(null);
      const it = e.target.closest('.mitem');
      if (it) {
        sel = it.dataset.id; const a = apps.find(x => x.id === sel);
        if (a && !a.read) { a.read = true; db.update('sc_applications', a.id, { read: true }).then(unreadApps).catch(err => toast(err.message, 1)); }
        render(); return;
      }
      const ra = e.target.closest('[data-ract]');
      if (ra) {
        const i = +ra.closest('[data-i]').dataset.i, r = roles[i];
        try {
          if (ra.dataset.ract === 'edit') return editRole(r);
          if (ra.dataset.ract === 'up' || ra.dataset.ract === 'down') await move('sc_roles', roles, i, ra.dataset.ract === 'up' ? -1 : 1);
          if (ra.dataset.ract === 'pub') { await db.update('sc_roles', r.id, { published: !r.published }); toast(r.published ? 'Role closed: hidden from the form' : 'Role open: shown in the form'); }
          if (ra.dataset.ract === 'del') { if (!confirm(`Delete the role “${r.title}”?`)) return; await db.remove('sc_roles', r.id); toast('Deleted'); }
          await reload();
        } catch (err) { toast(err.message, 1); }
        return;
      }
      const act = e.target.closest('[data-act]'); if (!act) return;
      const a = apps.find(x => x.id === sel); if (!a) return;
      try {
        if (act.dataset.act === 'read') { a.read = !a.read; await db.update('sc_applications', a.id, { read: a.read }); }
        if (act.dataset.act === 'archive') { a.archived = !a.archived; await db.update('sc_applications', a.id, { archived: a.archived }); toast(a.archived ? 'Archived' : 'Moved to inbox'); sel = null; }
        if (act.dataset.act === 'delete') { if (!confirm(`Delete the application from ${a.name}? This can’t be undone.`)) return; await db.remove('sc_applications', a.id); apps = apps.filter(x => x.id !== a.id); sel = null; toast('Deleted'); }
        render(); unreadApps();
      } catch (err) { toast(err.message, 1); }
    };
  };

  const tabsEl = document.getElementById('tabs');
  if (!tabsEl.querySelector('[data-tab="hiring"]')) {
    const b = document.createElement('button'); b.dataset.tab = 'hiring'; b.innerHTML = 'Hiring <i class="badge" id="unreadApps" hidden></i>';
    tabsEl.insertBefore(b, tabsEl.querySelector('[data-tab="content"]'));
  }
  if (!tabsEl.querySelector('[data-tab="settings"]')) {
    const b = document.createElement('button'); b.dataset.tab = 'settings'; b.textContent = 'Settings';
    tabsEl.appendChild(b);
  }
  /* every tab change also refreshes the Hiring count; opening /admin/hiring directly (or reloading it)
     lands on Hiring rather than the inbox */
  const opened = new URL((performance.getEntriesByType('navigation')[0] || {}).name || location.href).pathname.split('/')[2];
  const goTo = go; let first = opened === 'hiring';
  go = t => { if (first) { first = false; if (t === 'inbox') t = 'hiring'; } const r = goTo(t); unreadApps(); return r; };
  if (first && !$('#app').hidden) go('inbox');                     // signed in before this file loaded: switch over now
  /* Products → Showcase cards: the cards that float around a product's name when it's opened on the site.
     Each card is a photo, a video, a text card, the product's icon or its animation. Everything saves as it changes. */
  css.textContent += `
    .scl{display:flex;flex-direction:column;gap:10px}
    .scc{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;display:grid;grid-template-columns:72px 1fr;gap:12px;align-items:start}
    .scc__th{width:72px;height:72px;border-radius:9px;overflow:hidden;background:#e9e6df;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;line-height:1.15;padding:4px;box-sizing:border-box;color:var(--mute)}
    .scc__th img,.scc__th video{width:72px;height:72px;object-fit:cover;display:block;margin:-4px}
    .scc__th svg{width:60%;height:60%}
    .scc__th b{font-weight:500;font-size:11px;word-break:break-word}
    .scc__th small{display:block;font-size:8px;text-transform:uppercase;letter-spacing:.06em;opacity:.65;margin-bottom:2px}
    .scc__top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .scc__top select{font:inherit;font-size:14px;border:1px solid var(--line);border-radius:9px;padding:6px 8px;background:#fff;color:var(--ink)}
    .scc__top .sp{flex:1}
    .scc__top .icon-btn{width:30px;height:30px}
    .scc__n{font-size:11px;color:var(--mute);font-variant-numeric:tabular-nums;min-width:16px}
    .scc__body{margin-top:8px;display:flex;flex-direction:column;gap:8px}
    .scc__body input:not([type=color]),.scc__body textarea{font:inherit;font-size:14px;border:1px solid var(--line);border-radius:9px;padding:7px 9px;width:100%;box-sizing:border-box;background:#fff;color:var(--ink);outline:none}
    .scc__body input:focus,.scc__body textarea:focus{border-color:var(--ink)}
    .scc__body small{color:var(--mute);font-size:12px}
    .scc__cols{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--mute)}
    .scc__cols label{display:flex;align-items:center;gap:6px}
    .scc__cols input[type=color]{width:30px;height:26px;border:1px solid var(--line);border-radius:6px;padding:0;background:none}
    .scc.over{border-color:var(--ink)}
    .scadd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:transparent;border:1px dashed var(--line);border-radius:12px;padding:12px}
    .scadd select{font:inherit;font-size:14px;border:1px solid var(--line);border-radius:9px;padding:7px 8px;background:#fff;color:var(--ink)}
    .scadd small{flex-basis:100%;color:var(--mute);font-size:12px}
    .scadd.over{border-color:var(--ink);background:var(--card)}
    .btn.sm.scbtn{display:inline-flex;align-items:center;gap:6px}.scbtn svg{width:15px;height:15px}
    @media (max-width:640px){.row__ctl .scbtn{font-size:0;gap:0;padding:0 9px}}`;
  const FILM = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="12" height="10" rx="2"/><path d="m6.8 6 3 2-3 2z" fill="currentColor"/></svg>';
  const KINDS = [['image', 'Image'], ['video', 'Video'], ['text', 'Text card'], ['icon', 'Product icon'], ['anim', 'Product animation']];
  const shapeOf = file => new Promise(res => {                      // height ÷ width, so the site can lay cards out before they load
    const u = URL.createObjectURL(file), done = r => { URL.revokeObjectURL(u); res(Math.round(r * 1000) / 1000); };
    if (file.type.startsWith('video/')) { const v = document.createElement('video'); v.preload = 'metadata'; v.onloadedmetadata = () => done(v.videoHeight / v.videoWidth || 0.5625); v.onerror = () => done(0.5625); v.src = u; }
    else { const i = new Image(); i.onload = () => done(i.naturalHeight / i.naturalWidth || 1); i.onerror = () => done(1); i.src = u; }
  });
  async function uploadMedia(file) {
    const r = await shapeOf(file);
    if (file.type.startsWith('image/')) return { type: 'image', url: await upload(file, 'showcase', 2000), r };
    if (!/^video\/(mp4|webm|quicktime)$/.test(file.type)) throw new Error(`${file.name}: use an image, or an MP4, WebM or MOV video.`);
    if (file.size > 50 * 1024 * 1024) throw new Error(`${file.name} is over 50 MB. Export a shorter or smaller version (MP4, 1080p) and try again.`);
    const ext = { 'video/webm': 'webm', 'video/quicktime': 'mov' }[file.type] || 'mp4';
    const path = `showcase/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await api(`/storage/v1/object/${BUCKET}/${path}`, { method: 'POST', body: file, raw: true, headers: { 'Content-Type': file.type, 'x-upsert': 'false', 'cache-control': '31536000' } });
    return { type: 'video', url: `${SB_URL}/storage/v1/object/public/${BUCKET}/${path}`, r };
  }
  const pickKind = async (kind, multiple) => {                      // the file box only offers the kind chosen
    const pk = $('#picker'); pk.accept = kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : kind === 'image' ? 'image/*' : 'image/*,video/*';
    const files = await pick(multiple); pk.accept = 'image/*'; return files;
  };
  /* the cards the site makes from a product's details when it has none of its own (same as the site) */
  const madeCards = p => [{ type: 'icon' },
    p.tag && { type: 'text', label: '', text: p.tag, bg: '#f3f1ec', fg: '#0a0a0a' },
    p.anim && { type: 'anim' },
    p.category && { type: 'text', label: 'Category', text: p.category, bg: '#1c1c1c', fg: '#f3f1ec' },
    p.status && { type: 'text', label: '', text: p.status, bg: p.bg || '#ff4a12', fg: p.fg || '#0b0b0b' },
    p.platforms && { type: 'text', label: 'Platforms', text: String(p.platforms).split(',').map(s => s.trim()).filter(Boolean).join('\n'), bg: '#e9e6df', fg: '#0a0a0a' },
    p.year && { type: 'text', label: 'Since', text: p.year, bg: '#2a2a2a', fg: '#f3f1ec' }].filter(Boolean);

  async function showcase(i) {
    const p = (await db.list('sc_products'))[i]; if (!p) return;
    const own = Array.isArray(p.media) && p.media.length;
    let cards = own ? p.media.map(m => ({ ...m })) : madeCards(p), saving = null, pending = false;
    const dot = `<span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;border-radius:9px;margin:-4px;width:72px;height:72px;background:${esc(p.bg)};color:${esc(p.fg)}">${p.icon_url ? `<img src="${esc(p.icon_url)}" alt="" style="width:60%;height:60%;object-fit:contain">` : `<svg viewBox="0 0 24 24" fill="currentColor">${p.mark || '<circle cx="12" cy="12" r="6"/>'}</svg>`}</span>`;
    openDrawer(`
      <div class="drawer__head"><h3>Showcase cards: ${esc(p.name)}</h3><button class="icon-btn" data-close title="Close">×</button></div>
      <div class="form">
        <p style="color:var(--mute);font-size:13px">When someone clicks ${esc(p.name)} on the Products page, it opens full screen with these cards floating around its name. Pick what each card is in its dropdown. The first 9 show (6 on phones), in this order. Changes save straight away.</p>
        <p id="scAuto" style="font-size:13px;background:var(--card);border-radius:10px;padding:10px 12px" ${own ? 'hidden' : ''}>These cards are made from ${esc(p.name)}’s details. Change, add or remove any of them to make them your own.</p>
        <div class="scl" id="scl"></div>
        <div class="scadd" id="scadd"><b style="font-weight:500;font-size:14px">Add a card</b><select id="scKind">${KINDS.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select><button type="button" class="btn sm" id="scAdd">Add</button>
          <small>Images, or MP4 / WebM / MOV videos up to 50 MB (short, silent loops work best: they play muted on repeat). You can also drop files here.</small></div>
        <label class="f">Highlights<textarea id="mhl" rows="5" maxlength="300" placeholder="One per line, e.g.&#10;Instant invoices&#10;Bank sync&#10;Offline mode">${esc(p.highlights || '')}</textarea><small>Up to 6 short lines, shown large in the bottom corner. Leave empty to use the category, platforms and status.</small></label>
        <span class="note" id="mnote"></span>
      </div>`);
    const note = (t, err) => { const n = $('#mnote'); if (n) { n.textContent = t; n.className = 'note' + (err ? ' err' : ''); } };
    const save = async () => {                                        // one save at a time; the newest state always wins
      if (saving) { pending = true; return; }
      saving = true; note('Saving…');
      try { await db.update('sc_products', p.id, { media: cards }); note('Saved'); if ($('#scAuto')) $('#scAuto').hidden = true; }
      catch (err) { note(err.message, 1); }
      saving = null;
      if (pending) { pending = false; save(); }
    };
    let typing; const saveSoon = () => { clearTimeout(typing); note('Not saved yet…'); typing = setTimeout(save, 600); };
    const thumb = c => c.type === 'image' ? (c.url ? `<img src="${esc(c.url)}" alt="">` : 'No image yet')
      : c.type === 'video' ? (c.url ? `<video src="${esc(c.url)}" muted loop autoplay playsinline></video>` : 'No video yet')
      : c.type === 'icon' ? dot
      : c.type === 'anim' ? `<span style="display:flex;align-items:center;justify-content:center;margin:-4px;width:72px;height:72px;background:${esc(p.fg)};color:${esc(p.bg)};font-size:10px">Animation</span>`
      : `<span style="display:flex;flex-direction:column;align-items:center;justify-content:center;margin:-4px;width:72px;height:72px;padding:6px;box-sizing:border-box;background:${esc(c.bg || '#f3f1ec')};color:${esc(c.fg || '#0a0a0a')}">${c.label ? `<small>${esc(c.label)}</small>` : ''}<b>${esc(c.text || 'Text')}</b></span>`;
    const body = (c, k) => c.type === 'image' || c.type === 'video'
      ? `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="button" class="btn ghost sm" data-c="file">${c.url ? 'Replace' : 'Upload'} ${c.type === 'video' ? 'video' : 'image'}</button><small>${c.url ? (c.type === 'video' ? 'Plays muted on repeat.' : '') : 'Nothing shows for this card until a file is uploaded.'}</small></div>`
      : c.type === 'text'
        ? `<input data-f="label" maxlength="30" value="${esc(c.label || '')}" placeholder="Small label (optional), e.g. Category">
           <textarea data-f="text" rows="2" maxlength="120" placeholder="The words on the card">${esc(c.text || '')}</textarea>
           <div class="scc__cols"><label>Background <input type="color" data-f="bg" value="${esc(c.bg || '#f3f1ec')}"></label><label>Text <input type="color" data-f="fg" value="${esc(c.fg || '#0a0a0a')}"></label></div>`
        : `<small>${c.type === 'icon' ? 'The product’s icon in its own colours (change them in Edit product).' : 'The card animation chosen in Edit product, in the product’s colours.'}</small>`;
    const draw = () => {
      $('#scl').innerHTML = cards.length ? cards.map((c, k) => `
        <div class="scc" data-k="${k}">
          <div class="scc__th">${thumb(c)}</div>
          <div><div class="scc__top"><span class="scc__n">${k + 1}</span>
            <select data-c="kind" title="What this card is">${KINDS.map(([v, l]) => `<option value="${v}" ${v === c.type ? 'selected' : ''}>${l}</option>`).join('')}</select><span class="sp"></span>
            <button class="icon-btn" data-c="up" title="Move earlier" ${k ? '' : 'disabled'}>${ICON.up}</button>
            <button class="icon-btn" data-c="down" title="Move later" ${k < cards.length - 1 ? '' : 'disabled'}>${ICON.down}</button>
            <button class="icon-btn" data-c="del" title="Remove this card">${ICON.trash}</button></div>
            <div class="scc__body">${body(c, k)}</div></div>
        </div>`).join('') : `<p style="color:var(--mute);font-size:13px">No cards. Add one below, or the site makes them from the product’s details.</p>`;
    };
    draw();
    const fileInto = async (k, files) => {                            // put a file in card k (or new cards after it)
      let at = k, done = 0;
      for (const f of files) {
        note(`Uploading ${f.name}…`);
        try {
          const m = await uploadMedia(f), old = cards[at];
          if (old && (old.type === 'image' || old.type === 'video') && !done) { if (old.url) removeFile(old.url); cards[at] = m; }
          else cards.splice(++at, 0, m);
          done++; draw(); await save();
        } catch (err) { note(err.message, 1); }
      }
      if (done) toast(done > 1 ? `${done} cards added` : 'Uploaded');
    };
    $('#scl').addEventListener('click', async e => {
      const b = e.target.closest('[data-c]'); if (!b || b.tagName === 'SELECT') return;
      const k = +b.closest('[data-k]').dataset.k, c = cards[k];
      if (b.dataset.c === 'file') return fileInto(k, (await pickKind(c.type)).slice(0, 1));
      if (b.dataset.c === 'up' && k) [cards[k - 1], cards[k]] = [cards[k], cards[k - 1]];
      if (b.dataset.c === 'down' && k < cards.length - 1) [cards[k + 1], cards[k]] = [cards[k], cards[k + 1]];
      if (b.dataset.c === 'del') { if (!confirm('Remove this card?')) return; cards.splice(k, 1); if (c.url) removeFile(c.url); }
      draw(); save();
    });
    $('#scl').addEventListener('change', async e => {
      const s = e.target.closest('[data-c="kind"]'); if (!s) return;
      const k = +s.closest('[data-k]').dataset.k, c = cards[k], to = s.value;
      if (c.url && !confirm(`Change this card to ${KINDS.find(x => x[0] === to)[1].toLowerCase()}? Its ${c.type} will be removed.`)) { s.value = c.type; return; }
      if (c.url) removeFile(c.url);
      cards[k] = to === 'text' ? { type: 'text', label: '', text: '', bg: '#f3f1ec', fg: '#0a0a0a' } : { type: to };
      draw(); save();
      if (to === 'image' || to === 'video') fileInto(k, (await pickKind(to)).slice(0, 1));
      if (to === 'text') $(`#scl [data-k="${k}"] [data-f="text"]`)?.focus();
    });
    $('#scl').addEventListener('input', e => {
      const f = e.target.closest('[data-f]'); if (!f) return;
      const box = f.closest('[data-k]'), c = cards[+box.dataset.k];
      c[f.dataset.f] = f.value;
      box.querySelector('.scc__th').innerHTML = thumb(c);
      saveSoon();
    });
    $('#scAdd').onclick = async () => {
      const kind = $('#scKind').value;
      if (kind === 'image' || kind === 'video') { const files = await pickKind(kind, true); if (files.length) { cards.push({ type: kind }); await fileInto(cards.length - 1, files); } return; }
      cards.push(kind === 'text' ? { type: 'text', label: '', text: '', bg: '#f3f1ec', fg: '#0a0a0a' } : { type: kind });
      draw(); save();
      $('#scl').lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      if (kind === 'text') $('#scl').lastElementChild?.querySelector('[data-f="text"]')?.focus();
    };
    const dz = $('#scadd');                                           // dropping files adds them as cards
    dz.ondragover = e => { e.preventDefault(); dz.classList.add('over'); };
    dz.ondragleave = () => dz.classList.remove('over');
    dz.ondrop = async e => { e.preventDefault(); dz.classList.remove('over'); const files = [...e.dataTransfer.files].filter(f => /^(image|video)\//.test(f.type)); if (files.length) { cards.push({ type: files[0].type.startsWith('video/') ? 'video' : 'image' }); await fileInto(cards.length - 1, files); } };
    $('#mhl').onchange = async e => {
      const v = e.target.value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 6).join('\n');
      e.target.value = v;
      try { await db.update('sc_products', p.id, { highlights: v }); toast('Highlights saved'); } catch (err) { note(err.message, 1); }
    };
  }
  /* a "Showcase" button on each product row, and a way in from the Edit product window */
  let editing = -1;
  const addShowcaseButtons = () => {
    if (tab !== 'products') return;
    document.querySelectorAll('#view .row[data-i] .row__ctl').forEach(ctl => {
      if (ctl.querySelector('[data-show]')) return;
      const b = document.createElement('button');
      b.className = 'btn ghost sm scbtn'; b.dataset.show = ''; b.title = 'The photos, videos and cards shown when this product is opened'; b.innerHTML = FILM + ' Showcase';
      ctl.insertBefore(b, ctl.firstChild);
    });
  };
  new MutationObserver(addShowcaseButtons).observe(document.getElementById('view'), { childList: true });
  document.getElementById('view').addEventListener('click', e => {
    const b = e.target.closest('[data-show]'); if (b) return showcase(+b.closest('[data-i]').dataset.i);
    const ed = e.target.closest('[data-act="edit"]'); if (ed && tab === 'products') editing = +ed.closest('[data-i]').dataset.i;
  }, true);
  new MutationObserver(() => {                                       // Edit product: a link to its showcase cards
    const f = document.getElementById('pf'); if (!f || f.querySelector('.scjump') || editing < 0) return;
    const i = editing;
    const d = document.createElement('div'); d.className = 'f scjump';
    d.innerHTML = `Showcase cards<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="button" class="btn ghost sm scbtn">${FILM} Edit showcase cards</button></span><small>The photos, videos and text cards that float around the name when the product is opened on the site.</small>`;
    d.querySelector('button').onclick = () => showcase(i);
    f.insertBefore(d, f.querySelector('.drawer__foot'));
  }).observe(document.getElementById('drawerPanel'), { childList: true });
  document.getElementById('view').addEventListener('click', e => { if (e.target.closest('[data-add]') && tab === 'products') editing = -1; }, true);

  /* Team (Careers page): name, what they worked as, what they do now, social links, photo */
  /* one box per network; saved in the "links" column as "Label | url" lines */
  const SOC = [['instagram', 'Instagram', 'instagram.com/name'], ['x', 'X', 'x.com/name'], ['linkedin', 'LinkedIn', 'linkedin.com/in/name'], ['behance', 'Behance', 'behance.net/name'], ['dribbble', 'Dribbble', 'dribbble.com/name'], ['website', 'Website', 'name.com']];
  const socOf = text => {
    const out = {};
    String(text || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
      let [label, url] = l.includes('|') ? l.split('|').map(s => s.trim()) : ['', l];
      const hit = SOC.find(([k, lb]) => lb.toLowerCase() === label.toLowerCase()) || SOC.find(([k]) => k !== 'website' && (url.toLowerCase().includes(k + '.') || (k === 'x' && /twitter\.com|\bx\.com/i.test(url))));
      const key = hit ? hit[0] : 'website';
      if (!out[key]) out[key] = url;
    });
    return out;
  };
  css.textContent += '.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.sgrid{grid-template-columns:1fr}}';
  VIEWS.team = async () => {
    const v = $('#view');
    let list = await db.list('sc_team');
    const face = t => `<span class="tface">${t.photo_url ? `<img src="${esc(t.photo_url)}" alt="">` : esc((t.name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase())}</span>`;
    const render = () => {
      v.innerHTML = `
        <div class="head"><div><h2>Team</h2><p>Past and present team on the Careers page. Each person is a floating circle; hovering it shows their name, what they worked as, what they do now and their links. A square photo of a face works best.</p></div>
          <div class="head__actions"><button class="btn" data-add>Add person</button></div></div>
        ${list.length ? `<div class="rows">${list.map((t, i) => `
          <div class="row ${t.published ? '' : 'off'}" data-i="${i}">
            ${face(t)}
            <div><div class="row__title">${esc(t.name)}</div><div class="row__sub">${t.role ? 'Worked as ' + esc(t.role) : 'No role yet'}${t.currently ? ' · Currently: ' + esc(t.currently) : ''}</div></div>
            <div class="row__ctl">
              <button class="icon-btn" data-act="up" title="Move up" ${i ? '' : 'disabled'}>${ICON.up}</button>
              <button class="icon-btn" data-act="down" title="Move down" ${i < list.length - 1 ? '' : 'disabled'}>${ICON.down}</button>
              <button class="icon-btn" data-act="pub" title="${t.published ? 'Hide from site' : 'Show on site'}">${t.published ? ICON.eye : ICON.hidden}</button>
              <button class="icon-btn" data-act="edit" title="Edit">${ICON.edit}</button>
              <button class="icon-btn" data-act="del" title="Delete">${ICON.trash}</button>
            </div>
          </div>`).join('')}</div>` : '<div class="empty">No one yet. Until you add people, the Careers page shows placeholder circles.</div>'}`;
    };
    const reload = async () => { list = await db.list('sc_team'); render(); };
    const edit = t => {
      const n = !t; t = t || { name: '', role: '', currently: '', links: '', photo_url: '', published: true };
      let photo = t.photo_url;
      openDrawer(`
        <div class="drawer__head"><h3>${n ? 'Add person' : 'Edit person'}</h3><button class="icon-btn" data-close title="Close">×</button></div>
        <form class="form" id="tf">
          <label class="f">Name<input name="name" required maxlength="80" value="${esc(t.name)}"></label>
          <label class="f">Worked as<input name="role" maxlength="80" value="${esc(t.role)}" placeholder="Partner / Motion Designer"><small>Shows as “Worked as …”.</small></label>
          <label class="f">Currently<input name="currently" maxlength="100" value="${esc(t.currently || '')}" placeholder="Motion designer @shipper.now"><small>Shows as “Currently: …”. Leave empty to hide.</small></label>
          <div class="f">Social links<small style="margin:0 0 4px">Fill in the ones they have; empty boxes are left out.</small>
            <div class="sgrid">${SOC.map(([k, label, ph]) => `<label class="f">${label}<input name="s_${k}" maxlength="200" value="${esc(socOf(t.links)[k] || '')}" placeholder="${ph}"></label>`).join('')}</div></div>
          <div class="f">Photo <span id="tprev" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"></span></div>
          <label class="f" style="display:flex;flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" name="published" ${t.published ? 'checked' : ''} style="width:auto"> Show on the website</label>
          <div class="drawer__foot"><button class="btn" type="submit">${n ? 'Add person' : 'Save changes'}</button><button class="btn ghost" type="button" data-close>Cancel</button><span class="note" id="tnote"></span></div>
        </form>`);
      const prev = () => {
        $('#tprev').innerHTML = `${face({ name: $('#tf [name=name]').value, photo_url: photo })}<button type="button" class="btn ghost sm" id="tup">${ICON.image} ${photo ? 'Replace' : 'Upload'} photo</button>${photo ? '<button type="button" class="btn ghost sm" id="trm">Remove</button>' : ''}`;
        $('#tup').onclick = async () => {
          const [file] = await pick(); if (!file) return;
          $('#tnote').textContent = 'Uploading…'; $('#tnote').className = 'note';
          try { photo = await upload(file, 'team', 800); $('#tnote').textContent = ''; prev(); } catch (err) { $('#tnote').textContent = err.message; $('#tnote').className = 'note err'; }
        };
        if ($('#trm')) $('#trm').onclick = () => { photo = ''; prev(); };
      };
      prev();
      $('#tf [name=name]').addEventListener('input', () => { if (!photo) prev(); });
      $('#tf').onsubmit = async e => {
        e.preventDefault();
        const f = new FormData(e.target);
        const row = { name: f.get('name').trim(), role: f.get('role').trim(), currently: f.get('currently').trim(), links: SOC.map(([k, label]) => { const u = (f.get('s_' + k) || '').trim(); return u ? `${label} | ${u}` : ''; }).filter(Boolean).join('\n'), photo_url: photo || '', published: !!f.get('published') };
        if (!row.name) return;
        const btn = e.target.querySelector('[type=submit]'); btn.disabled = true;
        try {
          if (n) await db.insert('sc_team', { ...row, sort: nextSort(list) });
          else { await db.update('sc_team', t.id, row); if (t.photo_url && t.photo_url !== row.photo_url) removeFile(t.photo_url); }
          closeDrawer(); toast(n ? 'Person added' : 'Saved'); await reload();
        } catch (err) { $('#tnote').textContent = err.message; $('#tnote').className = 'note err'; btn.disabled = false; }
      };
    };
    render();
    v.onclick = async e => {
      if (e.target.closest('[data-add]')) return edit(null);
      const b = e.target.closest('[data-act]'); if (!b) return;
      const i = +b.closest('[data-i]').dataset.i, t = list[i];
      try {
        if (b.dataset.act === 'edit') return edit(t);
        if (b.dataset.act === 'up' || b.dataset.act === 'down') await move('sc_team', list, i, b.dataset.act === 'up' ? -1 : 1);
        if (b.dataset.act === 'pub') { await db.update('sc_team', t.id, { published: !t.published }); toast(t.published ? 'Hidden from the site' : 'Shown on the site'); }
        if (b.dataset.act === 'del') { if (!confirm(`Remove ${t.name}?`)) return; await db.remove('sc_team', t.id); removeFile(t.photo_url); toast('Removed'); }
        await reload();
      } catch (err) { toast(err.message, 1); }
    };
  };
})();
