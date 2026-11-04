'use strict';
// ---------- Jeu : scènes, combat, interface ----------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const DIFF_NAMES = ['Facile', 'Normal', 'Difficile'];
const GRID = [
  ['legault', 'pspp', 'ghazal', 'duhaime', 'random'],
  ['carney', 'poilievre', 'blanchet', 'singh', 'trudeau'],
];
const HIT_WORDS = ['PAF!', 'BANG!', 'POW!', 'OUCH!', 'BING!', 'TABARNOUCHE!', 'SACRÉ COUP!', 'AYOYE!', 'WOUF!'];

const G = {
  scene: 'title', t: 0, sceneT: 0,
  mode: 'arcade', diff: 1,
  menuIdx: 0,
  sel: null,
  fighters: [], ctrls: [], projectiles: [], fx: [], texts: [],
  hitstop: 0, shake: 0, superFreeze: 0, superInfo: null, slowmo: 0,
  round: 1, wins: [0, 0], timer: 99, timerF: 0, phase: 'intro', phaseT: 0, roundWinner: -1,
  stage: 'salonbleu', arcade: null, matchWinner: -1, paused: false, pauseIdx: 0,
  clicks: [], titlePair: ['legault', 'carney'], comboShow: [{ n: 0, t: 0 }, { n: 0, t: 0 }],
  pending: [],

  go(scene) {
    this.scene = scene;
    this.sceneT = 0;
    this.menuIdx = 0;
    Input.clearBuffers();
  },

  // ===================== Combat =====================
  startMatch(p1, p2, stage, ctrl2) {
    this.fighters = [new Fighter(ROSTER_BY_ID[p1], 0), new Fighter(ROSTER_BY_ID[p2], 1)];
    this.ctrls = ctrl2;
    this.wins = [0, 0];
    this.round = 1;
    this.stage = stage;
    this.matchWinner = -1;
    this.go('vs');
  },
  startRound() {
    for (const f of this.fighters) f.reset();
    this.projectiles = [];
    this.fx = [];
    this.texts = [];
    this.pending = [];
    this.timer = 99;
    this.timerF = 0;
    this.phase = 'intro';
    this.phaseT = 0;
    this.roundWinner = -1;
    this.hitstop = this.superFreeze = this.slowmo = 0;
    this.paused = false;
    this.comboShow = [{ n: 0, t: 0 }, { n: 0, t: 0 }];
    Sfx.startMusic(STAGES[this.stage].music);
  },

  fightUpdate() {
    this.phaseT++;
    const [a, b] = this.fighters;
    if (this.phase === 'intro') {
      if (this.phaseT === 1) Sfx.say(this.round === 3 ? 'Ronde finale!' : `Ronde ${this.round}!`);
      if (this.phaseT === 70) Sfx.say('Combattez!');
      if (this.phaseT > 100) {
        this.phase = 'fight';
        this.phaseT = 0;
        for (const f of this.fighters) f.setState('idle');
      }
    }
    if (this.superFreeze > 0) {
      this.superFreeze--;
      this.updateFx();
      return;
    }
    if (this.hitstop > 0) {
      this.hitstop--;
      return;
    }
    if (this.slowmo > 0) {
      this.slowmo--;
      if (this.slowmo % 3 !== 0) { this.updateFx(); return; }
    }

    const inputs = this.fighters.map((f, i) => {
      if (this.phase !== 'fight') return { left: false, right: false, up: false, down: false, lp: false, hk: false, sp: false, consume() {} };
      const c = this.ctrls[i];
      return c === 'human' ? Input.fighterInput(i) : c.think(f, this.fighters[1 - i], this);
    });
    a.update(inputs[0], b, this);
    b.update(inputs[1], a, this);
    this.pushApart();

    // projectiles en attente (pluie)
    for (const pd of this.pending) if (--pd.delay <= 0) { this.projectiles.push(pd.p); pd.done = true; }
    this.pending = this.pending.filter((p) => !p.done);

    for (const p of this.projectiles) {
      p.update(this);
      if (p.dead) continue;
      const opp = this.fighters[1 - p.owner.side];
      if (p.hitCD === 0 && overlap(p.rect(), opp.hurtbox())) {
        p.hitsLeft--;
        const last = p.hitsLeft <= 0;
        this.hit(p.owner, opp, {
          dmg: p.dmgPer, stun: 20, bstun: 14, kb: last ? 6 : 1.2, h: p.h, knock: p.knock && last, super: p.isSuper,
        }, p.x, true);
        p.hitCD = 7;
        if (last) { p.dead = true; this.sparks(p.x, p.y, '#fff', 14); }
      }
    }
    // collisions entre projectiles
    const ps = this.projectiles;
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++) {
        const p = ps[i], q = ps[j];
        if (p.dead || q.dead || p.owner === q.owner || p.attach || q.attach || p.ground || q.ground) continue;
        if (overlap(p.rect(), q.rect())) {
          if (p.isSuper && !q.isSuper) q.dead = true;
          else if (q.isSuper && !p.isSuper) p.dead = true;
          else { p.dead = q.dead = true; }
          this.sparks((p.x + q.x) / 2, (p.y + q.y) / 2, '#ffe14d', 18);
          Sfx.block();
        }
      }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
    this.updateFx();

    if (this.phase === 'fight') {
      if (++this.timerF >= 60) {
        this.timerF = 0;
        this.timer--;
        if (this.timer <= 0) this.timeUp();
      }
    } else if (this.phase === 'ko') {
      const loser = this.fighters[1 - this.roundWinner];
      const settled = this.roundWinner === 2 || (loser.state === 'ko' || loser.state === 'down' || loser.state === 'idle');
      if (this.phaseT > 90 && settled) {
        if (this.roundWinner !== 2) {
          const w = this.fighters[this.roundWinner];
          if (!w.airborne && w.state !== 'win') { w.atk = w.sp = null; w.prop = null; w.setState('win'); w.vx = 0; }
        }
      }
      if (this.phaseT > 210) this.endRound();
    }
  },

  pushApart() {
    const [a, b] = this.fighters;
    if (a.state === 'down' || a.state === 'ko' || b.state === 'down' || b.state === 'ko') return;
    const dx = b.x - a.x, minD = 70;
    if (Math.abs(dx) < minD && Math.abs(a.y - b.y) < 150) {
      const push = (minD - Math.abs(dx)) / 2;
      const s = dx >= 0 ? 1 : -1;
      a.x -= push * s;
      b.x += push * s;
      // contre les murs
      if (a.x < 50) { b.x += 50 - a.x; a.x = 50; }
      if (b.x < 50) { a.x += 50 - b.x; b.x = 50; }
      if (a.x > W - 50) { b.x -= a.x - (W - 50); a.x = W - 50; }
      if (b.x > W - 50) { a.x -= b.x - (W - 50); b.x = W - 50; }
    }
  },

  hit(att, def, a, fromX, isProj) {
    if (def.state === 'ko' || def.hp <= 0 || this.phase !== 'fight') return 'none';
    const dir = def.x >= fromX ? 1 : -1;
    const backHeld = dir === 1 ? def.in.right : def.in.left;
    const canBlock = (def.state === 'idle' || def.state === 'walk' || def.state === 'crouch' || def.state === 'block') && !def.airborne;
    const crouching = !!def.in.down;
    const blocked = canBlock && backHeld && !(a.h === 'low' && !crouching) && !(a.h === 'high' && crouching);
    const hb = def.hurtbox() || { x: def.x - 30, y: def.y - 200, w: 60, h: 200 };
    const cx = def.x - dir * 26, cy = clamp(isProj ? def.y - 150 : def.y - 150, hb.y + 20, hb.y + hb.h - 20);

    if (blocked) {
      def.state = 'block';
      def.t = 0;
      def.blockLow = crouching;
      def.stun = a.bstun || 12;
      def.vx = dir * (a.kb || 4) * 0.9;
      const chip = isProj || a.super ? Math.round(a.dmg * 0.15) : 0;
      def.hp = Math.max(0, def.hp - chip);
      def.meter = Math.min(100, def.meter + 3);
      att.meter = Math.min(100, att.meter + 2);
      this.sparks(cx, crouching ? def.y - 110 : cy, '#7fd4ff', 8);
      Sfx.block();
      this.hitstop = 5;
      if (def.hp <= 0) this.ko(att, def, dir);
      return 'block';
    }

    if (def.state === 'hit' || def.state === 'knock') att.combo++;
    else att.combo = 1;
    const scale = att.combo > 1 ? Math.max(0.45, 1 - (att.combo - 1) * 0.12) : 1;
    const dmg = Math.max(1, Math.round(a.dmg * att.def.pow * scale));
    def.hp = Math.max(0, def.hp - dmg);
    def.atk = null;
    def.sp = null;
    def.prop = null;
    def.flash = 8;
    att.meter = Math.min(100, att.meter + 5 + dmg / 18);
    def.meter = Math.min(100, def.meter + dmg / 14);

    if (def.hp <= 0) {
      this.ko(att, def, dir);
    } else if (a.knock || def.airborne || def.state === 'knock') {
      def.setState('knock');
      def.vy = -9;
      def.vx = dir * 5;
    } else {
      def.setState('hit');
      def.stun = a.stun;
      def.vx = dir * a.kb;
    }
    const heavy = dmg >= 65 || a.super;
    this.sparks(cx, cy, heavy ? '#ffd23f' : '#fff', heavy ? 22 : 12);
    if (heavy && Math.random() < 0.7) this.popText(pick(HIT_WORDS), cx, cy - 60, heavy ? 44 : 34, att.def.color);
    if (att.combo >= 2) this.comboShow[att.side] = { n: att.combo, t: 70 };
    Sfx.hit(heavy);
    this.hitstop = a.super ? 10 : heavy ? 8 : 5;
    this.shake = Math.max(this.shake, heavy ? 9 : 4);
    return 'hit';
  },

  ko(att, def, dir) {
    def.hp = 0;
    def.setState('knock');
    def.vy = -13;
    def.vx = dir * 7;
    def.atk = def.sp = null;
    this.phase = 'ko';
    this.phaseT = 0;
    this.roundWinner = att.side;
    this.slowmo = 80;
    this.hitstop = 18;
    this.shake = 16;
    this.projectiles = [];
    this.pending = [];
    Sfx.ko();
    Sfx.say('K.O.!', 0.9, 0.6);
  },

  timeUp() {
    const [a, b] = this.fighters;
    this.phase = 'ko';
    this.phaseT = 0;
    this.timeOver = true;
    this.roundWinner = a.hp === b.hp ? 2 : a.hp > b.hp ? 0 : 1;
    Sfx.say('Temps écoulé!');
    if (this.roundWinner !== 2) this.fighters[1 - this.roundWinner].setState('idle');
  },

  endRound() {
    if (this.roundWinner === 2) {
      this.wins[0]++;
      this.wins[1]++;
    } else this.wins[this.roundWinner]++;
    this.timeOver = false;
    if (this.wins[0] >= 2 || this.wins[1] >= 2) {
      this.matchWinner = this.wins[0] === this.wins[1] ? 2 : this.wins[0] >= 2 ? 0 : 1;
      if (this.matchWinner !== 2) {
        const w = this.fighters[this.matchWinner];
        Sfx.say(`${w.def.name} l'emporte!`);
      }
      Sfx.stopMusic();
      this.phase = 'over';
      this.go('result');
      return;
    }
    this.round++;
    this.startRound();
  },

  // ----- Coups spéciaux -----
  callout(f, name) {
    this.popText(name, f.x, f.y - 290, 30, f.def.color, 50);
  },
  startSuper(f, name) {
    this.superFreeze = 48;
    this.superInfo = { f, name, t: 0 };
    Sfx.superStart();
    Sfx.say(name.replace(/!/g, ''), 1.1, 0.9);
  },
  spawnProjectile(f, s, isSuper) {
    const dims = {
      tunnel: [100, 56], battery: [140, 74], ballot: [68, 48], radio: [80, 80], signs: [220, 150], rate: [80, 62],
      axe: [56, 56], bigaxe: [160, 160], fleur: [56, 64], sock: [50, 56], tooth: [120, 130],
    }[s.kind] || [60, 60];
    const wave = s.type === 'wave';
    const p = new Projectile({
      owner: f, kind: s.kind, x: f.x + f.facing * (40 + dims[0] / 2), y: wave ? GROUND - dims[1] / 2 - 2 : f.y - 160 * FS,
      vx: f.facing * s.speed, dmg: s.dmg, hits: s.hits || 1, w: dims[0], hh: dims[1], isSuper,
      knock: isSuper, h: wave && !isSuper ? 'low' : 'mid', life: 200,
      spin: s.kind === 'axe' ? 0.38 : s.kind === 'bigaxe' ? 0.22 : s.kind === 'sock' ? 0.3 : 0,
    });
    if (s.kind === 'fleur') { p.w = 50; p.hh = 60; }
    this.projectiles.push(p);
    if (isSuper) this.shake = Math.max(this.shake, 6);
  },
  spawnRain(f, opp, s) {
    const n = s.count || 8;
    for (let i = 0; i < n; i++) {
      const p = new Projectile({
        owner: f, kind: 'fleur', x: clamp(opp.x + (i - (n - 1) / 2) * 50 + rand(-15, 15), 40, W - 40), y: -60,
        vy: 5, grav: 0.3, dmg: s.dmg / n, hits: 1, w: 46, hh: 56, isSuper: true, ground: true, life: 400, dir: 1,
        knock: i === n - 1,
      });
      this.pending.push({ delay: Math.abs(i - (n - 1) / 2) * 7 + i * 2, p });
    }
  },
  spawnDrop(f, opp, s) {
    this.projectiles.push(new Projectile({
      owner: f, kind: 'bloc', x: opp.x, y: -260, vy: 2, grav: 0.55, dmg: s.dmg, hits: 1, w: 170, hh: 170,
      isSuper: true, ground: true, knock: true, life: 400, h: 'mid',
    }));
  },
  spawnBeam(f, s) {
    const len = 1100;
    this.projectiles.push(new Projectile({
      owner: f, kind: 'beam', attach: true, dir: f.facing, x: f.x + f.facing * (60 + len / 2), y: f.y - 170 * FS,
      w: len, hh: 100, dmg: s.dmg, hits: s.hits, life: s.dur, isSuper: true, knock: true,
    }));
    this.shake = 8;
  },
  impact(p) {
    if (p.kind === 'bloc') {
      this.shake = 20;
      Sfx.boom();
      this.dust(p.x, 3);
      this.popText('BLOQUÉ!', p.x, GROUND - 200, 50, '#2fb4d4');
    } else {
      this.sparks(p.x, GROUND - 10, '#fff', 6);
    }
  },

  // ----- Effets -----
  sparks(x, y, color, n) {
    this.fx.push({ type: 'flash', x, y, life: 8, max: 8, r: 20 + n * 2, color });
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = rand(3, 11);
      this.fx.push({ type: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(10, 22), max: 22, color, size: rand(3, 7) });
    }
  },
  dust(x, amt) {
    for (let i = 0; i < 8 * amt; i++) {
      this.fx.push({ type: 'dust', x: x + rand(-40, 40) * amt * 0.6, y: GROUND - rand(0, 10), vx: rand(-3, 3) * amt, vy: rand(-2.5, -0.5), life: rand(20, 40), max: 40, size: rand(8, 18) * Math.min(2, amt) });
    }
  },
  popText(str, x, y, size, color, life = 45) {
    this.texts.push({ str, x: clamp(x, 120, W - 120), y, size, color, life, max: life });
  },
  updateFx() {
    for (const p of this.fx) {
      p.life--;
      if (p.vx !== undefined) { p.x += p.vx; p.y += p.vy; p.vx *= 0.9; p.vy = p.vy * 0.9 + (p.type === 'spark' ? 0.3 : 0); }
    }
    this.fx = this.fx.filter((p) => p.life > 0);
    for (const t of this.texts) { t.life--; t.y -= 0.8; }
    this.texts = this.texts.filter((t) => t.life > 0);
    for (const c of this.comboShow) if (c.t > 0) c.t--;
    if (this.shake > 0) this.shake *= 0.86;
    if (this.shake < 0.5) this.shake = 0;
  },

  drawFight(ctx) {
    ctx.save();
    if (this.shake) ctx.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake) * 0.6);
    drawStage(ctx, this.stage, this.t);
    // fond assombri pendant un super
    const [a, b] = this.fighters;
    const order = a.state === 'attack' || a.state === 'special' ? [b, a] : [a, b];
    for (const f of order) f.draw(ctx);
    for (const p of this.projectiles) drawProjectileShape(ctx, p, this.t);
    for (const p of this.fx) {
      const k = p.life / p.max;
      if (p.type === 'flash') {
        ctx.globalAlpha = k;
        ctx.fillStyle = p.color;
        circle(ctx, p.x, p.y, p.r * (1.4 - k));
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (p.type === 'spark') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * k + 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.stroke();
      } else if (p.type === 'dust') {
        ctx.fillStyle = `rgba(200,190,170,${k * 0.6})`;
        circle(ctx, p.x, p.y, p.size * (1.6 - k));
        ctx.fill();
      }
    }
    drawStageFront(ctx, this.stage, this.t);
    for (const t of this.texts) {
      const k = t.life / t.max;
      const s = t.size * (k > 0.85 ? 1 + (k - 0.85) * 4 : 1);
      ctx.globalAlpha = Math.min(1, k * 3);
      text(ctx, t.str, t.x, t.y, s, t.color === '#141414' ? '#fff' : '#fff', { stroke: t.color, lw: s * 0.22 });
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    if (this.superFreeze > 0 && this.superInfo) this.drawSuperBanner(ctx);
    this.drawHUD(ctx);

    // Annonces
    if (this.phase === 'intro') {
      const k = this.phaseT;
      if (k < 70) {
        const s = k < 10 ? 160 - k * 8 : 80;
        text(ctx, this.round >= 3 ? 'RONDE FINALE' : `RONDE ${this.round}`, W / 2, H / 2 - 40, s, '#ffe14d', { lw: 10 });
      } else {
        const s = Math.max(100, 200 - (k - 70) * 8);
        text(ctx, 'COMBATTEZ!', W / 2, H / 2 - 40, s, '#ff4040', { lw: 12 });
      }
    } else if (this.phase === 'ko') {
      const k = this.phaseT;
      if (this.timeOver) text(ctx, 'TEMPS!', W / 2, H / 2 - 60, 130, '#ffe14d', { lw: 12 });
      else {
        const s = k < 12 ? 300 - k * 14 : 132;
        text(ctx, 'K.O.!', W / 2, H / 2 - 60, s, '#ff3030', { lw: 14 });
      }
      if (k > 90) {
        if (this.roundWinner === 2) text(ctx, 'ÉGALITÉ', W / 2, H / 2 + 50, 64, '#fff');
        else {
          const w = this.fighters[this.roundWinner];
          text(ctx, `${w.def.short} GAGNE LA RONDE`, W / 2, H / 2 + 50, 56, '#fff', { stroke: w.def.color, lw: 10 });
          if (w.hp >= w.maxHp) text(ctx, 'SANS FAUTE!', W / 2, H / 2 + 110, 44, '#ffe14d');
        }
      }
    }
    if (this.paused) this.drawPause(ctx);
  },

  drawSuperBanner(ctx) {
    const { f, name } = this.superInfo;
    const k = 1 - this.superFreeze / 48;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);
    // redessiner le lanceur par-dessus
    f.draw(ctx);
    const y = 250;
    const slide = Math.min(1, k * 4);
    ctx.save();
    ctx.translate((1 - slide) * (f.side ? W : -W), 0);
    ctx.fillStyle = f.def.color;
    ctx.beginPath();
    ctx.moveTo(0, y - 70); ctx.lineTo(W, y - 100); ctx.lineTo(W, y + 40); ctx.lineTo(0, y + 70);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 12; i++) ctx.fillRect(((i * 140 + this.t * 30) % (W + 200)) - 100, y - 90, 30, 160);
    ctx.save();
    ctx.translate(f.side ? W - 180 : 180, y - 10);
    ctx.scale(f.side ? -1.5 : 1.5, 1.5);
    drawHead(ctx, f.def, 'angry', this.t);
    ctx.restore();
    text(ctx, name.toUpperCase(), W / 2 + (f.side ? -80 : 80), y - 10, 84, '#fff', { lw: 12 });
    text(ctx, 'SUPER', W / 2 + (f.side ? -80 : 80), y - 78, 34, '#ffe14d');
    ctx.restore();
  },

  drawHUD(ctx) {
    const [a, b] = this.fighters;
    const bw = 500, bh = 30, y = 30;
    for (const f of this.fighters) {
      const left = f.side === 0;
      const x0 = left ? 30 : W - 30 - bw;
      // cadre
      ctx.fillStyle = '#141414';
      roundRect(ctx, x0 - 4, y - 4, bw + 8, bh + 8, 6);
      ctx.fill();
      ctx.fillStyle = '#5a0d0d';
      ctx.fillRect(x0, y, bw, bh);
      const dk = f.dispHp / f.maxHp, hk = f.hp / f.maxHp;
      ctx.fillStyle = '#fff3b0';
      if (left) ctx.fillRect(x0 + bw * (1 - dk), y, bw * dk, bh);
      else ctx.fillRect(x0, y, bw * dk, bh);
      const g = ctx.createLinearGradient(0, y, 0, y + bh);
      const low = hk < 0.25;
      g.addColorStop(0, low ? '#ff6060' : '#ffe14d');
      g.addColorStop(1, low ? '#c01010' : '#f59b00');
      ctx.fillStyle = g;
      if (left) ctx.fillRect(x0 + bw * (1 - hk), y, bw * hk, bh);
      else ctx.fillRect(x0, y, bw * hk, bh);
      // nom + parti
      ctx.save();
      ctx.translate(left ? x0 + 34 : x0 + bw - 34, y + bh + 40);
      ctx.scale(left ? 0.62 : -0.62, 0.62);
      ctx.fillStyle = f.def.color;
      circle(ctx, 0, 0, 52);
      ctx.fill();
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.save();
      ctx.clip();
      ctx.translate(-6, 10);
      drawHead(ctx, f.def, f.hp < 250 ? 'hurt' : 'neutral', this.t);
      ctx.restore();
      ctx.restore();
      text(ctx, f.def.short, left ? x0 + 72 : x0 + bw - 72, y + bh + 26, 34, '#fff', { align: left ? 'left' : 'right' });
      text(ctx, f.def.party, left ? x0 + 74 : x0 + bw - 74, y + bh + 54, 20, f.def.color, { align: left ? 'left' : 'right', font: FONT2, weight: 'bold', lw: 4 });
      // victoires
      for (let i = 0; i < 2; i++) {
        const cx = left ? x0 + bw - 14 - i * 30 : x0 + 14 + i * 30;
        ctx.fillStyle = this.wins[f.side] > i ? '#ffe14d' : '#333';
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3;
        ctx.save();
        ctx.translate(cx, y + bh + 22);
        if (f.def.level === 'QC') fleurPath(ctx, 12); else maplePath(ctx, 13);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      // jauge de super
      const mw = 260, mx = left ? 30 : W - 30 - mw, my = H - 42;
      ctx.fillStyle = '#141414';
      roundRect(ctx, mx - 3, my - 3, mw + 6, 22, 5);
      ctx.fill();
      const full = f.meter >= 100;
      ctx.fillStyle = full ? (this.t % 10 < 5 ? '#ffffff' : f.def.color) : f.def.color;
      const mk = f.meter / 100;
      if (left) ctx.fillRect(mx, my, mw * mk, 16);
      else ctx.fillRect(mx + mw * (1 - mk), my, mw * mk, 16);
      text(ctx, full ? 'SUPER PRÊT! ↓ + SPÉCIAL' : 'SUPER', left ? mx + mw + 14 : mx - 14, my + 8, 22, full ? '#ffe14d' : '#ddd', { align: left ? 'left' : 'right' });
      // combo
      const c = this.comboShow[f.side];
      if (c.t > 0 && c.n >= 2) text(ctx, `${c.n} COUPS!`, left ? 40 : W - 40, 220, 46 + Math.min(20, c.n * 3), '#ffe14d', { align: left ? 'left' : 'right', stroke: f.def.color, lw: 8 });
    }
    // chrono
    ctx.fillStyle = '#141414';
    roundRect(ctx, W / 2 - 50, 14, 100, 70, 10);
    ctx.fill();
    text(ctx, String(Math.max(0, this.timer)).padStart(2, '0'), W / 2, 52, 60, this.timer <= 10 ? '#ff4040' : '#fff', { stroke: false });
  },

  drawPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);
    text(ctx, 'PAUSE', W / 2, 220, 110, '#ffe14d');
    const items = ['Reprendre', 'Quitter au menu'];
    items.forEach((s, i) => {
      const y = 340 + i * 70;
      const sel = i === this.pauseIdx;
      text(ctx, sel ? `▶ ${s} ◀` : s, W / 2, y, sel ? 52 : 44, sel ? '#fff' : '#aaa');
      this.clicks.push({ x: W / 2 - 220, y: y - 30, w: 440, h: 60, fn: () => { this.pauseIdx = i; this.pauseSelect(); } });
    });
  },
  pauseSelect() {
    if (this.pauseIdx === 0) this.paused = false;
    else { this.paused = false; Sfx.stopMusic(); this.go('menu'); }
    Sfx.confirm();
  },
};

// ===================== Scènes =====================
const MENU_ITEMS = () => [
  { label: 'ARCADE', desc: 'Affrontez tous les politiciens, un après l\'autre.', go: () => G.toSelect('arcade') },
  { label: 'VERSUS — 2 JOUEURS', desc: 'Deux joueurs sur le même clavier (ou manettes).', go: () => G.toSelect('versus') },
  { label: 'VERSUS — ORDINATEUR', desc: 'Choisissez votre politicien et votre adversaire.', go: () => G.toSelect('cpu') },
  { label: 'DÉMO : CPU contre CPU', desc: 'Regardez l\'ordinateur se chicaner tout seul.', go: () => G.startDemo() },
  { label: `DIFFICULTÉ : ${DIFF_NAMES[G.diff]}`, desc: 'Gauche / droite pour changer.', go: () => { G.diff = (G.diff + 1) % 3; }, lr: (d) => { G.diff = (G.diff + d + 3) % 3; } },
  { label: `SON : ${Sfx.enabled ? 'OUI' : 'NON'}  ·  MUSIQUE : ${Sfx.music ? 'OUI' : 'NON'}`, desc: 'Entrée : son · Gauche/droite : musique.', go: () => { Sfx.enabled = !Sfx.enabled; }, lr: () => { Sfx.music = !Sfx.music; } },
  { label: 'COMMANDES', desc: 'Comment se battre comme un vrai député.', go: () => G.go('controls') },
];

G.toSelect = function (mode) {
  this.mode = mode;
  Input.setSolo(mode !== 'versus');
  this.sel = {
    cur: [{ r: 0, c: 0 }, { r: 1, c: 0 }],
    locked: [false, false],
    choice: [null, null],
    step: 0, // en mode cpu : 0 = choix J1, 1 = choix adversaire
  };
  this.go('select');
};
G.startDemo = function () {
  Input.setSolo(true);
  this.mode = 'demo';
  const ids = shuffle(ROSTER.map((c) => c.id));
  const p = ROSTER_BY_ID[ids[1]];
  this.startMatch(ids[0], ids[1], p.stage, [new AI(1.4), new AI(1.4)]);
};

function selCellId(cur) {
  return GRID[cur.r][cur.c];
}
function resolveRandom(id, except) {
  if (id !== 'random') return id;
  const opts = ROSTER.map((c) => c.id).filter((x) => x !== except);
  return pick(opts);
}

const SCENES = {
  // ---------- Titre ----------
  title: {
    update() {
      if (G.sceneT % 180 === 0) {
        const q = ROSTER.filter((c) => c.level === 'QC'), f = ROSTER.filter((c) => c.level === 'CA');
        G.titlePair = [pick(q).id, pick(f).id];
      }
      if (Input.edge('confirm') || Input.edge('lp') || Input.edge('pause')) { Sfx.init(); Sfx.confirm(); G.go('menu'); }
      if (G.sceneT > 60 * 25 && Input.idleMs > 20000) G.startDemo();
    },
    draw(ctx) {
      drawSplitBg(ctx, G.t, 1);
      // deux têtes face à face
      const bob = Math.sin(G.t * 0.08) * 6;
      const L = ROSTER_BY_ID[G.titlePair[0]], R = ROSTER_BY_ID[G.titlePair[1]];
      ctx.save(); ctx.translate(250, 430 + bob); ctx.scale(2.6, 2.6); drawHead(ctx, L, 'angry', G.t); ctx.restore();
      ctx.save(); ctx.translate(W - 250, 430 - bob); ctx.scale(-2.6, 2.6); drawHead(ctx, R, 'angry', G.t); ctx.restore();
      text(ctx, L.short, 250, 600, 40, '#fff', { stroke: L.color, lw: 8 });
      text(ctx, R.short, W - 250, 600, 40, '#fff', { stroke: R.color, lw: 8 });

      const wob = Math.sin(G.t * 0.1) * 0.02;
      ctx.save();
      ctx.translate(W / 2, 190);
      ctx.rotate(wob - 0.04);
      text(ctx, 'QUÉBEC', 0, -50, 150, '#ffffff', { stroke: '#0a4ea2', lw: 22 });
      text(ctx, 'COMBAT', 0, 80, 170, '#ffe14d', { stroke: '#c8102e', lw: 24 });
      ctx.restore();
      text(ctx, 'LE TOURNOI POLITIQUE ULTIME · QUÉBEC CONTRE OTTAWA', W / 2, 360, 30, '#fff', { lw: 7 });
      if (Math.floor(G.t / 30) % 2 === 0) text(ctx, 'APPUYEZ SUR ENTRÉE', W / 2, 470, 52, '#fff', { stroke: '#c8102e', lw: 10 });
      text(ctx, 'Parodie humoristique — aucun politicien n\'a été blessé pendant ce combat.', W / 2, H - 28, 18, '#eee', { font: FONT2, lw: 4 });
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { Sfx.init(); Sfx.confirm(); G.go('menu'); } });
    },
  },

  // ---------- Menu ----------
  menu: {
    update() {
      const items = MENU_ITEMS();
      if (Input.edge('up')) { G.menuIdx = (G.menuIdx + items.length - 1) % items.length; Sfx.select(); }
      if (Input.edge('down')) { G.menuIdx = (G.menuIdx + 1) % items.length; Sfx.select(); }
      const it = items[G.menuIdx];
      if (it.lr && (Input.edge('left') || Input.edge('right'))) { it.lr(Input.edge('left') ? -1 : 1); Sfx.select(); }
      if (Input.edge('confirm')) { Sfx.confirm(); const keep = G.menuIdx; it.go(); if (G.scene === 'menu') G.menuIdx = keep; }
      else if (Input.edge('back') && G.sceneT > 5) { Sfx.back(); G.go('title'); }
    },
    draw(ctx) {
      drawSplitBg(ctx, G.t, 0.55);
      text(ctx, 'QUÉBEC COMBAT', W / 2, 80, 80, '#ffe14d', { stroke: '#c8102e', lw: 12 });
      const items = MENU_ITEMS();
      items.forEach((it, i) => {
        const y = 175 + i * 66;
        const sel = i === G.menuIdx;
        ctx.fillStyle = sel ? 'rgba(255,225,77,0.95)' : 'rgba(0,0,0,0.55)';
        roundRect(ctx, W / 2 - 300, y - 26, 600, 52, 12);
        ctx.fill();
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3;
        ctx.stroke();
        text(ctx, it.label, W / 2, y + 2, 34, sel ? '#141414' : '#fff', { stroke: sel ? false : '#000' });
        G.clicks.push({ x: W / 2 - 300, y: y - 26, w: 600, h: 52, fn: () => { G.menuIdx = i; Sfx.confirm(); it.go(); } });
      });
      text(ctx, items[G.menuIdx].desc, W / 2, H - 50, 24, '#fff', { font: FONT2, lw: 5 });
    },
  },

  // ---------- Commandes ----------
  controls: {
    update() {
      if ((Input.edge('confirm') || Input.edge('back')) && G.sceneT > 5) { Sfx.back(); G.go('menu'); }
    },
    draw(ctx) {
      drawSplitBg(ctx, G.t, 0.4);
      text(ctx, 'COMMANDES', W / 2, 70, 76, '#ffe14d', { stroke: '#c8102e', lw: 12 });
      const box = (x, title, rows) => {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        roundRect(ctx, x, 120, 560, 380, 16);
        ctx.fill();
        text(ctx, title, x + 280, 156, 38, '#fff');
        rows.forEach(([k, v], i) => {
          text(ctx, k, x + 210, 210 + i * 40, 24, '#ffe14d', { align: 'right', font: FONT2, weight: 'bold', lw: 4 });
          text(ctx, v, x + 230, 210 + i * 40, 24, '#fff', { align: 'left', font: FONT2, lw: 4 });
        });
      };
      box(60, 'JOUEUR 1', [['W A S D', 'Se déplacer / sauter'], ['S', 'S\'accroupir'], ['F', 'Coup de poing'], ['G', 'Coup de pied'], ['H', 'Coup spécial'], ['S + H', 'SUPER (jauge pleine)'], ['Solo : flèches', '+ J / K / L aussi'], ['Échap / P', 'Pause']]);
      box(660, 'JOUEUR 2', [['Flèches', 'Se déplacer / sauter'], ['↓', 'S\'accroupir'], [', ou Pavé 1', 'Coup de poing'], ['. ou Pavé 2', 'Coup de pied'], ['/ ou Pavé 3', 'Coup spécial'], ['↓ + Spécial', 'SUPER (jauge pleine)'], ['Manettes', 'A poing · B pied · X/Y spécial'], ['', '']]);
      const tips = [
        'Reculer = bloquer. Accroupi = bloquer les balayages. Debout = bloquer les attaques sautées.',
        'Bas + pied = balayage qui fait tomber. Frapper et se faire frapper remplit la jauge de SUPER.',
      ];
      tips.forEach((s, i) => text(ctx, s, W / 2, 545 + i * 36, 22, '#fff', { font: FONT2, lw: 5 }));
      text(ctx, 'Entrée ou Échap pour revenir', W / 2, H - 40, 28, '#ffe14d');
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => G.go('menu') });
    },
  },

  // ---------- Sélection ----------
  select: {
    update() {
      const S = G.sel;
      const players = G.mode === 'versus' ? [0, 1] : [0];
      for (const i of players) {
        const ci = G.mode === 'cpu' ? S.step : i; // en mode cpu, J1 déplace les deux curseurs
        if (S.locked[ci]) {
          if (Input.edge('back', i) && G.sceneT > 5) {
            if (G.mode === 'cpu' && S.step === 1) { S.step = 0; S.locked[0] = false; }
            else S.locked[ci] = false;
            Sfx.back();
          }
          continue;
        }
        const cur = S.cur[ci];
        if (Input.edge('left', i)) { cur.c = (cur.c + 4) % 5; Sfx.select(); }
        if (Input.edge('right', i)) { cur.c = (cur.c + 1) % 5; Sfx.select(); }
        if (Input.edge('up', i) || Input.edge('down', i)) { cur.r = 1 - cur.r; Sfx.select(); }
        if (Input.edge('confirm', i) && G.sceneT > 8) this.lock(ci);
        else if (Input.edge('back', i) && G.sceneT > 8) {
          if (G.mode === 'cpu' && S.step === 1) { S.step = 0; S.locked[0] = false; Sfx.back(); }
          else { Sfx.back(); G.go('menu'); }
        }
      }
      const need = G.mode === 'arcade' ? [0] : [0, 1];
      if (need.every((i) => S.locked[i])) {
        S.readyT = (S.readyT || 0) + 1;
        if (S.readyT > 40) this.begin();
      } else S.readyT = 0;
    },
    lock(ci) {
      const S = G.sel;
      const other = S.choice[1 - ci];
      S.choice[ci] = resolveRandom(selCellId(S.cur[ci]), other);
      S.locked[ci] = true;
      Sfx.confirm();
      Sfx.say(ROSTER_BY_ID[S.choice[ci]].name);
      if (G.mode === 'cpu' && ci === 0) S.step = 1;
    },
    begin() {
      const S = G.sel;
      const diff = G.diff;
      if (G.mode === 'arcade') {
        const others = shuffle(ROSTER.map((c) => c.id).filter((id) => id !== S.choice[0]));
        G.arcade = { player: S.choice[0], ladder: others.slice(0, 6), idx: 0, continues: 0 };
        startArcadeFight();
      } else if (G.mode === 'versus') {
        G.startMatch(S.choice[0], S.choice[1], ROSTER_BY_ID[S.choice[1]].stage, ['human', 'human']);
      } else {
        G.startMatch(S.choice[0], S.choice[1], ROSTER_BY_ID[S.choice[1]].stage, ['human', new AI(0.3 + diff * 0.6)]);
      }
    },
    draw(ctx) {
      const S = G.sel;
      drawSplitBg(ctx, G.t, 0.45);
      const title = G.mode === 'cpu' && S.step === 1 ? 'CHOISISSEZ VOTRE ADVERSAIRE' : 'CHOISISSEZ VOTRE POLITICIEN';
      text(ctx, title, W / 2, 48, 54, '#ffe14d', { stroke: '#c8102e', lw: 10 });
      // grille
      const cw = 118, ch = 132, gx = W / 2 - (cw * 5) / 2, gy = 120;
      for (const [lbl, row, col] of [['QUÉBEC', 0, '#0a4ea2'], ['OTTAWA', 1, '#c8102e']]) {
        ctx.save();
        ctx.translate(gx - 16, gy + row * (ch + 10) + ch / 2);
        ctx.rotate(-Math.PI / 2);
        text(ctx, lbl, 0, 0, 26, '#fff', { stroke: col, lw: 7 });
        ctx.restore();
      }
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 5; c++) {
          const id = GRID[r][c];
          const x = gx + c * cw, y = gy + r * (ch + 10);
          const def = ROSTER_BY_ID[id];
          ctx.fillStyle = def ? def.color : '#444';
          ctx.fillRect(x + 4, y + 4, cw - 8, ch - 8);
          ctx.save();
          ctx.beginPath();
          ctx.rect(x + 4, y + 4, cw - 8, ch - 8);
          ctx.clip();
          const g = ctx.createLinearGradient(0, y, 0, y + ch);
          g.addColorStop(0, 'rgba(255,255,255,0.25)');
          g.addColorStop(1, 'rgba(0,0,0,0.35)');
          ctx.fillStyle = g;
          ctx.fillRect(x, y, cw, ch);
          if (def) {
            ctx.translate(x + cw / 2 - 6, y + ch / 2 + 6);
            ctx.scale(1.15, 1.15);
            drawHead(ctx, def, 'neutral', G.t + c * 40);
          } else {
            text(ctx, '?', x + cw / 2, y + ch / 2, 90, '#fff');
          }
          ctx.restore();
          ctx.strokeStyle = '#141414';
          ctx.lineWidth = 4;
          ctx.strokeRect(x + 4, y + 4, cw - 8, ch - 8);
          text(ctx, def ? def.short : 'HASARD', x + cw / 2, y + ch - 14, def && def.short.length > 8 ? 17 : 20, '#fff', { lw: 5 });
          G.clicks.push({ x, y, w: cw, h: ch, fn: () => {
            const ci = G.mode === 'cpu' ? S.step : S.locked[0] && G.mode === 'versus' ? 1 : 0;
            if (S.locked[ci]) return;
            S.cur[ci] = { r, c };
            SCENES.select.lock(ci);
          } });
        }
      // curseurs
      const curs = G.mode === 'arcade' ? [0] : [0, 1];
      for (const i of curs) {
        if (G.mode === 'cpu' && i === 1 && S.step === 0) continue;
        const cur = S.cur[i];
        const x = gx + cur.c * cw, y = gy + cur.r * (ch + 10);
        const col = i === 0 ? '#3aa0ff' : '#ff4040';
        const pulse = S.locked[i] ? 0 : Math.sin(G.t * 0.3) * 2;
        ctx.strokeStyle = col;
        ctx.lineWidth = 7;
        ctx.strokeRect(x - pulse, y - pulse, cw + pulse * 2, ch + pulse * 2);
        const lbl = i === 0 ? 'J1' : G.mode === 'versus' ? 'J2' : 'CPU';
        text(ctx, lbl, i === 0 ? x + 20 : x + cw - 20, y + 2, 26, '#fff', { stroke: col, lw: 7 });
      }
      // panneaux des combattants
      for (const i of [0, 1]) {
        if (G.mode === 'arcade' && i === 1) {
          drawPanelText(ctx, W - 160, 'MODE ARCADE', ['6 adversaires', 'vous attendent.', '', 'Devenez premier', 'ministre de tout!']);
          continue;
        }
        if (G.mode === 'cpu' && i === 1 && S.step === 0) {
          drawPanelText(ctx, W - 160, 'ADVERSAIRE', ['À choisir', 'ensuite...']);
          continue;
        }
        const id = S.locked[i] ? S.choice[i] : selCellId(S.cur[i]);
        const def = ROSTER_BY_ID[id];
        const px = i === 0 ? 160 : W - 160;
        if (!def) {
          text(ctx, '?', px, 470, 200, '#fff');
          continue;
        }
        ctx.save();
        ctx.translate(px, 640);
        ctx.scale(i === 0 ? 1 : -1, 1);
        drawCharacter(ctx, def, S.locked[i] ? POSES.win(G.t) : POSES.idle(G.t), S.locked[i] ? 'happy' : 'neutral', G.t, null);
        ctx.restore();
        const ny = shownTop(i);
        text(ctx, def.name.toUpperCase(), px, ny, def.name.length > 18 ? 24 : 30, '#fff', { stroke: def.color, lw: 8 });
        text(ctx, `${def.title} · ${def.party}`, px, ny + 30, 22, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
      }
      // fiche du personnage au centre
      const fi = G.mode === 'cpu' ? S.step : 0;
      const shown = [0, 1].filter((i) => !(G.mode === 'arcade' && i === 1) && !(G.mode === 'cpu' && i === 1 && S.step === 0));
      shown.forEach((i, k) => {
        const id = S.locked[i] ? S.choice[i] : selCellId(S.cur[i]);
        const def = ROSTER_BY_ID[id];
        const bw = shown.length === 1 ? 390 : 360;
        const bx = shown.length === 1 ? W / 2 - 195 : W / 2 - 370 + k * 380, by = 420;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        roundRect(ctx, bx, by, bw, 200, 14);
        ctx.fill();
        if (!def) {
          text(ctx, 'HASARD', bx + bw / 2, by + 100, 48, '#fff');
          return;
        }
        text(ctx, PARTY_NAMES[def.party], bx + bw / 2, by + 26, 22, def.color, { font: FONT2, weight: 'bold', lw: 4, stroke: '#000' });
        const stat = (lbl, v, y) => {
          text(ctx, lbl, bx + 20, y, 20, '#fff', { align: 'left', font: FONT2, weight: 'bold', lw: 4 });
          ctx.fillStyle = '#333';
          ctx.fillRect(bx + 130, y - 8, bw - 160, 16);
          ctx.fillStyle = def.color;
          ctx.fillRect(bx + 130, y - 8, (bw - 160) * clamp((v - 0.8) / 0.4, 0.1, 1), 16);
        };
        stat('Vitesse', def.spd, by + 62);
        stat('Puissance', def.pow, by + 92);
        text(ctx, `Spécial : ${def.special.name}`, bx + 20, by + 130, 20, '#ffe14d', { align: 'left', font: FONT2, weight: 'bold', lw: 4 });
        text(ctx, `Super : ${def.super.name}`, bx + 20, by + 162, 20, '#ff9a9a', { align: 'left', font: FONT2, weight: 'bold', lw: 4 });
      });
      void fi;
      const hint = G.mode === 'versus' ? 'J1 : WASD + F   ·   J2 : flèches + , (virgule)   ·   Retour : G / .' : 'Flèches ou WASD pour choisir · Entrée pour confirmer · Échap pour revenir';
      text(ctx, hint, W / 2, 92, 20, '#fff', { font: FONT2, lw: 4 });
    },
  },

  // ---------- Écran VS ----------
  vs: {
    update() {
      if (G.sceneT === 1) {
        Sfx.stopMusic();
        const [a, b] = G.fighters;
        Sfx.say(`${a.def.name}, contre, ${b.def.name}!`, 1.1, 0.8);
      }
      if (G.sceneT > 200 || (G.sceneT > 30 && Input.edge('confirm'))) {
        G.startRound();
        G.go('fight');
      }
    },
    draw(ctx) {
      const [a, b] = G.fighters;
      const k = Math.min(1, G.sceneT / 20);
      ctx.fillStyle = a.def.color;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(W / 2 + 80, 0); ctx.lineTo(W / 2 - 80, H); ctx.lineTo(0, H);
      ctx.fill();
      ctx.fillStyle = b.def.color;
      ctx.beginPath();
      ctx.moveTo(W, 0); ctx.lineTo(W / 2 + 80, 0); ctx.lineTo(W / 2 - 80, H); ctx.lineTo(W, H);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let i = 0; i < 20; i++) ctx.fillRect(((i * 90 + G.t * 6) % (W + 100)) - 50, 0, 20, H);
      for (const [f, side] of [[a, 0], [b, 1]]) {
        const px = side ? lerp(W + 300, W - 300, ease(k)) : lerp(-300, 300, ease(k));
        ctx.save();
        ctx.translate(px, 690);
        ctx.scale(side ? -1.7 : 1.7, 1.7);
        drawCharacter(ctx, f.def, POSES.intro(G.t), 'angry', G.t, null);
        ctx.restore();
        text(ctx, f.def.name.toUpperCase(), side ? W - 300 : 300, 60, 46, '#fff', { lw: 10 });
        text(ctx, `${f.def.title} · ${PARTY_NAMES[f.def.party]}`, side ? W - 300 : 300, 100, 22, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
        if (G.sceneT > 40) speech(ctx, side ? W - 330 : 330, 160, f.def.intro, side);
      }
      const s = G.sceneT < 30 ? 260 - G.sceneT * 4 : 140 + Math.sin(G.t * 0.2) * 6;
      text(ctx, 'VS', W / 2, H / 2, s, '#ffe14d', { lw: 16 });
      const st = STAGES[G.stage];
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, H - 60, W, 60);
      text(ctx, `${st.name} — ${st.place}`, W / 2, H - 30, 30, '#fff');
      if (G.mode === 'arcade') text(ctx, `COMBAT ${G.arcade.idx + 1} / ${G.arcade.ladder.length}`, W / 2, 190, 36, '#fff');
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { G.startRound(); G.go('fight'); } });
    },
  },

  // ---------- Combat ----------
  fight: {
    update() {
      if (G.mode === 'demo' && (Input.edge('confirm') || Input.edge('back') || Input.edge('pause') || Input.edge('lp'))) {
        Sfx.stopMusic();
        G.go('title');
        return;
      }
      if (G.paused) {
        if (Input.edge('up') || Input.edge('down')) { G.pauseIdx = 1 - G.pauseIdx; Sfx.select(); }
        if (Input.edge('confirm')) G.pauseSelect();
        else if (Input.edge('pause')) { G.paused = false; }
        return;
      }
      if (Input.edge('pause') && G.mode !== 'demo') {
        G.paused = true;
        G.pauseIdx = 0;
        Input.clearBuffers();
        return;
      }
      G.fightUpdate();
    },
    draw(ctx) {
      G.drawFight(ctx);
      if (G.mode === 'demo') {
        text(ctx, 'DÉMO — appuyez sur une touche', W / 2, H - 80, 30, '#fff');
        G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { Sfx.stopMusic(); G.go('title'); } });
      } else if (!G.paused && hasTouch) {
        G.clicks.push({ x: W / 2 - 60, y: 0, w: 120, h: 100, fn: () => { G.paused = true; G.pauseIdx = 0; } });
      }
    },
  },

  // ---------- Résultat ----------
  result: {
    update() {
      G.updateFx();
      for (const f of G.fighters) {
        f.t++;
        if (f.state === 'knock') f.physics(G);
      }
      if (G.sceneT > 60 && (Input.edge('confirm') || (G.mode === 'demo' && G.sceneT > 300))) this.next();
    },
    next() {
      Sfx.confirm();
      if (G.mode === 'arcade') {
        if (G.matchWinner === 0) {
          G.arcade.idx++;
          if (G.arcade.idx >= G.arcade.ladder.length) G.go('ending');
          else startArcadeFight();
        } else G.go('continue');
      } else if (G.mode === 'demo') G.startDemo();
      else G.toSelect(G.mode);
    },
    draw(ctx) {
      G.drawFight(ctx);
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, W, H);
      if (G.matchWinner === 2) {
        text(ctx, 'MATCH NUL!', W / 2, 200, 110, '#ffe14d');
        text(ctx, 'Comme un gouvernement minoritaire.', W / 2, 300, 34, '#fff');
      } else {
        const w = G.fighters[G.matchWinner];
        ctx.save();
        ctx.translate(W / 2 - 300, 640);
        ctx.scale(1.5, 1.5);
        drawCharacter(ctx, w.def, POSES.win(G.t), 'happy', G.t, null);
        ctx.restore();
        text(ctx, 'VICTOIRE!', W / 2 + 160, 140, 120, '#ffe14d', { stroke: w.def.color, lw: 16 });
        text(ctx, w.def.name.toUpperCase(), W / 2 + 160, 235, 50, '#fff');
        speech(ctx, W / 2 + 160, 330, w.def.win, 0, 520);
        if (G.mode === 'versus') text(ctx, G.matchWinner === 0 ? 'JOUEUR 1 GAGNE' : 'JOUEUR 2 GAGNE', W / 2 + 160, 450, 40, '#fff');
        if (G.mode === 'arcade' && G.matchWinner === 1) text(ctx, 'Vous avez perdu vos élections...', W / 2 + 160, 450, 34, '#ff8080');
      }
      if (G.sceneT > 60 && Math.floor(G.t / 30) % 2 === 0) text(ctx, 'ENTRÉE POUR CONTINUER', W / 2 + 160, 560, 40, '#fff');
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { if (G.sceneT > 60) this.next(); } });
    },
  },

  // ---------- Continuer? ----------
  continue: {
    update() {
      const left = 10 - Math.floor(G.sceneT / 60);
      if (Input.edge('confirm') && G.sceneT > 20) { Sfx.confirm(); G.arcade.continues++; startArcadeFight(); }
      else if (left < 0 || Input.edge('back')) { Sfx.back(); G.go('title'); }
    },
    draw(ctx) {
      drawSplitBg(ctx, G.t, 0.3);
      const left = Math.max(0, 10 - Math.floor(G.sceneT / 60));
      const p = ROSTER_BY_ID[G.arcade.player];
      ctx.save();
      ctx.translate(W / 2, 640);
      ctx.scale(1.4, 1.4);
      drawCharacter(ctx, p, POSES.lying(), 'ko', G.t, null);
      ctx.restore();
      text(ctx, 'RECOMPTAGE JUDICIAIRE?', W / 2, 140, 70, '#ffe14d', { stroke: '#c8102e', lw: 12 });
      text(ctx, String(left), W / 2, 300, 160, '#fff');
      text(ctx, 'Entrée pour continuer · Échap pour abandonner', W / 2, 430, 30, '#fff', { font: FONT2, lw: 5 });
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { G.arcade.continues++; startArcadeFight(); } });
    },
  },

  // ---------- Fin du mode arcade ----------
  ending: {
    update() {
      if (G.sceneT === 1) Sfx.say('Félicitations! Vous êtes premier ministre de tout!');
      if (G.sceneT > 90 && Input.edge('confirm')) { Sfx.confirm(); G.go('title'); }
    },
    draw(ctx) {
      drawSplitBg(ctx, G.t, 0.7);
      const p = ROSTER_BY_ID[G.arcade.player];
      // confettis
      for (let i = 0; i < 80; i++) {
        const x = (i * 157 + Math.sin(G.t * 0.03 + i) * 40) % W, y = (i * 71 + G.t * (1 + (i % 4))) % H;
        ctx.fillStyle = ['#ffe14d', '#fff', '#ff4040', '#3aa0ff'][i % 4];
        ctx.fillRect(x, y, 8, 12);
      }
      ctx.save();
      ctx.translate(W / 2, 680);
      ctx.scale(1.6, 1.6);
      drawCharacter(ctx, p, POSES.win(G.t), 'happy', G.t, null);
      ctx.restore();
      text(ctx, 'FÉLICITATIONS!', W / 2, 90, 100, '#ffe14d', { stroke: '#c8102e', lw: 14 });
      text(ctx, `${p.name.toUpperCase()}`, W / 2, 175, 48, '#fff', { stroke: p.color, lw: 10 });
      text(ctx, 'est maintenant premier ministre du Québec, du Canada', W / 2, 225, 30, '#fff', { font: FONT2, weight: 'bold', lw: 6 });
      text(ctx, 'et probablement de la Ligue nationale de hockey.', W / 2, 262, 30, '#fff', { font: FONT2, weight: 'bold', lw: 6 });
      if (G.arcade.continues === 0) text(ctx, 'SANS AUCUN RECOMPTAGE!', W / 2, 310, 34, '#ffe14d');
      G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { if (G.sceneT > 90) G.go('title'); } });
    },
  },
};

function startArcadeFight() {
  const A = G.arcade;
  const opp = A.ladder[A.idx];
  const lvl = clamp(0.15 + G.diff * 0.5 + A.idx * 0.12, 0, 2);
  G.startMatch(A.player, opp, ROSTER_BY_ID[opp].stage, ['human', new AI(lvl)]);
}

// ---------- Décors d'interface ----------
function drawSplitBg(ctx, t, alpha) {
  ctx.fillStyle = '#0a4ea2';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c8102e';
  ctx.beginPath();
  ctx.moveTo(W / 2 + 120, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(W / 2 - 120, H);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 40; i++) {
    const x = ((i % 8) * 180 + t * 0.6 + Math.floor(i / 8) * 90) % (W + 180) - 90;
    const y = Math.floor(i / 8) * 160 + 60 + ((t * 0.3) % 160) - 80;
    const leftSide = x < W / 2 + 120 - (y / H) * 240;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 0.01 + i) * 0.3);
    if (leftSide) fleurPath(ctx, 28); else maplePath(ctx, 30);
    ctx.fill();
    ctx.restore();
  }
  // éclair central
  ctx.fillStyle = '#ffe14d';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(W / 2 + 130, 0); ctx.lineTo(W / 2 + 100, 0);
  ctx.lineTo(W / 2 - 10, H * 0.45); ctx.lineTo(W / 2 + 40, H * 0.45);
  ctx.lineTo(W / 2 - 110, H); ctx.lineTo(W / 2 - 90, H);
  ctx.lineTo(W / 2 + 70, H * 0.42); ctx.lineTo(W / 2 + 20, H * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `rgba(0,0,0,${1 - alpha})`;
  ctx.fillRect(0, 0, W, H);
}
function speech(ctx, x, y, str, side, maxW = 480) {
  ctx.font = `bold 24px ${FONT2}`;
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW - 40 && line) { lines.push(line); line = w; }
    else line = test;
  }
  lines.push(line);
  const bw = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 40);
  const bh = lines.length * 30 + 24;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 4;
  roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 16);
  ctx.fill();
  ctx.stroke();
  lines.forEach((l, i) => text(ctx, l, x, y - bh / 2 + 27 + i * 30, 24, '#141414', { font: FONT2, weight: 'bold', stroke: false }));
}
function shownTop() {
  return 664;
}
function drawPanelText(ctx, x, title, lines) {
  text(ctx, title, x, 300, 36, '#ffe14d');
  lines.forEach((l, i) => text(ctx, l, x, 350 + i * 34, 26, '#fff', { font: FONT2, weight: 'bold', lw: 5 }));
}

// ===================== Boucle principale =====================
const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let acc = 0, last = performance.now();
const STEP = 1000 / 60;

function frame(now) {
  acc += Math.min(100, now - last);
  last = now;
  while (acc >= STEP) {
    acc -= STEP;
    Input.poll();
    G.t++;
    G.sceneT++;
    SCENES[G.scene].update();
  }
  Sfx.tickMusic();
  G.clicks = [];
  SCENES[G.scene].draw(ctx);
  updateTouchVisibility();
  requestAnimationFrame(frame);
}

// Clics / touchers sur le canevas
canvas.addEventListener('pointerdown', (e) => {
  Sfx.init();
  Input.touchActivity();
  const r = canvas.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
  for (let i = G.clicks.length - 1; i >= 0; i--) {
    const c = G.clicks[i];
    if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) { c.fn(); break; }
  }
});

// Commandes tactiles
const touchEl = document.getElementById('touch');
function updateTouchVisibility() {
  const show = hasTouch && G.scene === 'fight' && G.mode !== 'demo' && !G.paused;
  touchEl.classList.toggle('show', show);
}
for (const btn of document.querySelectorAll('[data-key]')) {
  const k = btn.dataset.key;
  const on = (e) => { e.preventDefault(); Input.virtualDown(k); btn.classList.add('on'); };
  const off = (e) => { e.preventDefault(); Input.virtualUp(k); btn.classList.remove('on'); };
  btn.addEventListener('pointerdown', on);
  btn.addEventListener('pointerup', off);
  btn.addEventListener('pointercancel', off);
  btn.addEventListener('pointerleave', off);
}

// Mise à l'échelle
function resize() {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  canvas.style.width = `${Math.floor(W * s)}px`;
  canvas.style.height = `${Math.floor(H * s)}px`;
}
window.addEventListener('resize', resize);
resize();

// Démarrage (attendre la police si possible)
const fontReady = document.fonts && document.fonts.load ? Promise.race([document.fonts.load(`40px Bangers`), new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
fontReady.catch(() => {}).then(() => {
  for (const id of STAGE_IDS) stageLayer(id);
  const params = new URLSearchParams(location.search);
  if (params.has('demo')) G.startDemo();
  requestAnimationFrame((t) => { last = t; frame(t); });
});
window.G = G;
