'use strict';
// ---------- Adversaire contrôlé par l'ordinateur ----------
class AI {
  constructor(level = 1) {
    this.level = level; // 0 facile · 1 normal · 2 difficile (valeurs intermédiaires possibles)
    this.plan = 'approach';
    this.planT = 0;
    this.react = 0;
    this.out = {};
  }
  think(me, opp, G) {
    const L = this.level;
    const o = { left: false, right: false, up: false, down: false, lp: false, hk: false, sp: false, consume() {} };
    const dx = opp.x - me.x, dist = Math.abs(dx);
    const toward = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right';
    if (this.planT > 0) this.planT--;
    if (this.react > 0) this.react--;

    const free = me.state === 'idle' || me.state === 'walk' || me.state === 'crouch';
    const blockP = 0.2 + 0.3 * L;

    // Menaces : attaque adverse ou projectile qui arrive
    const oppAttacking = (opp.state === 'attack' || (opp.state === 'special' && opp.sp && opp.sp.s.type !== 'rain' && opp.sp.s.type !== 'drop')) && dist < 260;
    const incoming = G.projectiles.find((p) => p.owner === opp && Math.abs(p.x - me.x) < 280 && (p.vx === 0 || Math.sign(me.x - p.x) === Math.sign(p.vx) || p.attach || p.ground));
    if (free && (oppAttacking || incoming) && this.plan !== 'guard' && this.plan !== 'jumpover' && this.react === 0) {
      this.react = Math.round(14 - L * 5);
      if (incoming && !incoming.ground && !incoming.attach && Math.random() < 0.15 + 0.2 * L && dist > 200) { this.plan = 'jumpover'; this.planT = 6; }
      else if (Math.random() < blockP) {
        this.plan = 'guard';
        this.planT = 18 + Math.random() * 12;
        this.guardLow = (opp.atk && opp.atk.h === 'low') || (incoming && incoming.h === 'low');
      }
    }

    if (free && this.planT <= 0) {
      const r = Math.random();
      if (me.meter >= 100 && r < 0.02 + 0.03 * L && this.superFits(me, dist)) this.plan = 'super';
      else if (dist > 380) this.plan = r < 0.015 + 0.02 * L && this.isRanged(me) ? 'special' : r < 0.85 ? 'approach' : 'wait';
      else if (dist > 150) {
        if (r < 0.1 + 0.05 * L) this.plan = 'jumpin';
        else if (r < 0.14 + 0.06 * L && this.isRanged(me)) this.plan = 'special';
        else if (r < 0.75) this.plan = 'approach';
        else this.plan = 'wait';
      } else {
        if (r < 0.35) this.plan = 'lp';
        else if (r < 0.58) this.plan = 'hk';
        else if (r < 0.7) this.plan = 'sweep';
        else if (r < 0.78 && !this.isRanged(me)) this.plan = 'special';
        else if (r < 0.86) this.plan = 'retreat';
        else this.plan = 'wait';
      }
      this.planT = this.plan === 'approach' || this.plan === 'retreat' ? 20 + Math.random() * 30 : this.plan === 'wait' ? 10 + Math.random() * (30 - L * 10) : 4;
    }

    switch (this.plan) {
      case 'approach': o[toward] = true; break;
      case 'retreat': o[away] = true; break;
      case 'guard': o[away] = true; o.down = !!this.guardLow; break;
      case 'jumpover': o.up = true; o[toward] = true; break;
      case 'jumpin': o.up = true; o[toward] = true; this.plan = 'airattack'; this.planT = 40; break;
      case 'airattack':
        if (me.state === 'jump' && dist < 150 && me.vy > -4) { o[Math.random() < 0.5 ? 'hk' : 'lp'] = true; }
        break;
      case 'lp': o.lp = true; this.planT = 0; this.plan = 'wait'; this.planT = 6 + Math.random() * (16 - L * 5); break;
      case 'hk': o.hk = true; this.plan = 'wait'; this.planT = 8 + Math.random() * (18 - L * 5); break;
      case 'sweep': o.down = true; o.hk = true; this.plan = 'wait'; this.planT = 12; break;
      case 'special': o.sp = true; this.plan = 'wait'; this.planT = 20; break;
      case 'super': o.sp = true; o.down = true; this.plan = 'wait'; this.planT = 30; break;
    }
    // Les combos sont plus fréquents en difficile
    if (me.state === 'attack' && me.atk && me.atk.hit && me.atk.name === 'lp' && Math.random() < 0.15 * L) this.plan = 'hk';
    return o;
  }
  isRanged(me) {
    const t = me.def.special.type;
    return t === 'projectile' || t === 'wave';
  }
  superFits(me, dist) {
    const t = me.def.super.type;
    if (t === 'dash') return dist < 450;
    return true;
  }
}
