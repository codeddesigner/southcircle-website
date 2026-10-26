/* IMAGINE MORE ring, by hand: drag it to spin it either way (with a mouse, drag up or down to tip it
   over too), let go to throw it, click it to send it spinning the other way. It settles back to its own pace. */
(() => {
  const ring = document.getElementById('ring'); if (!ring) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const st = document.createElement('style');
  st.textContent = 'body[data-page="home"] .ring{pointer-events:auto;cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}body[data-page="home"] .ring.held{cursor:grabbing}.ring__spin{animation:none !important}';
  document.head.appendChild(st);

  const BASE = 360 / (reduce ? 80 : 7);                     // degrees a second: the ring's normal pace
  let rotY = 0, tilt = 0, vel = -BASE, dir = -1, held = null, swiped = false, last = performance.now();
  const frame = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!held) {
      vel += (dir * BASE - vel) * (1 - Math.exp(-dt * 1.4));   // a throw slows (or speeds) back to the normal pace
      rotY = (rotY + vel * dt) % 360;
      tilt += -tilt * (1 - Math.exp(-dt * 2.2));               // and tips back upright
    }
    const spin = ring.querySelector('.ring__spin');            // the ring is rebuilt when the window resizes
    if (spin) spin.style.transform = `rotateX(${tilt.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  const perPx = () => 200 / Math.max(300, ring.offsetWidth);  // a drag across the ring turns it a little over half way
  ring.addEventListener('pointerdown', e => {
    if (document.body.dataset.page !== 'home' || e.button > 0) return;
    const now = performance.now();
    held = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: now, t: now, v: 0, moved: 0, mouse: e.pointerType === 'mouse' };
    swiped = false;
    try { ring.setPointerCapture(e.pointerId); } catch (err) {}
    ring.classList.add('held');
  });
  ring.addEventListener('pointermove', e => {
    if (!held || e.pointerId !== held.id) return;
    const now = performance.now(), dx = e.clientX - held.x, dy = e.clientY - held.y, dt = Math.max(1, now - held.t) / 1000;
    held.moved = Math.max(held.moved, Math.hypot(e.clientX - held.x0, e.clientY - held.y0));
    const turn = dx * perPx();
    rotY += turn;
    held.v = held.v * 0.6 + (turn / dt) * 0.4;                  // the hand's speed, smoothed, for the throw
    if (held.mouse) tilt = Math.max(-55, Math.min(55, tilt - dy * perPx() * 0.6));
    if (Math.abs(e.clientX - held.x0) > 12) swiped = true;
    held.x = e.clientX; held.y = e.clientY; held.t = now;
  });
  const release = e => {
    if (!held || e.pointerId !== held.id) return;
    const h = held, now = performance.now(); held = null; ring.classList.remove('held');
    if (h.moved < 6 && now - h.t0 < 500) {                       // a click: turn the other way, with a kick
      dir = -dir; vel = dir * BASE * 5;
    } else {
      const v = now - h.t > 120 ? 0 : h.v;                       // held still before letting go: no throw
      vel = Math.max(-1600, Math.min(1600, v));
      if (Math.abs(vel) > BASE * 0.5) dir = Math.sign(vel);     // thrown the other way: keep turning that way
    }
  };
  ring.addEventListener('pointerup', release);
  ring.addEventListener('pointercancel', release);
  /* a sideways swipe on the ring spins it; it doesn't also change page */
  ring.addEventListener('touchend', e => { if (swiped) { e.stopPropagation(); swiped = false; } });
})();
