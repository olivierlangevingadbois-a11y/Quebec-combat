'use strict';
// ---------- Entrées : clavier, manettes, tactile ----------
const Input = (() => {
  const down = new Set();
  const tapped = new Set(); // touches enfoncées depuis la dernière lecture (tapes très rapides)
  const ACTIONS = ['left', 'right', 'up', 'down', 'lp', 'hk', 'sp', 'confirm', 'back', 'pause'];
  const KEYMAP = [
    {
      left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'],
      lp: ['KeyF'], hk: ['KeyG'], sp: ['KeyH'],
      confirm: ['Enter', 'Space', 'KeyF'], back: ['Escape', 'Backspace', 'KeyG'], pause: ['Escape', 'KeyP'],
    },
    {
      left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'],
      lp: ['Comma', 'Numpad1'], hk: ['Period', 'Numpad2'], sp: ['Slash', 'Numpad3'],
      confirm: ['NumpadEnter', 'Comma', 'Numpad1'], back: ['Period', 'Numpad2'], pause: [],
    },
  ];
  // En solo, le joueur 1 peut aussi utiliser les flèches + J/K/L
  const SOLO_EXTRA = {
    left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'],
    lp: ['KeyJ', 'Comma', 'Numpad1'], hk: ['KeyK', 'Period', 'Numpad2'], sp: ['KeyL', 'Slash', 'Numpad3'],
    confirm: ['KeyJ', 'NumpadEnter'], back: ['KeyK'], pause: [],
  };
  const TOUCH = { left: 'T_left', right: 'T_right', up: 'T_up', down: 'T_down', lp: 'T_lp', hk: 'T_hk', sp: 'T_sp', confirm: 'T_lp', back: 'T_hk', pause: 'T_pause' };
  const PREVENT = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Slash', 'Backspace']);

  const st = [0, 1].map(() => ({ held: {}, prev: {}, edge: {}, buf: { lp: 0, hk: 0, sp: 0 } }));
  const anyEdge = {};
  let solo = true;
  let lastActivity = 0;

  window.addEventListener('keydown', (e) => {
    if (PREVENT.has(e.code)) e.preventDefault();
    down.add(e.code);
    tapped.add(e.code);
    lastActivity = performance.now();
    Sfx.init();
  });
  window.addEventListener('keyup', (e) => down.delete(e.code));
  window.addEventListener('blur', () => down.clear());

  function padState(pad) {
    const s = {};
    if (!pad) return s;
    const b = (i) => pad.buttons[i] && pad.buttons[i].pressed;
    const ax = pad.axes[0] || 0, ay = pad.axes[1] || 0;
    s.left = ax < -0.45 || b(14);
    s.right = ax > 0.45 || b(15);
    s.up = ay < -0.55 || b(12);
    s.down = ay > 0.55 || b(13);
    s.lp = b(0) || b(4);
    s.hk = b(1) || b(5);
    s.sp = b(2) || b(3) || b(6) || b(7);
    s.confirm = b(0) || b(9);
    s.back = b(1);
    s.pause = b(9);
    if (Object.values(s).some(Boolean)) lastActivity = performance.now();
    return s;
  }

  const isDown = (k) => down.has(k) || tapped.has(k);
  function poll() {
    const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
    for (let i = 0; i < 2; i++) {
      const p = st[i];
      p.prev = p.held;
      const h = {};
      const map = KEYMAP[i];
      const pad = padState(pads[i]);
      for (const a of ACTIONS) {
        let v = map[a].some(isDown) || !!pad[a];
        if (i === 0) {
          if (solo) v = v || SOLO_EXTRA[a].some(isDown);
          v = v || isDown(TOUCH[a]);
        }
        h[a] = v;
      }
      p.held = h;
      for (const a of ACTIONS) p.edge[a] = h[a] && !p.prev[a];
      for (const a of ['lp', 'hk', 'sp']) {
        if (p.edge[a]) p.buf[a] = 6;
        else if (p.buf[a] > 0) p.buf[a]--;
      }
    }
    for (const a of ACTIONS) anyEdge[a] = st[0].edge[a] || st[1].edge[a];
    tapped.clear();
  }

  // Objet d'entrée pour un combattant humain
  function fighterInput(i) {
    const p = st[i];
    return {
      left: p.held.left, right: p.held.right, up: p.held.up, down: p.held.down,
      lp: p.buf.lp > 0, hk: p.buf.hk > 0, sp: p.buf.sp > 0,
      consume(a) { p.buf[a] = 0; },
    };
  }

  return {
    poll, fighterInput,
    edge: (a, i) => (i === undefined ? anyEdge[a] : st[i].edge[a]),
    held: (a, i) => (i === undefined ? st[0].held[a] || st[1].held[a] : st[i].held[a]),
    setSolo(v) { solo = v; },
    virtualDown(k) { down.add(k); tapped.add(k); lastActivity = performance.now(); Sfx.init(); },
    virtualUp(k) { down.delete(k); },
    keyDown: (code) => down.has(code),
    get idleMs() { return performance.now() - lastActivity; },
    touchActivity() { lastActivity = performance.now(); },
    clearBuffers() { st.forEach((p) => { p.buf.lp = p.buf.hk = p.buf.sp = 0; }); },
  };
})();
