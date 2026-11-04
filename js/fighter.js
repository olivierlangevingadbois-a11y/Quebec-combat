'use strict';
// ---------- Poses (coordonnées locales, regard +x, sol y=0) ----------
const POSES = {
  idle: (t) => ({ hx: 0, hy: -96 + Math.sin(t * 0.12) * 1.8, lean: 0.06, bF: [-22, 0], fF: [26, 0], bH: [30, -150 + Math.sin(t * 0.12) * 2], fH: [46, -162 + Math.sin(t * 0.12) * 2] }),
  walk: (t) => {
    const s = Math.sin(t * 0.25), c = Math.cos(t * 0.25);
    return { hx: 0, hy: -95 + Math.abs(s) * 2, lean: 0.08, bF: [-20 - s * 18, -Math.max(0, -c) * 12], fF: [24 + s * 18, -Math.max(0, c) * 12], bH: [30, -150], fH: [46, -162] };
  },
  crouch: () => ({ hx: 0, hy: -60, lean: 0.18, bF: [-34, 0], fF: [36, 0], bH: [36, -112], fH: [50, -122] }),
  jump: () => ({ hx: 0, hy: -100, lean: 0.05, bF: [-24, -36], fF: [24, -46], bH: [36, -172], fH: [50, -152] }),
  lp: () => ({ hx: 6, hy: -95, lean: 0.2, bF: [-26, 0], fF: [36, 0], bH: [28, -150], fH: [112, -170] }),
  hk: () => ({ hx: -8, hy: -100, lean: -0.3, bF: [-20, 0], fF: [122, -104], bH: [-14, -150], fH: [26, -172] }),
  clp: () => ({ hx: 4, hy: -60, lean: 0.25, bF: [-34, 0], fF: [36, 0], bH: [34, -110], fH: [106, -118] }),
  sweep: () => ({ hx: -10, hy: -46, lean: 0.4, bF: [-34, 0], fF: [130, -6], bH: [-6, -10], fH: [40, -96] }),
  jlp: () => ({ hx: 0, hy: -100, lean: 0.25, bF: [-24, -40], fF: [20, -46], bH: [30, -170], fH: [96, -128] }),
  jhk: () => ({ hx: 0, hy: -102, lean: -0.15, bF: [-22, -50], fF: [92, -24], bH: [10, -176], fH: [36, -168] }),
  throw: () => ({ hx: 8, hy: -95, lean: 0.22, bF: [-30, 0], fF: [38, 0], bH: [84, -152], fH: [100, -168] }),
  windup: () => ({ hx: -6, hy: -95, lean: -0.15, bF: [-26, 0], fF: [28, 0], bH: [-30, -170], fH: [-10, -186] }),
  dash: () => ({ hx: 10, hy: -88, lean: 0.38, bF: [-46, 0], fF: [42, 0], bH: [70, -140], fH: [104, -150] }),
  elbow: () => ({ hx: 10, hy: -90, lean: 0.3, bF: [-46, 0], fF: [42, 0], bH: [40, -140], fH: [30, -214] }),
  rising: () => ({ hx: 0, hy: -112, lean: -0.08, bF: [-12, -14], fF: [46, -66], bH: [20, -150], fH: [44, -252] }),
  hit: () => ({ hx: -10, hy: -94, lean: -0.32, bF: [-28, 0], fF: [18, 0], bH: [-34, -140], fH: [6, -128], tilt: -0.25 }),
  block: () => ({ hx: -2, hy: -95, lean: -0.08, bF: [-28, 0], fF: [22, 0], bH: [30, -162], fH: [36, -192] }),
  cblock: () => ({ hx: -2, hy: -60, lean: 0.05, bF: [-34, 0], fF: [34, 0], bH: [32, -116], fH: [40, -140] }),
  knock: () => ({ hx: 0, hy: -100, lean: -0.7, bF: [10, -20], fF: [40, -40], bH: [-50, -180], fH: [-10, -200], tilt: -0.3 }),
  lying: () => ({ hx: 0, hy: -96, lean: 0, bF: [-14, 0], fF: [14, 0], bH: [-16, -110], fH: [16, -112] }),
  win: (t) => ({ hx: 0, hy: -97, lean: -0.05, bF: [-24, 0], fF: [24, 0], bH: [26, -116], fH: [22 + Math.sin(t * 0.2) * 4, -262 + Math.abs(Math.sin(t * 0.2)) * 14] }),
  intro: (t) => ({ hx: 0, hy: -97 + Math.sin(t * 0.1), lean: -0.02, bF: [-24, 0], fF: [24, 0], bH: [24, -146], fH: [20, -136] }),
};
function lerpPose(a, b, k) {
  const o = {};
  for (const key in a) {
    const va = a[key], vb = b[key] !== undefined ? b[key] : va;
    o[key] = Array.isArray(va) ? [lerp(va[0], vb[0], k), lerp(va[1], vb[1], k)] : lerp(va, vb, k);
  }
  if (b.tilt !== undefined && a.tilt === undefined) o.tilt = b.tilt * k;
  return o;
}

// ---------- Données des coups ----------
const ATK = {
  lp: { startup: 4, active: 3, recovery: 9, dmg: 45, stun: 15, bstun: 9, kb: 4, box: [40, -195, 74, 38], h: 'mid', pose: 'lp' },
  hk: { startup: 8, active: 4, recovery: 17, dmg: 85, stun: 21, bstun: 13, kb: 8, box: [40, -128, 90, 46], h: 'mid', pose: 'hk' },
  clp: { startup: 4, active: 3, recovery: 9, dmg: 40, stun: 14, bstun: 8, kb: 3, box: [40, -136, 72, 34], h: 'mid', pose: 'clp', crouch: true },
  sweep: { startup: 9, active: 4, recovery: 22, dmg: 70, stun: 0, bstun: 12, kb: 5, box: [30, -42, 114, 42], h: 'low', knock: true, pose: 'sweep', crouch: true },
  jlp: { startup: 3, active: 8, recovery: 4, dmg: 55, stun: 16, bstun: 10, kb: 3, box: [25, -150, 80, 56], h: 'high', pose: 'jlp', air: true },
  jhk: { startup: 5, active: 10, recovery: 4, dmg: 80, stun: 20, bstun: 12, kb: 5, box: [25, -96, 86, 66], h: 'high', pose: 'jhk', air: true },
};
const FS = 1.15; // échelle d'affichage des combattants
const SP_POSE = { projectile: 'throw', wave: 'throw', rain: 'win', drop: 'win', beam: 'throw', dash: 'dash', rising: 'rising' };

class Fighter {
  constructor(def, side) {
    this.def = def;
    this.side = side;
    this.maxHp = 1000;
    this.meter = 0;
    this.in = { left: false, right: false, up: false, down: false };
    this.reset();
  }
  reset() {
    this.x = this.side ? W / 2 + 230 : W / 2 - 230;
    this.y = GROUND;
    this.vx = this.vy = 0;
    this.facing = this.side ? -1 : 1;
    this.hp = this.maxHp;
    this.dispHp = this.maxHp;
    this.state = 'intro';
    this.t = 0;
    this.atk = null;
    this.sp = null;
    this.stun = 0;
    this.inv = 0;
    this.spCD = 0;
    this.combo = 0;
    this.prop = null;
    this.guard = false;
    this.airAtkUsed = false;
    this.blockLow = false;
    this.flash = 0;
  }
  get airborne() { return this.y < GROUND - 0.5; }
  setState(s) { this.state = s; this.t = 0; }
  isCrouching() {
    return this.state === 'crouch' || (this.state === 'block' && this.blockLow) || (this.state === 'attack' && this.atk && this.atk.crouch);
  }
  hurtbox() {
    if (this.state === 'down' || this.state === 'getup' || this.state === 'ko' || this.inv > 0) return null;
    if (this.isCrouching()) return { x: this.x - 38, y: this.y - 172 * FS, w: 76, h: 172 * FS };
    if (this.airborne) return { x: this.x - 32, y: this.y - 240 * FS, w: 64, h: 210 * FS };
    return { x: this.x - 34, y: this.y - 250 * FS, w: 68, h: 250 * FS };
  }
  box(b) {
    const x0 = b[0] * FS, y0 = b[1] * FS, w = b[2] * FS, h = b[3] * FS;
    return { x: this.facing === 1 ? this.x + x0 : this.x - x0 - w, y: this.y + y0, w, h };
  }

  startAtk(name, inp) {
    inp.consume(name === 'clp' || name === 'jlp' ? 'lp' : name === 'sweep' || name === 'jhk' ? 'hk' : name);
    this.atk = Object.assign({ name, t: 0, hit: false }, ATK[name]);
    this.state = 'attack';
    this.t = 0;
    if (!this.atk.air) this.vx = 0;
    Sfx.whoosh();
  }

  startSpecial(isSuper, G, inp) {
    const s = isSuper ? this.def.super : this.def.special;
    if (!isSuper && (s.type === 'projectile' || s.type === 'wave') && G.projectiles.some((p) => p.owner === this && !p.isSuper)) return false;
    inp.consume('sp');
    this.sp = { s, t: 0, isSuper, hits: 0, hitCD: 0, startup: isSuper ? 8 : 12 };
    this.state = 'special';
    this.t = 0;
    this.vx = 0;
    this.prop = s.prop || null;
    if (isSuper) {
      this.meter = 0;
      G.startSuper(this, s.name);
    } else {
      Sfx.special();
      G.callout(this, s.name);
    }
    return true;
  }

  update(inp, opp, G) {
    this.t++;
    this.in = inp;
    if (this.spCD > 0) this.spCD--;
    if (this.inv > 0) this.inv--;
    if (this.flash > 0) this.flash--;
    this.dispHp = Math.max(this.hp, this.dispHp - 6);
    const S = this.def.spd;

    const free = this.state === 'idle' || this.state === 'walk' || this.state === 'crouch';
    if (free) {
      if (Math.abs(opp.x - this.x) > 4) this.facing = opp.x > this.x ? 1 : -1;
      const fwd = this.facing === 1 ? inp.right : inp.left;
      const back = this.facing === 1 ? inp.left : inp.right;
      this.guard = back;
      if (inp.sp) {
        if (inp.down && this.meter >= 100) { this.startSpecial(true, G, inp); return this.physics(G); }
        if (this.spCD === 0 && this.startSpecial(false, G, inp)) return this.physics(G);
        inp.consume('sp');
      }
      if (inp.up) {
        const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        this.vy = -19.5;
        this.vx = dir * 5.4 * S;
        this.setState('jump');
        this.airAtkUsed = false;
        Sfx.jump();
        return this.physics(G);
      }
      if (inp.down) {
        this.vx = 0;
        if (inp.lp) { this.startAtk('clp', inp); return this.physics(G); }
        if (inp.hk) { this.startAtk('sweep', inp); return this.physics(G); }
        if (this.state !== 'crouch') this.setState('crouch');
        return this.physics(G);
      }
      if (inp.lp) { this.startAtk('lp', inp); return this.physics(G); }
      if (inp.hk) { this.startAtk('hk', inp); return this.physics(G); }
      const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      if (dir) {
        this.vx = dir * (fwd ? 4.8 : 3.7) * S;
        if (this.state !== 'walk') this.setState('walk');
      } else {
        this.vx = 0;
        if (this.state !== 'idle') this.setState('idle');
      }
      return this.physics(G);
    }

    switch (this.state) {
      case 'jump':
        if (!this.airAtkUsed && inp.lp) { this.startAtk('jlp', inp); this.airAtkUsed = true; }
        else if (!this.airAtkUsed && inp.hk) { this.startAtk('jhk', inp); this.airAtkUsed = true; }
        break;
      case 'attack': this.updateAttack(opp, G); break;
      case 'special': this.updateSpecial(opp, G); break;
      case 'hit':
        this.vx *= 0.86;
        if (--this.stun <= 0) this.setState(this.airborne ? 'jump' : 'idle');
        break;
      case 'block':
        this.vx *= 0.82;
        if (--this.stun <= 0) this.setState(this.blockLow ? 'crouch' : 'idle');
        break;
      case 'down':
        this.vx *= 0.8;
        if (this.t > 42) { this.setState('getup'); }
        break;
      case 'getup':
        this.vx = 0;
        if (this.t > 16) { this.setState('idle'); this.inv = 6; }
        break;
      case 'ko':
        this.vx *= 0.88;
        break;
      case 'intro':
      case 'win':
      case 'lose':
        this.vx = 0;
        break;
    }
    this.physics(G);
  }

  updateAttack(opp, G) {
    const a = this.atk;
    a.t++;
    if (!a.hit && a.t >= a.startup && a.t < a.startup + a.active) {
      if (overlap(this.box(a.box), opp.hurtbox())) {
        a.hit = true;
        G.hit(this, opp, a, this.x);
      }
    }
    if (a.t >= a.startup + a.active + a.recovery) {
      this.atk = null;
      if (a.air) this.setState(this.airborne ? 'jump' : 'idle');
      else this.setState(a.crouch && this.in.down ? 'crouch' : 'idle');
    }
  }

  updateSpecial(opp, G) {
    const sp = this.sp, s = sp.s;
    sp.t++;
    const ST = sp.startup;
    const end = (rec) => {
      if (sp.t >= rec) {
        this.sp = null;
        this.prop = null;
        this.setState('idle');
        this.spCD = 30;
      }
    };
    switch (s.type) {
      case 'projectile':
      case 'wave':
        if (sp.t === ST) G.spawnProjectile(this, s, sp.isSuper);
        end(ST + 20);
        break;
      case 'rain':
        if (sp.t === ST) G.spawnRain(this, opp, s);
        end(ST + 34);
        break;
      case 'drop':
        if (sp.t === ST) G.spawnDrop(this, opp, s);
        end(ST + 30);
        break;
      case 'beam':
        if (sp.t === ST) G.spawnBeam(this, s);
        end(ST + s.dur + 12);
        break;
      case 'dash': {
        const hits = s.hits || 1;
        if (sp.t < ST) { this.vx = 0; break; }
        if (sp.t < ST + s.dur) {
          this.vx = this.facing * s.speed;
          if (sp.hitCD > 0) sp.hitCD--;
          else if (sp.hits < hits && overlap(this.box([0, -220, 96, 210]), opp.hurtbox())) {
            sp.hits++;
            sp.hitCD = 5;
            const last = sp.hits >= hits;
            const res = G.hit(this, opp, {
              dmg: s.dmg / hits, stun: 22, bstun: 16, kb: last ? 9 : 1.5, h: 'mid', knock: last, super: sp.isSuper,
            }, this.x);
            if (last || res === 'block') { sp.t = ST + s.dur; this.vx = -this.facing * 3; }
          }
        } else {
          this.vx *= 0.75;
          end(ST + s.dur + 16);
        }
        break;
      }
      case 'rising':
        if (sp.t < ST) { this.vx = 0; this.inv = Math.max(this.inv, 2); break; }
        if (sp.t === ST) { this.vy = -17; this.vx = this.facing * 3.5; Sfx.jump(); }
        if (sp.t <= ST + 6) this.inv = Math.max(this.inv, 1);
        if (sp.t > ST && sp.t < ST + 18 && !sp.hits && overlap(this.box([0, -270, 84, 230]), opp.hurtbox())) {
          sp.hits = 1;
          G.hit(this, opp, { dmg: s.dmg, stun: 24, bstun: 16, kb: 6, h: 'mid', knock: true }, this.x);
        }
        if (sp.t > ST + 2 && !this.airborne) {
          if (!sp.landT) sp.landT = sp.t;
          this.vx = 0;
          end(sp.landT + 14);
        }
        break;
    }
  }

  physics(G) {
    const wasAir = this.airborne;
    if (wasAir || this.vy < 0) this.vy += GRAV;
    this.x += this.vx;
    this.y += this.vy;
    if (this.y >= GROUND) {
      this.y = GROUND;
      if (wasAir) this.land(G);
      this.vy = 0;
    }
    this.x = clamp(this.x, 50, W - 50);
  }

  land(G) {
    if (this.state === 'jump' || (this.state === 'attack' && this.atk && this.atk.air)) {
      this.atk = null;
      this.setState('idle');
      this.vx = 0;
      G.dust(this.x, 0.6);
      Sfx.land();
    } else if (this.state === 'knock') {
      G.dust(this.x, 1.4);
      G.shake = Math.max(G.shake, 6);
      Sfx.land();
      this.vx *= 0.4;
      this.setState(this.hp <= 0 ? 'ko' : 'down');
    } else if (this.state === 'hit') {
      this.setState('down');
    }
  }

  // ---------- Rendu ----------
  pose() {
    const t = G.t;
    switch (this.state) {
      case 'idle': return POSES.idle(t + this.side * 20);
      case 'walk': return POSES.walk(this.x * 0.35 * this.facing);
      case 'crouch': return POSES.crouch(t);
      case 'jump': return POSES.jump(t);
      case 'attack': {
        const a = this.atk;
        const base = a.air ? POSES.jump(t) : a.crouch ? POSES.crouch(t) : POSES.idle(t);
        let k;
        if (a.t < a.startup) k = ease(a.t / a.startup);
        else if (a.t < a.startup + a.active) k = 1;
        else k = 1 - ease((a.t - a.startup - a.active) / a.recovery);
        return lerpPose(base, POSES[a.pose](), k);
      }
      case 'special': {
        const s = this.sp.s, st = this.sp.startup;
        let name = SP_POSE[s.type];
        if (s.prop === 'elbow') name = 'elbow';
        if (s.type === 'rising' && this.sp.t < st) return lerpPose(POSES.idle(t), POSES.crouch(), this.sp.t / st);
        if (s.type === 'rising' && !this.airborne && this.sp.landT) return POSES.crouch();
        if (this.sp.t < st) return lerpPose(POSES.idle(t), POSES.windup(), ease(this.sp.t / st));
        return lerpPose(POSES.windup(), POSES[name](t), ease((this.sp.t - st) / 4));
      }
      case 'hit': return POSES.hit();
      case 'block': return this.blockLow ? POSES.cblock() : POSES.block();
      case 'knock': return POSES.knock();
      case 'down': case 'ko': return POSES.lying();
      case 'getup': return lerpPose(POSES.lying(), POSES.crouch(), this.t / 16);
      case 'win': return POSES.win(t);
      case 'intro': return POSES.intro(t + this.side * 30);
      default: return POSES.idle(t);
    }
  }
  expr() {
    switch (this.state) {
      case 'attack': case 'special': return 'angry';
      case 'hit': case 'knock': case 'block': case 'getup': return 'hurt';
      case 'down': return 'hurt';
      case 'ko': return 'ko';
      case 'win': return 'happy';
      default: return this.hp < 250 ? 'angry' : 'neutral';
    }
  }
  draw(ctx) {
    // ombre
    const air = GROUND - this.y;
    ctx.fillStyle = `rgba(0,0,0,${0.35 - Math.min(0.2, air / 800)})`;
    ellipse(ctx, this.x, GROUND + 2, 52 - Math.min(25, air / 10), 10);
    ctx.fill();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(FS, FS);
    const lying = this.state === 'down' || this.state === 'ko';
    if (lying) {
      // couché sur le dos
      ctx.scale(this.facing, 1);
      ctx.translate(120, -38);
      ctx.rotate(-Math.PI / 2);
    } else {
      ctx.scale(this.facing, 1);
      if (this.state === 'knock') ctx.rotate(-0.4);
    }
    if (this.inv > 0 && this.state !== 'special' && G.t % 4 < 2) ctx.globalAlpha = 0.6;
    if (this.state === 'special' && this.sp && this.sp.isSuper) {
      ctx.shadowColor = this.def.color;
      ctx.shadowBlur = 25;
    }
    if (this.flash > 0) ctx.filter = `brightness(${1 + this.flash * 0.12})`;
    drawCharacter(ctx, this.def, this.pose(), this.expr(), G.t, this.prop);
    ctx.filter = 'none';
    ctx.restore();
  }
}

// ---------- Projectiles ----------
class Projectile {
  constructor(o) {
    Object.assign(this, {
      vx: 0, vy: 0, grav: 0, rot: 0, spin: 0, life: 260, hitCD: 0, hits: 1, h: 'mid',
      knock: false, isSuper: false, dead: false, t: 0, ground: false, w: 60, hh: 60, dir: 0,
    }, o);
    this.hitsLeft = this.hits;
    this.dmgPer = this.dmg / this.hits;
  }
  rect() { return { x: this.x - this.w / 2, y: this.y - this.hh / 2, w: this.w, h: this.hh }; }
  update(G) {
    this.t++;
    if (this.attach) {
      const o = this.owner;
      this.x = o.x + o.facing * (60 + this.w / 2);
      this.y = o.y - 170 * FS;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.grav;
    this.rot += this.spin;
    if (this.hitCD > 0) this.hitCD--;
    if (--this.life <= 0) this.dead = true;
    if (this.x < -320 || this.x > W + 320) this.dead = true;
    if (this.ground && this.y + this.hh / 2 >= GROUND + 4) {
      this.dead = true;
      G.impact(this);
    }
  }
}
