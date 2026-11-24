'use strict';
// ---------- Mode Campagne électorale ----------
// Un parcours façon « roguelite » sur la carte du Québec : à chaque étape on choisit
// une région (adversaire + événement), on gagne des promesses électorales qui s'accumulent,
// le sondage monte ou descend, et tout se termine par le débat des chefs et la soirée électorale.

// Régions, par étape (deux choix chaque fois). Coordonnées sur la carte (zone y 70..470).
const CAMP_REGIONS = [
  [
    { id: 'gaspesie', name: 'Gaspésie', prep: 'en Gaspésie', x: 1130, y: 335, stage: 'plaines' },
    { id: 'cotenord', name: 'Côte-Nord', prep: 'sur la Côte-Nord', x: 1020, y: 165, stage: 'vieuxquebec' },
  ],
  [
    { id: 'bsl', name: 'Bas-Saint-Laurent', prep: 'dans le Bas-Saint-Laurent', x: 935, y: 350, stage: 'plaines' },
    { id: 'saguenay', name: 'Saguenay', prep: 'au Saguenay', x: 805, y: 170, stage: 'vieuxquebec' },
  ],
  [
    { id: 'quebec', name: 'Québec', prep: 'à Québec', x: 790, y: 318, stage: 'vieuxquebec' },
    { id: 'mauricie', name: 'Mauricie', prep: 'en Mauricie', x: 655, y: 245, stage: 'plaines' },
  ],
  [
    { id: 'estrie', name: 'Estrie', prep: 'en Estrie', x: 750, y: 412, stage: 'plaines' },
    { id: 'laurentides', name: 'Laurentides', prep: 'dans les Laurentides', x: 480, y: 245, stage: 'plaines' },
  ],
  [
    { id: 'montreal', name: 'Montréal', prep: 'à Montréal', x: 565, y: 388, stage: 'pontjc' },
    { id: 'abitibi', name: 'Abitibi', prep: 'en Abitibi', x: 250, y: 150, stage: 'vieuxquebec' },
  ],
  [
    { id: 'outaouais', name: 'Outaouais', prep: 'en Outaouais', x: 330, y: 360, stage: 'colline' },
    { id: 'monteregie', name: 'Montérégie', prep: 'en Montérégie', x: 640, y: 428, stage: 'pontjc' },
  ],
];
const CAMP_FINAL = { id: 'debat', name: 'Débat des chefs', prep: 'au débat des chefs', x: 170, y: 392, stage: 'salonbleu', final: true };
const CAMP_STEPS = CAMP_REGIONS.length + 1;

// Événements qui changent les règles d'un combat
const CAMP_MODS = {
  none: { id: 'none', name: 'Temps doux', desc: 'Aucun imprévu. Profitez-en.', bonus: 0, icon: '☀' },
  verglas: { id: 'verglas', name: 'Tempête de verglas', desc: 'Le sol est une patinoire.', ice: true, bonus: 2, icon: '❄' },
  debat: { id: 'debat', name: 'Débat télévisé', desc: 'Pas d\'objets. 45 secondes chrono.', noItems: true, timer: 45, bonus: 2, icon: '📺' },
  promesses: { id: 'promesses', name: 'Pluie de promesses', desc: 'Les objets tombent 3 fois plus souvent.', itemRate: 3, bonus: 0, icon: '☂' },
  enquete: { id: 'enquete', name: 'Commission d\'enquête', desc: 'Tous les coups font 50 % plus mal.', dmg: 1.5, bonus: 3, icon: '⚖' },
  cones: { id: 'cones', name: 'Saison des cônes orange', desc: 'Des cônes tombent du ciel. Sur tout le monde.', cones: true, bonus: 2, icon: '▲' },
  miel: { id: 'miel', name: 'Lune de miel', desc: 'Vous commencez avec le SUPER plein.', meterStart: 100, bonus: -1, icon: '♥' },
  scandale: { id: 'scandale', name: 'Scandale!', desc: 'L\'adversaire est déchaîné : il frappe 30 % plus fort.', oppDmg: 1.3, bonus: 5, icon: '!' },
};
const CAMP_FINAL_MOD = { id: 'final', name: 'Débat des chefs', desc: 'Le grand affrontement. Deux rondes gagnantes, pas d\'objets.', noItems: true, bonus: 8, icon: '★' };

// Promesses électorales (bonus permanents pour la campagne, cumulables)
const CAMP_PERKS = [
  { id: 'impots', name: 'Baisse d\'impôts', desc: '+20 % de dégâts', icon: '$' },
  { id: 'bouclier', name: 'Bouclier fiscal', desc: '-20 % de dégâts reçus', icon: '⛨' },
  { id: 'caisse', name: 'Caisse électorale', desc: 'Chaque combat commence avec 50 % de SUPER', icon: '⚡' },
  { id: 'poutine', name: 'Poutine pour tous', desc: '+150 points de vie maximum', icon: '♨' },
  { id: 'ligne', name: 'Ligne de parti', desc: 'Régénère lentement la santé', icon: '✚' },
  { id: 'machine', name: 'Machine électorale', desc: 'Spéciaux rechargés deux fois plus vite', icon: '⚙' },
  { id: 'pub', name: 'Pub négative', desc: 'L\'adversaire commence avec 12 % de vie en moins', icon: '✖' },
  { id: 'sondeur', name: 'Sondeur ami', desc: '+2 points de sondage par victoire', icon: '%' },
];

const PAPER_FONT = 'Georgia, "Times New Roman", serif';

const Campaign = {
  C: null,

  start(player, skin) {
    this.C = {
      player, skin, step: 0, lives: 2, poll: 12, perks: {}, path: [], used: new Set([player]),
      choices: [], sel: 0, node: null, news: null, perkChoices: [], perkSel: 0, deltaShown: 0,
    };
    this.genChoices();
    Voice.ann('campagne', 'Campagne électorale!');
    G.go('map');
  },

  genChoices() {
    const C = this.C;
    const pickOpp = (avoid) => {
      const pool = ROSTER.map((c) => c.id).filter((id) => !C.used.has(id) && !avoid.includes(id));
      return pick(pool.length ? pool : ROSTER.map((c) => c.id).filter((id) => id !== C.player));
    };
    if (C.step >= CAMP_REGIONS.length) {
      C.choices = [{ region: CAMP_FINAL, opp: pickOpp([]), mod: CAMP_FINAL_MOD }];
    } else {
      const mods = Object.values(CAMP_MODS).filter((m) => m.id !== 'none');
      const m1 = C.step === 0 ? CAMP_MODS.none : pick(mods);
      const m2 = pick(mods.filter((m) => m !== m1));
      const o1 = pickOpp([]);
      C.choices = CAMP_REGIONS[C.step].map((region, i) => ({ region, opp: i ? pickOpp([o1]) : o1, mod: i ? m2 : m1 }));
    }
    C.sel = 0;
  },

  launch() {
    const C = this.C;
    const n = (C.node = C.choices[C.sel]);
    const final = !!n.region.final;
    const lvl = clamp(0.25 + G.diff * 0.45 + C.step * 0.13 + (final ? 0.3 : 0), 0, 2.2);
    let stage = n.region.stage;
    if (final) stage = ROSTER_BY_ID[n.opp].level === 'CA' ? 'communes' : 'salonbleu';
    if (final) Voice.ann('debat', 'Débat des chefs!');
    G.startMatch(C.player, n.opp, stage, ['human', new AI(lvl)], [C.skin, 0], { firstTo: final ? 2 : 1, mod: n.mod });
  },

  // Appelé au début de chaque ronde d'un combat de campagne
  onRound() {
    const C = this.C, p = C.perks, mod = G.mod || {};
    const [me, opp] = G.fighters;
    me.dmgMul = 1 + 0.2 * (p.impots || 0);
    me.takeMul = Math.pow(0.8, p.bouclier || 0);
    me.spCDBase = p.machine ? Math.max(8, 30 >> p.machine) : 30;
    me.maxHp = 1000 + 150 * (p.poutine || 0);
    me.hp = me.dispHp = me.maxHp;
    if (G.round === 1) {
      if (p.caisse) me.meter = Math.max(me.meter, Math.min(100, 50 * p.caisse));
      if (mod.meterStart) me.meter = mod.meterStart;
    }
    opp.dmgMul = mod.oppDmg || 1;
    if (p.pub) opp.hp = opp.dispHp = Math.round(opp.maxHp * Math.pow(0.88, p.pub));
    this.regenT = 0;
    this.coneT = 120;
  },

  // Appelé à chaque image de combat
  tick() {
    const C = this.C, mod = G.mod || {};
    const me = G.fighters[0];
    if (G.phase !== 'fight') return;
    if (C.perks.ligne && me.hp > 0 && me.state !== 'ko' && ++this.regenT >= Math.round(14 / C.perks.ligne)) {
      this.regenT = 0;
      me.hp = Math.min(me.maxHp, me.hp + 1);
      me.dispHp = Math.max(me.dispHp, me.hp);
    }
    if (mod.cones) {
      if (--this.coneT <= 0) {
        this.coneT = rand(70, 140);
        const target = pick(G.fighters);
        G.cones.push({ x: clamp(target.x + rand(-160, 160), 60, W - 60), y: -40, vy: 2, rot: rand(-1, 1), spin: rand(-0.15, 0.15) });
      }
      for (const c of G.cones) {
        c.vy += 0.45;
        c.y += c.vy;
        c.rot += c.spin;
        if (c.y >= GROUND - 18) {
          c.dead = true;
          G.dust(c.x, 0.5);
          Sfx.land();
          continue;
        }
        const box = { x: c.x - 18, y: c.y - 24, w: 36, h: 44 };
        for (const f of G.fighters) {
          if (!c.dead && overlap(box, f.hurtbox())) { c.dead = true; this.coneHit(f, c.x); }
        }
      }
      G.cones = G.cones.filter((c) => !c.dead);
    }
  },

  coneHit(f, x) {
    if (G.phase !== 'fight' || f.hp <= 0) return;
    const other = G.fighters[1 - f.side];
    const dir = f.x >= x ? 1 : -1;
    f.hp = Math.max(0, f.hp - 45);
    f.flash = 8;
    G.sparks(f.x, f.y - 230, '#ff8a1a', 14);
    G.popText(pick(['CÔNE!', 'TRAVAUX!', 'DÉTOUR!', 'BOUCHON!']), f.x, f.y - 300, 34, '#ff8a1a');
    Sfx.hit(false);
    G.shake = Math.max(G.shake, 5);
    if (f.hp <= 0) { G.ko(other, f, dir); return; }
    f.atk = f.sp = null;
    f.prop = null;
    f.setState('hit');
    f.stun = 18;
    f.vx = dir * 2;
  },

  drawFightLayer(ctx) {
    const mod = G.mod || {};
    const t = G.t;
    if (mod.ice) {
      const g = ctx.createLinearGradient(0, GROUND - 30, 0, H);
      g.addColorStop(0, 'rgba(200,235,255,0)');
      g.addColorStop(0.3, 'rgba(200,235,255,0.45)');
      g.addColorStop(1, 'rgba(160,210,250,0.6)');
      ctx.fillStyle = g;
      ctx.fillRect(0, GROUND - 30, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) {
        const x = (i * 97 + (t * 0.5)) % W, y = GROUND + 10 + (i * 37) % 60;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 70; i++) {
        const x = (i * 211 + Math.sin(t * 0.03 + i) * 40 - t * 1.2) % W;
        const y = (i * 89 + t * (1.5 + (i % 3))) % H;
        ctx.fillRect((x + W) % W, y, 2, 6);
      }
    }
    if (mod.cones) {
      for (const [x, r] of [[90, -0.2], [130, 0.1], [1150, 0.15], [1195, -0.1]]) drawCone(ctx, x, GROUND + 4, r, 1);
      for (const c of G.cones) drawCone(ctx, c.x, c.y + 22, c.rot, 1);
    }
    if (mod.noItems && G.mode === 'campaign') {
      // bandeau « EN DIRECT »
      ctx.fillStyle = '#c8102e';
      roundRect(ctx, 30, 150, 150, 34, 6);
      ctx.fill();
      ctx.fillStyle = Math.floor(t / 20) % 2 ? '#fff' : '#ffb3b3';
      circle(ctx, 50, 167, 7);
      ctx.fill();
      text(ctx, 'EN DIRECT', 115, 168, 22, '#fff', { stroke: false });
    }
  },

  drawVsInfo(ctx) {
    const n = this.C.node;
    text(ctx, `ÉTAPE ${Math.min(this.C.step + 1, CAMP_STEPS)} / ${CAMP_STEPS} — ${n.region.name.toUpperCase()}`, W / 2, 200, 34, '#fff');
    text(ctx, `${n.mod.icon} ${n.mod.name} : ${n.mod.desc}`, W / 2, 240, 22, '#ffe14d', { font: FONT2, weight: 'bold', lw: 5 });
  },

  // Après un combat : calcul du sondage + une du journal
  afterMatch() {
    const C = this.C, n = C.node, p = C.perks;
    const [me, opp] = G.fighters;
    const result = G.matchWinner === 0 ? 'win' : G.matchWinner === 2 ? 'draw' : 'loss';
    let delta = 0;
    const perfect = result === 'win' && me.hp >= me.maxHp;
    if (result === 'win') delta = 2 + n.mod.bonus + (perfect ? 3 : 0) + 2 * (p.sondeur || 0) + Math.round(me.hp / me.maxHp * 2);
    else if (result === 'loss') delta = -6;
    const before = C.poll;
    C.poll = clamp(C.poll + delta, 1, 75);
    C.news = { result, delta: C.poll - before, before, perfect, node: n, me: me.def, opp: opp.def, mod: n.mod, ...this.headline(result, perfect, me.def, opp.def, n) };
    if (result === 'win') {
      C.path.push(n.region);
      C.used.add(n.opp);
    } else if (result === 'loss') C.lives--;
    Voice.ann('extra', 'Édition spéciale!');
    G.go('news');
  },

  headline(result, perfect, me, opp, n) {
    const P = me.short, O = opp.short, R = n.region.prep, RU = R.toUpperCase();
    const subs = {
      none: ['Les experts sont unanimes : ça a fait mal.', 'Les électeurs ont apprécié le spectacle.'],
      verglas: ['Les deux candidats ont fini sur les fesses, mais un seul s\'est relevé.', 'Hydro-Québec confirme : le courant ne passait pas entre eux.'],
      debat: ['Le modérateur a perdu le contrôle dès la première minute.', 'Aucune question n\'a reçu de réponse. Plusieurs ont reçu des claques.'],
      promesses: ['Il a plu des promesses. Aucune ne sera tenue.', 'Les poutines tombées du ciel font l\'objet d\'une enquête.'],
      enquete: ['La commission recommande... plus de claques.', 'Le rapport de 2 400 pages tient en un mot : « ouch ».'],
      cones: ['Le ministère des Transports nie toute implication.', 'Les travaux devraient se terminer en 2047.'],
      miel: ['La lune de miel se poursuit. Pour l\'instant.', 'Les militants sont aux anges.'],
      scandale: [`${O} parle d'une « campagne de salissage ».`, 'Les documents compromettants auraient été déchiquetés... à coups de poing.'],
      final: ['Les chefs ne se sont jamais adressé la parole. Seulement des coups.', 'Record d\'écoute : même les chats regardaient.'],
    };
    const sub = pick(subs[n.mod.id] || subs.none);
    let head;
    if (n.region.final && result === 'win') head = pick([`${P} GAGNE LE DÉBAT DES CHEFS!`, `${O} K.O. EN DIRECT À LA TÉLÉ`, `DÉBAT : ${P} A EU LE DERNIER MOT (ET LE DERNIER COUP)`]);
    else if (result === 'win' && perfect) head = pick([`${P} BLANCHIT ${O} ${RU}`, `SANS FAUTE : ${O} N'A RIEN VU PASSER`, `${O} N'A PAS TOUCHÉ ${P} UNE SEULE FOIS`]);
    else if (result === 'win') head = pick([`${P} DÉMOLIT ${O} ${RU}!`, `${O} DEMANDE UN RECOMPTAGE`, `DÉGELÉE HISTORIQUE ${RU}`, `${n.region.name.toUpperCase()} CHOISIT ${P}`, `${O} RENVOYÉ À SES CHAUDRONS`]);
    else if (result === 'draw') head = pick([`ÉGALITÉ ${RU} : PERSONNE N'A GAGNÉ, TOUT LE MONDE A MAL`, `${P} ET ${O} À ÉGALITÉ. LES ÉLECTEURS AUSSI.`]);
    else if (this.C.lives <= 0) head = pick([`FIN DE CAMPAGNE POUR ${P}?`, `${P} : LE PARTI CONVOQUE UN CAUCUS D'URGENCE`]);
    else head = pick([`DÉBÂCLE ${RU} POUR ${P}`, `${P} MORD LA POUSSIÈRE ${RU}`, `${O} HUMILIE ${P}`]);
    const caption = result === 'loss' ? `${me.name} au tapis ${R}. (Photo : La Chicane)` : `${me.name} célèbre ${R} sous le regard de ${opp.name}... enfin, de ce qu'il en reste.`;
    return { head, sub: result === 'loss' ? (this.C.lives > 0 ? 'Le parti réclame un recomptage judiciaire. La campagne continue.' : sub) : sub, caption };
  },

  finish() {
    const C = this.C;
    C.finalSeats = this.seats();
    C.finalTier = this.tier(C.finalSeats);
    Store.data.camp = Store.data.camp || {};
    Store.data.camp[C.player] = Math.max(Store.data.camp[C.player] || 0, C.finalSeats);
    Store.save();
    G.go('campEnd');
    G.newUnlocks = C.finalTier.id === 'majoritaire' ? recordWin(C.player, true) : [];
    Sfx.stopMusic();
  },

  afterNews() {
    const C = this.C, r = C.news.result;
    if (r === 'win') {
      if (C.node.region.final) { this.finish(); return; }
      C.perkChoices = shuffle(CAMP_PERKS).slice(0, 3);
      C.perkSel = 0;
      G.go('perk');
    } else if (r === 'loss' && C.lives < 0) {
      this.finish();
    } else G.go('map');
  },

  choosePerk(i) {
    const C = this.C, k = C.perkChoices[i];
    C.perks[k.id] = (C.perks[k.id] || 0) + 1;
    C.step++;
    this.genChoices();
    Sfx.confirm();
    G.go('map');
  },

  seats() {
    const C = this.C;
    // scrutin uninominal : quelques points de plus font basculer beaucoup de sièges
    const k = clamp((C.poll - 12) / 53, 0, 1);
    return Math.round(125 * Math.pow(k, 1.1) * (C.lives < 0 ? 0.6 : 1));
  },
  tier(seats) {
    if (seats >= 63) return { id: 'majoritaire', name: 'GOUVERNEMENT MAJORITAIRE!', sub: 'Les clés du pouvoir. Toutes. Même celles du 3e lien.', col: '#ffe14d' };
    if (seats >= 45) return { id: 'minoritaire', name: 'GOUVERNEMENT MINORITAIRE', sub: 'Vous gouvernez... tant que les autres vous laissent faire.', col: '#9be0ff' };
    if (seats >= 25) return { id: 'opposition', name: 'OPPOSITION OFFICIELLE', sub: 'Quatre ans à poser des questions. Et à attendre.', col: '#ffb347' };
    return { id: 'tiers', name: 'TIERS PARTI', sub: 'Pas assez de sièges pour être reconnu. Même pas pour poser des questions.', col: '#ff8080' };
  },
  bestText(id) {
    const b = Store.data.camp && Store.data.camp[id];
    if (!b) return ['Meilleur résultat :', 'aucun encore'];
    return ['Meilleur résultat :', `${b} sièges sur 125`];
  },
};

// ---------- Dessins ----------
function drawCone(ctx, x, y, rot, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = '#2b2b2b';
  ctx.fillRect(-20, -4, 40, 6);
  ctx.strokeRect(-20, -4, 40, 6);
  ctx.fillStyle = '#ff7a1a';
  ctx.beginPath();
  ctx.moveTo(-14, -4); ctx.lineTo(-4, -44); ctx.lineTo(4, -44); ctx.lineTo(14, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(-10, -16); ctx.lineTo(10, -16); ctx.lineTo(8, -23); ctx.lineTo(-8, -23); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-6, -30); ctx.lineTo(6, -30); ctx.lineTo(5, -36); ctx.lineTo(-5, -36); ctx.fill();
  ctx.restore();
}

function wrapLines(ctx, str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  lines.push(line);
  return lines;
}

function drawQcMap(ctx, t) {
  // mer et terre
  ctx.fillStyle = '#9cc7e4';
  ctx.fillRect(0, 70, W, 400);
  ctx.fillStyle = '#e9dfb9';
  ctx.beginPath();
  ctx.moveTo(0, 70); ctx.lineTo(W, 70); ctx.lineTo(W, 150);
  ctx.quadraticCurveTo(1180, 190, 1090, 210);
  ctx.lineTo(1000, 250); ctx.quadraticCurveTo(780, 330, 560, 395);
  ctx.quadraticCurveTo(400, 430, 0, 450);
  ctx.closePath();
  ctx.fill();
  // rive sud + Gaspésie
  ctx.beginPath();
  ctx.moveTo(0, 470); ctx.lineTo(0, 468);
  ctx.quadraticCurveTo(400, 448, 570, 412);
  ctx.quadraticCurveTo(790, 352, 1000, 292);
  ctx.quadraticCurveTo(1120, 262, 1190, 280);
  ctx.quadraticCurveTo(1240, 300, 1210, 340);
  ctx.quadraticCurveTo(1150, 372, 1060, 380);
  ctx.lineTo(1060, 470);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9cc7e4';
  ctx.fillRect(1060, 395, 220, 75);
  // texture : arbres
  ctx.fillStyle = 'rgba(70,110,60,0.35)';
  for (let i = 0; i < 160; i++) {
    const x = (i * 137) % W, y = 85 + (i * 61) % 170;
    ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x - 5, y + 4); ctx.lineTo(x + 5, y + 4); ctx.fill();
  }
  // vagues
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    const x = 1080 + (i % 4) * 45 + Math.sin(t * 0.03 + i) * 4, y = 200 + Math.floor(i / 4) * 80 + (i % 2) * 20;
    ctx.beginPath(); ctx.arc(x, y, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  // frontière sud
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = 'rgba(120,80,40,0.5)';
  ctx.beginPath(); ctx.moveTo(380, 470); ctx.lineTo(380, 455); ctx.lineTo(1000, 455); ctx.stroke();
  ctx.setLineDash([]);
  text(ctx, 'Fleuve Saint-Laurent', 880, 300, 18, 'rgba(30,70,110,0.8)', { font: PAPER_FONT, stroke: false });
  text(ctx, 'Golfe', 1200, 245, 18, 'rgba(30,70,110,0.8)', { font: PAPER_FONT, stroke: false });
  // rose des vents
  ctx.save();
  ctx.translate(1215, 120);
  ctx.fillStyle = '#7a5130';
  ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(7, 0); ctx.lineTo(0, 28); ctx.lineTo(-7, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(0, 7); ctx.lineTo(28, 0); ctx.lineTo(0, -7); ctx.closePath(); ctx.fill();
  text(ctx, 'N', 0, -40, 18, '#7a5130', { font: PAPER_FONT, stroke: false });
  ctx.restore();
  // cadre
  ctx.strokeStyle = '#7a5130';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 73, W - 6, 394);
}

function drawMapNode(ctx, r, state, color, t) {
  const pulse = state === 'choice' || state === 'selected' ? Math.sin(t * 0.15) * 3 : 0;
  const rad = (r.final ? 20 : 14) + pulse + (state === 'selected' ? 4 : 0);
  ctx.fillStyle = state === 'done' ? color : state === 'locked' ? '#b9ae8f' : state === 'selected' ? '#ffe14d' : '#fff';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 3;
  circle(ctx, r.x, r.y, rad);
  ctx.fill();
  ctx.stroke();
  if (r.final) {
    ctx.fillStyle = '#c8102e';
    ctx.save(); ctx.translate(r.x, r.y); fleurPath(ctx, 9); ctx.fill(); ctx.restore();
  } else if (state === 'done') {
    text(ctx, '✓', r.x, r.y + 1, 18, '#fff', { stroke: false, font: FONT2, weight: 'bold' });
  }
  text(ctx, r.name, r.x, r.y + rad + 14, state === 'locked' ? 15 : 18, state === 'locked' ? '#8a7f60' : '#3a2a18',
    { font: PAPER_FONT, weight: 'bold', stroke: state === 'locked' ? false : '#f4efe1', lw: 4 });
}

function drawPollBar(ctx, x, y, w, poll, color) {
  ctx.fillStyle = '#141414';
  roundRect(ctx, x - 3, y - 3, w + 6, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#444';
  ctx.fillRect(x, y, w, 20);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * clamp(poll / 60, 0, 1), 20);
  // seuil de majorité (~45 %)
  const mx = x + w * (41 / 60);
  ctx.strokeStyle = '#ffe14d';
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(mx, y - 6); ctx.lineTo(mx, y + 26); ctx.stroke();
  ctx.setLineDash([]);
}

function perkChips(ctx, x, y, perks, maxX = W - 20) {
  const ids = Object.keys(perks);
  if (!ids.length) { text(ctx, 'Aucune promesse... encore.', x, y, 18, '#ddd', { align: 'left', font: FONT2, lw: 4 }); return; }
  let cx = x;
  for (const id of ids) {
    const k = CAMP_PERKS.find((q) => q.id === id);
    const label = `${k.icon} ${k.name}${perks[id] > 1 ? ' ×' + perks[id] : ''}`;
    ctx.font = `bold 16px ${FONT2}`;
    const w = ctx.measureText(label).width + 18;
    if (cx + w > maxX && cx > x) { cx = x; y += 32; }
    ctx.fillStyle = 'rgba(255,225,77,0.9)';
    roundRect(ctx, cx, y - 13, w, 26, 13);
    ctx.fill();
    text(ctx, label, cx + w / 2, y, 16, '#141414', { font: FONT2, weight: 'bold', stroke: false });
    cx += w + 8;
  }
}

// ---------- Scènes ----------
SCENES.map = {
  update() {
    const C = Campaign.C;
    const n = C.choices.length;
    if (Input.edge('left') || Input.edge('up')) { C.sel = (C.sel + n - 1) % n; Sfx.select(); }
    if (Input.edge('right') || Input.edge('down')) { C.sel = (C.sel + 1) % n; Sfx.select(); }
    if (Input.edge('confirm') && G.sceneT > 15) { Sfx.confirm(); Campaign.launch(); }
    else if (Input.edge('pause') && G.sceneT > 15) { Sfx.back(); G.go('menu'); }
  },
  draw(ctx) {
    const C = Campaign.C;
    const me = applySkin(ROSTER_BY_ID[C.player], C.skin);
    ctx.fillStyle = '#2b1d12';
    ctx.fillRect(0, 0, W, H);
    drawQcMap(ctx, G.t);
    // trajet parcouru
    const done = C.path;
    ctx.strokeStyle = me.color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    done.forEach((r, i) => (i ? ctx.lineTo(r.x, r.y) : ctx.moveTo(r.x, r.y)));
    ctx.stroke();
    // prochains choix
    const last = done[done.length - 1];
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 4;
    C.choices.forEach((ch, i) => {
      if (!last) return;
      ctx.strokeStyle = i === C.sel ? '#c8102e' : 'rgba(60,40,20,0.5)';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(ch.region.x, ch.region.y); ctx.stroke();
    });
    ctx.setLineDash([]);
    // noeuds
    const choiceIds = C.choices.map((c) => c.region.id);
    const all = [...CAMP_REGIONS.flat(), CAMP_FINAL];
    for (const r of all) {
      const ci = choiceIds.indexOf(r.id);
      const state = done.includes(r) ? 'done' : ci >= 0 ? (ci === C.sel ? 'selected' : 'choice') : 'locked';
      drawMapNode(ctx, r, state, me.color, G.t);
    }
    // jeton du candidat
    const at = last || { x: 1230, y: 400 };
    ctx.save();
    ctx.translate(at.x, at.y - 40 + Math.sin(G.t * 0.1) * 3);
    ctx.scale(0.5, 0.5);
    ctx.fillStyle = me.color;
    circle(ctx, 0, 0, 52); ctx.fill();
    ctx.strokeStyle = '#141414'; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.save(); ctx.clip();
    ctx.translate(-6, 10); drawHead(ctx, me, 'happy', G.t);
    ctx.restore();
    ctx.restore();

    // en-tête
    text(ctx, 'CAMPAGNE ÉLECTORALE', 24, 36, 42, '#ffe14d', { align: 'left', stroke: '#c8102e', lw: 8 });
    text(ctx, `Étape ${C.step + 1} / ${CAMP_STEPS}`, 450, 38, 28, '#fff', { align: 'left' });
    text(ctx, `Sondage : ${C.poll} %`, 640, 26, 22, '#fff', { align: 'left', font: FONT2, weight: 'bold', lw: 4 });
    drawPollBar(ctx, 640, 42, 300, C.poll, me.color);
    text(ctx, 'majorité', 640 + 300 * (41 / 60), 72, 13, '#ffe14d', { font: FONT2, lw: 3 });
    text(ctx, 'Recomptages', 1100, 22, 18, '#fff', { font: FONT2, weight: 'bold', lw: 4 });
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = i < C.lives ? '#ffe14d' : '#444';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      circle(ctx, 1080 + i * 40, 50, 12); ctx.fill(); ctx.stroke();
    }

    // cartes de choix
    const n = C.choices.length;
    const cw = n === 1 ? 700 : 600, ch = 158;
    C.choices.forEach((c, i) => {
      const x = n === 1 ? W / 2 - cw / 2 : 30 + i * (cw + 20), y = 478;
      const sel = i === C.sel;
      const opp = ROSTER_BY_ID[c.opp];
      ctx.fillStyle = sel ? '#f4efe1' : 'rgba(244,239,225,0.75)';
      roundRect(ctx, x, y, cw, ch, 14);
      ctx.fill();
      ctx.strokeStyle = sel ? '#c8102e' : '#141414';
      ctx.lineWidth = sel ? 6 : 3;
      ctx.stroke();
      // portrait de l'adversaire
      ctx.save();
      ctx.fillStyle = opp.color;
      roundRect(ctx, x + 12, y + 12, 110, ch - 24, 10);
      ctx.fill();
      ctx.beginPath(); ctx.rect(x + 12, y + 12, 110, ch - 24); ctx.clip();
      ctx.translate(x + 64, y + 74);
      ctx.scale(0.95, 0.95);
      drawHead(ctx, opp, 'angry', G.t + i * 50);
      ctx.restore();
      text(ctx, c.region.final ? 'FINALE — DÉBAT DES CHEFS' : c.region.name.toUpperCase(), x + 140, y + 30, 30, '#3a2a18', { align: 'left', stroke: false });
      text(ctx, `contre ${opp.name}`, x + 140, y + 62, 22, '#3a2a18', { align: 'left', font: FONT2, weight: 'bold', stroke: false });
      text(ctx, `${c.mod.icon}  ${c.mod.name}`, x + 140, y + 96, 22, '#c8102e', { align: 'left', font: FONT2, weight: 'bold', stroke: false });
      text(ctx, c.mod.desc, x + 140, y + 122, 17, '#3a2a18', { align: 'left', font: FONT2, stroke: false });
      const b = 2 + c.mod.bonus;
      text(ctx, `Victoire : +${b} % ou plus`, x + cw - 16, y + ch - 16, 17, '#2e7d32', { align: 'right', font: FONT2, weight: 'bold', stroke: false });
      G.clicks.push({ x, y, w: cw, h: ch, fn: () => { if (C.sel === i) { Sfx.confirm(); Campaign.launch(); } else { C.sel = i; Sfx.select(); } } });
    });
    perkChips(ctx, 30, 662, C.perks);
    text(ctx, '← → choisir  ·  Entrée : en route!  ·  Échap : abandonner', W - 24, 700, 18, '#ddd', { align: 'right', font: FONT2, lw: 4 });
  },
};

SCENES.news = {
  update() {
    const C = Campaign.C;
    C.deltaShown = lerp(C.deltaShown || 0, C.news.delta, 0.06);
    if (G.sceneT === 1) C.deltaShown = 0;
    if (G.sceneT > 40 && Input.edge('confirm')) { Sfx.confirm(); Campaign.afterNews(); }
  },
  draw(ctx) {
    const C = Campaign.C, N = C.news;
    ctx.fillStyle = '#3b2a1e';
    ctx.fillRect(0, 0, W, H);
    // tampon de bois du bureau
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let i = 0; i < 12; i++) ctx.fillRect(0, i * 64, W, 2);
    const k = ease(Math.min(1, G.sceneT / 25));
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate((1 - k) * 6 - 0.012);
    ctx.scale(0.3 + 0.7 * k, 0.3 + 0.7 * k);
    ctx.translate(-W / 2, -H / 2);
    // papier
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(98, 30, 1094, 680);
    ctx.fillStyle = '#f4efe1';
    ctx.fillRect(90, 20, 1094, 680);
    // en-tête
    text(ctx, 'La Chicane', 637, 78, 76, '#141414', { font: PAPER_FONT, weight: 'bold', stroke: false });
    ctx.fillStyle = '#141414';
    ctx.fillRect(120, 118, 1034, 3);
    ctx.fillRect(120, 146, 1034, 1);
    text(ctx, `LE QUOTIDIEN QUI PREND PARTI   ·   JOUR ${C.step * 5 + 3} DE LA CAMPAGNE   ·   ÉDITION SPÉCIALE   ·   1,25 $`, 637, 134, 15, '#141414', { font: PAPER_FONT, stroke: false });
    // manchette
    ctx.font = `bold 52px ${FONT2}`;
    const lines = wrapLines(ctx, N.head, 1010);
    lines.slice(0, 2).forEach((l, i) => text(ctx, l, 637, 190 + i * 56, 52, '#141414', { font: FONT2, weight: 'bold', stroke: false }));
    const y0 = 190 + Math.min(2, lines.length) * 56 - 20;
    text(ctx, N.sub, 637, y0 + 8, 22, '#333', { font: PAPER_FONT, weight: 'italic', stroke: false });
    // photo (sépia)
    const px = 120, py = y0 + 32, pw = 640, ph = 690 - py - 50;
    ctx.save();
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    ctx.filter = 'sepia(0.85) contrast(1.15) brightness(1.05)';
    ctx.drawImage(stageLayer(G.stage), 280, 200, 720, 520, px, py, pw, ph * 1.0);
    const sc = ph / 520;
    const won = N.result === 'win';
    const winner = won ? N.me : N.opp, loser = won ? N.opp : N.me;
    const wDef = won ? G.fighters[0].def : G.fighters[1].def, lDef = won ? G.fighters[1].def : G.fighters[0].def;
    ctx.save();
    ctx.translate(px + pw * 0.36, py + (GROUND - 200) * sc + 10);
    ctx.scale(sc * 1.25, sc * 1.25);
    drawCharacter(ctx, wDef, N.result === 'draw' ? POSES.hit() : POSES.win(G.t), N.result === 'draw' ? 'hurt' : 'happy', G.t, N.result === 'draw' ? null : wDef.winProp || null);
    ctx.restore();
    ctx.save();
    ctx.translate(px + pw * 0.78, py + (GROUND - 200) * sc + 10);
    ctx.scale(-sc * 1.25, sc * 1.25);
    if (N.result === 'draw') drawCharacter(ctx, lDef, POSES.hit(), 'hurt', G.t, null);
    else { ctx.translate(120, -38); ctx.rotate(-Math.PI / 2); drawCharacter(ctx, lDef, POSES.lying(), 'ko', G.t, null); }
    ctx.restore();
    ctx.filter = 'none';
    ctx.restore();
    void winner; void loser;
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, ph);
    ctx.font = `italic 15px ${PAPER_FONT}`;
    wrapLines(ctx, N.caption, pw).slice(0, 2).forEach((l, i) => text(ctx, l, px, py + ph + 16 + i * 18, 15, '#333', { align: 'left', font: PAPER_FONT, weight: 'italic', stroke: false }));
    // colonne sondage
    const cx = 790, cw = 364;
    ctx.fillStyle = '#141414';
    ctx.fillRect(cx, py, cw, 3);
    text(ctx, 'SONDAGE CHICANE-MÈTRE', cx + cw / 2, py + 22, 20, '#141414', { font: FONT2, weight: 'bold', stroke: false });
    const shown = Math.round(N.before + C.deltaShown);
    const others = [
      [N.me.short, shown, N.me.color],
      [N.opp.short, clamp(Math.round(30 - shown * 0.35 - (N.result === 'loss' ? -4 : 3)), 3, 40), N.opp.color],
      ['AUTRES', 0, '#999'],
    ];
    others[2][1] = Math.max(0, 100 - others[0][1] - others[1][1] - 18);
    others.forEach(([lbl, v, col], i) => {
      const yy = py + 56 + i * 44;
      text(ctx, lbl, cx, yy, 18, '#141414', { align: 'left', font: FONT2, weight: 'bold', stroke: false });
      ctx.fillStyle = col;
      ctx.fillRect(cx + 120, yy - 11, (cw - 180) * (v / 60), 22);
      text(ctx, `${v} %`, cx + cw, yy, 18, '#141414', { align: 'right', font: FONT2, weight: 'bold', stroke: false });
    });
    const d = N.delta;
    text(ctx, d > 0 ? `▲ +${d} points` : d < 0 ? `▼ ${d} points` : '= stable', cx + cw / 2, py + 200, 34, d > 0 ? '#2e7d32' : d < 0 ? '#c62828' : '#555', { font: FONT2, weight: 'bold', stroke: false });
    ctx.fillStyle = '#141414';
    ctx.fillRect(cx, py + 230, cw, 1);
    const next = N.result === 'win' ? (N.node.region.final ? 'Ce soir : la soirée électorale.' : 'Prochaine étape : une nouvelle promesse.')
      : C.lives >= 0 ? `Recomptages restants : ${C.lives}` : 'La campagne est terminée.';
    ctx.font = `bold 19px ${PAPER_FONT}`;
    wrapLines(ctx, next, cw).forEach((l, i) => text(ctx, l, cx + cw / 2, py + 258 + i * 24, 19, '#141414', { font: PAPER_FONT, weight: 'bold', stroke: false }));
    if (N.perfect) text(ctx, 'SANS FAUTE!', cx + cw / 2, py + 320, 30, '#c8102e', { stroke: false });
    ctx.restore();
    if (G.sceneT > 40 && Math.floor(G.t / 30) % 2 === 0) text(ctx, 'ENTRÉE POUR CONTINUER', W / 2, H - 4 - 14, 26, '#fff');
    G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { if (G.sceneT > 40) Campaign.afterNews(); } });
  },
};

SCENES.perk = {
  update() {
    const C = Campaign.C;
    if (Input.edge('left')) { C.perkSel = (C.perkSel + 2) % 3; Sfx.select(); }
    if (Input.edge('right')) { C.perkSel = (C.perkSel + 1) % 3; Sfx.select(); }
    if (Input.edge('confirm') && G.sceneT > 15) Campaign.choosePerk(C.perkSel);
  },
  draw(ctx) {
    const C = Campaign.C;
    drawSplitBg(ctx, G.t, 0.4);
    text(ctx, 'CHOISISSEZ UNE PROMESSE ÉLECTORALE', W / 2, 80, 50, '#ffe14d', { stroke: '#c8102e', lw: 10 });
    text(ctx, 'Elle s\'applique à tous vos prochains combats. Promis. Juré.', W / 2, 130, 24, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
    C.perkChoices.forEach((k, i) => {
      const cw = 340, ch = 330, x = W / 2 - (cw * 3 + 40) / 2 + i * (cw + 20), y = 190;
      const sel = i === C.perkSel;
      const lift = sel ? -12 + Math.sin(G.t * 0.12) * 3 : 0;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      roundRect(ctx, x + 8, y + 10, cw, ch, 18); ctx.fill();
      ctx.fillStyle = sel ? '#fff8dc' : '#e9e3cf';
      roundRect(ctx, x, y + lift, cw, ch, 18); ctx.fill();
      ctx.strokeStyle = sel ? '#c8102e' : '#141414';
      ctx.lineWidth = sel ? 7 : 4;
      ctx.stroke();
      ctx.fillStyle = sel ? '#c8102e' : '#0a4ea2';
      circle(ctx, x + cw / 2, y + 95 + lift, 62); ctx.fill();
      text(ctx, k.icon, x + cw / 2, y + 98 + lift, 64, '#fff', { stroke: false, font: FONT2, weight: 'bold' });
      ctx.font = `36px ${FONT}`;
      wrapLines(ctx, k.name.toUpperCase(), cw - 30).forEach((l, j) => text(ctx, l, x + cw / 2, y + 200 + j * 38 + lift, 36, '#141414', { stroke: false }));
      ctx.font = `bold 22px ${FONT2}`;
      wrapLines(ctx, k.desc, cw - 40).forEach((l, j) => text(ctx, l, x + cw / 2, y + 266 + j * 26 + lift, 22, '#333', { font: FONT2, weight: 'bold', stroke: false }));
      const have = C.perks[k.id] || 0;
      if (have) text(ctx, `Déjà ×${have} — cumulable!`, x + cw / 2, y + ch - 18 + lift, 17, '#2e7d32', { font: FONT2, weight: 'bold', stroke: false });
      G.clicks.push({ x, y, w: cw, h: ch, fn: () => Campaign.choosePerk(i) });
    });
    perkChips(ctx, 40, 600, C.perks);
    text(ctx, '← → choisir  ·  Entrée : promettre', W / 2, 680, 24, '#fff', { font: FONT2, lw: 5 });
  },
};

SCENES.campEnd = {
  update() {
    const C = Campaign.C;
    if (G.sceneT === 200) Voice.ann(C.finalTier.id, C.finalTier.name);
    if (G.sceneT > 220 && Input.edge('confirm')) { Sfx.confirm(); G.go('title'); }
  },
  draw(ctx) {
    const C = Campaign.C;
    const me = applySkin(ROSTER_BY_ID[C.player], C.skin);
    const seats = C.finalSeats, tier = C.finalTier;
    // plateau de télé
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b1640');
    g.addColorStop(1, '#1c2f72');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 16; i++) ctx.fillRect(((i * 120 + G.t * 2) % (W + 120)) - 60, 0, 40, H);
    text(ctx, 'SOIRÉE ÉLECTORALE', W / 2, 52, 58, '#fff', { stroke: '#c8102e', lw: 10 });
    ctx.fillStyle = '#c8102e';
    roundRect(ctx, 40, 32, 130, 34, 6); ctx.fill();
    text(ctx, '● EN DIRECT', 105, 50, 20, '#fff', { stroke: false });
    // hémicycle de 125 sièges
    const k = clamp((G.sceneT - 20) / 170, 0, 1);
    const shown = Math.round(seats * ease(k));
    const cx = 420, cy = 520;
    let idx = 0;
    const rows = [[20, 150], [24, 185], [26, 220], [27, 255], [28, 290]];
    const coords = [];
    for (const [n, r] of rows) for (let i = 0; i < n; i++) coords.push([Math.PI * (1 - i / (n - 1)), r]);
    coords.sort((a, b) => b[0] - a[0]);
    for (const [a, r] of coords) {
      const x = cx + Math.cos(a) * r, y = cy - Math.sin(a) * r;
      ctx.fillStyle = idx < shown ? me.color : '#3b4a7a';
      circle(ctx, x, y, 11); ctx.fill();
      ctx.strokeStyle = '#0b1640'; ctx.lineWidth = 2; ctx.stroke();
      idx++;
    }
    text(ctx, String(shown), cx, cy - 40, 96, '#fff', { stroke: me.color, lw: 10 });
    text(ctx, 'sièges sur 125', cx, cy + 10, 28, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
    text(ctx, '63 pour une majorité', cx, cy + 46, 20, '#ffe14d', { font: FONT2, lw: 4 });
    // candidat
    ctx.save();
    ctx.translate(1000, 690);
    ctx.scale(1.25, 1.25);
    const majority = tier.id === 'majoritaire';
    drawCharacter(ctx, me, k >= 1 && (majority || tier.id === 'minoritaire') ? POSES.win(G.t) : POSES.idle(G.t), k >= 1 ? (majority ? 'happy' : tier.id === 'tiers' ? 'hurt' : 'neutral') : 'neutral', G.t, k >= 1 && majority ? me.winProp || null : null);
    ctx.restore();
    text(ctx, `Sondage final : ${C.poll} %`, 1000, 118, 26, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
    perkChips(ctx, 780, 160, C.perks, W - 20);
    if (G.sceneT > 200) {
      const s = 54 + Math.sin(G.t * 0.15) * 3;
      text(ctx, tier.name, W / 2, 620, s, tier.col, { lw: 10 });
      text(ctx, tier.sub, W / 2, 668, 22, '#fff', { font: FONT2, weight: 'bold', lw: 5 });
      if (majority) {
        for (let i = 0; i < 60; i++) {
          const x = (i * 157 + Math.sin(G.t * 0.03 + i) * 40) % W, y = (i * 71 + G.t * (1 + (i % 4))) % H;
          ctx.fillStyle = ['#ffe14d', '#fff', '#ff4040', '#3aa0ff'][i % 4];
          ctx.fillRect(x, y, 8, 12);
        }
      }
      drawUnlocks(ctx, 1000, 250);
      if (Math.floor(G.t / 30) % 2 === 0) text(ctx, 'ENTRÉE POUR TERMINER', W / 2, 706, 20, '#ddd', { font: FONT2, lw: 4 });
    }
    G.clicks.push({ x: 0, y: 0, w: W, h: H, fn: () => { if (G.sceneT > 220) G.go('title'); } });
  },
};
