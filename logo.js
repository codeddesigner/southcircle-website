/* The South Circle logo in the menu rolls like a drum while the cursor is over it: the wordmark is
   printed six times around a cylinder that turns, so copies roll up over the top and in from below.
   Real 3D, no blur. When the cursor leaves, the drum finishes the turn and settles on the front copy. */
(() => {
  const brand = document.querySelector('.nav__brand');
  const logo = brand && brand.querySelector('svg.logo');
  if (!logo || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const N = 6, STEP = 360 / N;
  const css = document.createElement('style');
  css.textContent = `
    .roll{--lh:clamp(20px,1.8vw,28px);display:block;height:calc(var(--lh) * 1.7);margin:calc(var(--lh) * -.35) 0;overflow:hidden;perspective:900px;clip-path:inset(20.6% 0);transition:clip-path .35s ease}
    .roll.is-on{clip-path:inset(0 0)}
    .roll__drum{position:relative;display:block;margin-top:calc(var(--lh) * .35);height:var(--lh);transform-style:preserve-3d;will-change:transform}
    .roll__f{display:block;height:var(--lh);backface-visibility:hidden;-webkit-backface-visibility:hidden}
    .roll__f + .roll__f{position:absolute;left:0;top:0}
    .roll__f .logo{height:var(--lh)}
    ${Array.from({ length: N }, (_, i) => `.roll__f:nth-child(${i + 1}){transform:rotateX(${i * STEP}deg) translateZ(calc(var(--lh) * .866))}`).join('\n')}`;
  document.head.appendChild(css);

  const roll = document.createElement('span'); roll.className = 'roll';
  const drum = document.createElement('span'); drum.className = 'roll__drum';
  for (let i = 0; i < N; i++) {
    const f = document.createElement('span'); f.className = 'roll__f';
    const copy = i ? logo.cloneNode(true) : logo;
    if (i) { copy.setAttribute('aria-hidden', 'true'); copy.removeAttribute('role'); copy.removeAttribute('aria-label'); }
    f.appendChild(copy); drum.appendChild(f);
  }
  roll.appendChild(drum);
  brand.appendChild(roll);

  let a = 0, v = 0, on = false, raf = 0, last = 0;
  const SPEED = 170;                                     // degrees per second while hovered
  const draw = () => { drum.style.transform = `translateZ(calc(var(--lh) * -.866)) rotateX(${a}deg)`; };
  const tick = t => {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (on) { v += (SPEED - v) * 0.12; a += v * dt; }
    else {                                               // glide on to the next copy, then rest there
      const target = Math.ceil((a - 0.5) / STEP) * STEP;
      a += (target - a) * Math.min(1, dt * 9);
      if (Math.abs(target - a) < 0.15) { a = target % 360; v = 0; draw(); raf = 0; last = 0; roll.classList.remove('is-on'); return; }
    }
    draw(); raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
  brand.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { on = true; roll.classList.add('is-on'); start(); } });
  brand.addEventListener('pointerleave', () => { on = false; start(); });
  draw();
})();
