'use strict';
// ---------- Les combattants ----------
// Caricatures humoristiques. Les « coups spéciaux » font référence à des slogans,
// promesses et débats publics bien connus. C'est une parodie, rien de plus!
const ROSTER = [
  {
    id: 'legault', name: 'François Legault', short: 'LEGAULT', party: 'CAQ', level: 'QC',
    title: 'Le Comptable', color: '#1fb5e0',
    look: { skin: '#f0c4a0', suit: '#1e2b48', pants: '#19233b', tie: '#1fb5e0', shirt: '#ffffff', hair: 'bald', hairColor: '#bdb7ae' },
    spd: 0.95, pow: 1.06, stage: 'salonbleu',
    special: { name: 'Le 3e lien!', type: 'wave', kind: 'tunnel', dmg: 70, speed: 7.5 },
    super: { name: 'Méga-batterie!', type: 'projectile', kind: 'battery', dmg: 250, hits: 3, speed: 8.5 },
    intro: 'Fiez-vous à moi : je suis comptable.',
    win: 'Le 3e lien? C\'était mon poing depuis le début!',
  },
  {
    id: 'pspp', name: 'Paul St-Pierre Plamondon', short: 'PSPP', party: 'PQ', level: 'QC',
    title: 'Le Référendaire', color: '#2c64c8',
    look: { skin: '#eebf9c', suit: '#1b2a55', pants: '#141f40', tie: '#2c64c8', shirt: '#ffffff', hair: 'short', hairColor: '#3b2a1f' },
    spd: 1.05, pow: 1.0, stage: 'vieuxquebec',
    special: { name: 'Bulletin du OUI!', type: 'projectile', kind: 'ballot', dmg: 65, speed: 10.5 },
    super: { name: 'Pays!', type: 'rain', kind: 'fleur', dmg: 270, count: 9 },
    intro: 'Ce combat, c\'est un mandat clair.',
    win: 'Prochaine étape : le référendum!',
  },
  {
    id: 'ghazal', name: 'Ruba Ghazal', short: 'GHAZAL', party: 'QS', level: 'QC',
    title: 'La Militante', color: '#ff6a13',
    look: { skin: '#d9a47f', suit: '#2a2a33', pants: '#22222a', tie: null, top: '#ff6a13', shirt: '#ff6a13', hair: 'long', hairColor: '#1d1512', lips: '#b8323a' },
    spd: 1.12, pow: 0.95, stage: 'pontjc',
    special: { name: 'Pancarte!', type: 'dash', prop: 'sign', dmg: 85, speed: 13, dur: 16 },
    super: { name: 'Grève générale!', type: 'wave', kind: 'signs', dmg: 250, hits: 5, speed: 6.5 },
    intro: 'Le pouvoir au peuple, les claques aux puissants!',
    win: 'Ça, c\'est de la redistribution!',
  },
  {
    id: 'duhaime', name: 'Éric Duhaime', short: 'DUHAIME', party: 'PCQ', level: 'QC',
    title: 'La Voix des ondes', color: '#2a3f8f',
    look: { skin: '#efc2a0', suit: '#262d3d', pants: '#1c2230', tie: null, shirt: '#dfe7f5', hair: 'shaved', hairColor: '#6d655d', stubble: true },
    spd: 1.0, pow: 1.05, stage: 'pontjc',
    special: { name: 'En ondes!', type: 'projectile', kind: 'radio', dmg: 64, hits: 2, speed: 8.5, prop: 'mic' },
    super: { name: 'LIBERTÉ!', type: 'dash', prop: 'mic', dmg: 240, hits: 4, speed: 16, dur: 28 },
    intro: 'En ondes dans 3, 2, 1...',
    win: 'Libérez le Québec... de toi!',
  },
  {
    id: 'carney', name: 'Mark Carney', short: 'CARNEY', party: 'PLC', level: 'CA',
    title: 'Le Banquier', color: '#d71920',
    look: { skin: '#f2c9ad', suit: '#1d2740', pants: '#171f33', tie: '#d71920', shirt: '#ffffff', hair: 'recede', hairColor: '#9a958f' },
    spd: 0.95, pow: 1.08, stage: 'communes',
    special: { name: 'Taux directeur!', type: 'projectile', kind: 'rate', dmg: 70, speed: 9.5 },
    super: { name: 'Coudes levés!', type: 'dash', prop: 'elbow', dmg: 260, hits: 3, speed: 18, dur: 24 },
    intro: 'J\'ai un plan. Il a des graphiques.',
    win: 'Coudes levés, taux baissés, adversaire couché.',
  },
  {
    id: 'poilievre', name: 'Pierre Poilievre', short: 'POILIEVRE', party: 'PCC', level: 'CA',
    title: 'Le Hache-Taxe', color: '#1a4fa0',
    look: { skin: '#f0c6a6', suit: '#1a2338', pants: '#151c2d', tie: '#1a4fa0', shirt: '#ffffff', hair: 'slick', hairColor: '#2c2119' },
    spd: 1.08, pow: 1.0, stage: 'colline',
    special: { name: 'Hache la taxe!', type: 'projectile', kind: 'axe', dmg: 75, speed: 11 },
    super: { name: 'AXE THE TAX!', type: 'projectile', kind: 'bigaxe', dmg: 260, hits: 4, speed: 10 },
    intro: 'Gros bon sens, gros coups de poing!',
    win: 'Axe the tax... and you!',
  },
  {
    id: 'blanchet', name: 'Yves-François Blanchet', short: 'BLANCHET', party: 'BQ', level: 'CA',
    title: 'Le Bloqueur', color: '#2fb4d4',
    look: { skin: '#f2c8ab', suit: '#30343d', pants: '#25282f', tie: '#2fb4d4', shirt: '#ffffff', hair: 'swept', hairColor: '#e4e2dc', glasses: true },
    spd: 0.9, pow: 1.12, stage: 'communes',
    special: { name: 'Fleur de lys!', type: 'projectile', kind: 'fleur', dmg: 70, speed: 9.5 },
    super: { name: 'LE BLOC!', type: 'drop', kind: 'bloc', dmg: 280 },
    intro: 'Je suis ici pour bloquer. Tout.',
    win: 'Ce combat est bloqué. Point final.',
  },
  {
    id: 'singh', name: 'Jagmeet Singh', short: 'SINGH', party: 'NPD', level: 'CA',
    title: 'Le Jiu-jitsuka', color: '#f37021',
    look: { skin: '#b98058', suit: '#5b2a6e', pants: '#2b1d36', tie: '#f37021', shirt: '#ffffff', hair: 'turban', hairColor: '#e0457f', beard: '#151111' },
    spd: 1.15, pow: 0.95, stage: 'colline',
    special: { name: 'Genou volant!', type: 'rising', dmg: 95 },
    super: { name: 'Assurance dentaire!', type: 'projectile', kind: 'tooth', dmg: 250, hits: 3, speed: 9 },
    intro: 'Un peu de jiu-jitsu parlementaire?',
    win: 'Ton K.O. est couvert par l\'assurance dentaire!',
  },
  {
    id: 'trudeau', name: 'Justin Trudeau', short: 'TRUDEAU', party: 'PLC', level: 'CA',
    title: 'L\'Ex', color: '#e2343b',
    look: { skin: '#e9bc98', suit: '#22355e', pants: '#1a2a4a', tie: '#e2343b', shirt: '#ffffff', hair: 'wavy', hairColor: '#3a2a20', socks: true },
    spd: 1.1, pow: 0.95, stage: 'colline',
    special: { name: 'Bas colorés!', type: 'projectile', kind: 'sock', dmg: 60, speed: 11.5 },
    super: { name: 'Voies ensoleillées!', type: 'beam', kind: 'sun', dmg: 270, hits: 6, dur: 54 },
    intro: 'Parce qu\'on est en 2026!',
    win: 'Les voies ensoleillées... pour moi!',
  },
];
const ROSTER_BY_ID = Object.fromEntries(ROSTER.map((c) => [c.id, c]));
const PARTY_NAMES = {
  CAQ: 'Coalition Avenir Québec', PQ: 'Parti Québécois', QS: 'Québec solidaire', PCQ: 'Parti conservateur du Québec',
  PLC: 'Parti libéral du Canada', PCC: 'Parti conservateur du Canada', BQ: 'Bloc Québécois', NPD: 'Nouveau Parti démocratique',
};

// ---------- Dessin de la tête ----------
// Repère local : centre de la tête (0,0), regard vers +x.
function drawHead(ctx, c, expr = 'neutral', t = 0) {
  const L = c.look;
  const OUT = '#141414';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Cheveux longs (derrière)
  if (L.hair === 'long') {
    ctx.fillStyle = L.hairColor;
    ctx.beginPath();
    ctx.moveTo(-10, -40);
    ctx.bezierCurveTo(-58, -40, -52, 40, -46, 70);
    ctx.quadraticCurveTo(-20, 78, 8, 64);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Oreille
  ctx.fillStyle = L.skin;
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ellipse(ctx, -24, 4, 8, 11);
  ctx.fill();
  ctx.stroke();

  // Visage
  ctx.beginPath();
  ctx.moveTo(-30, -18);
  ctx.bezierCurveTo(-34, -52, 30, -56, 34, -16);
  ctx.bezierCurveTo(38, 2, 40, 8, 36, 22);
  ctx.bezierCurveTo(32, 40, 10, 48, -4, 44);
  ctx.bezierCurveTo(-22, 40, -30, 22, -30, -18);
  ctx.closePath();
  ctx.fillStyle = L.skin;
  ctx.fill();
  ctx.stroke();
  // ombre de mâchoire
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ellipse(ctx, -16, 26, 22, 26);
  ctx.fill();
  if (L.stubble) {
    ctx.fillStyle = 'rgba(70,60,55,0.28)';
    ellipse(ctx, 10, 34, 34, 18);
    ctx.fill();
  }
  ctx.restore();

  // Barbe (Singh)
  if (L.beard) {
    ctx.fillStyle = L.beard;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.bezierCurveTo(-22, 30, -10, 62, 12, 60);
    ctx.bezierCurveTo(30, 58, 40, 40, 38, 18);
    ctx.lineTo(30, 20);
    ctx.bezierCurveTo(26, 30, 10, 30, 6, 22);
    ctx.lineTo(-10, 14);
    ctx.closePath();
    ctx.fill();
    // moustache
    ctx.beginPath();
    ctx.moveTo(8, 21);
    ctx.quadraticCurveTo(24, 12, 38, 20);
    ctx.quadraticCurveTo(24, 22, 8, 25);
    ctx.fill();
  }

  // Yeux
  const angry = expr === 'angry', hurt = expr === 'hurt', ko = expr === 'ko', happy = expr === 'happy';
  const blink = !ko && !hurt && Math.floor(t / 4) % 45 === 0;
  for (const [ex, rx] of [[6, 6], [24, 5]]) {
    if (ko) {
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ex - 5, -9); ctx.lineTo(ex + 5, 1);
      ctx.moveTo(ex + 5, -9); ctx.lineTo(ex - 5, 1);
      ctx.stroke();
    } else if (hurt || blink) {
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ex - 5, -6); ctx.lineTo(ex + 4, -3); ctx.lineTo(ex - 5, 0);
      ctx.stroke();
    } else if (happy) {
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ex, -2, rx, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#fff';
      ellipse(ctx, ex, -4, rx, 7);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#2a1d14';
      circle(ctx, ex + 2, -3, 3);
      ctx.fill();
    }
  }
  // Lunettes
  if (L.glasses) {
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -3, -12, 18, 15, 4); ctx.stroke();
    roundRect(ctx, 17, -12, 15, 15, 4); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15, -6); ctx.lineTo(17, -6);
    ctx.moveTo(-3, -7); ctx.lineTo(-22, -4);
    ctx.stroke();
  }
  // Sourcils
  ctx.strokeStyle = L.hair === 'bald' || L.hair === 'shaved' ? shade(L.hairColor, -0.35) : L.hair === 'turban' ? L.beard : L.hairColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (angry) {
    ctx.moveTo(0, -19); ctx.lineTo(12, -13);
    ctx.moveTo(19, -13); ctx.lineTo(30, -18);
  } else if (hurt || ko) {
    ctx.moveTo(0, -14); ctx.lineTo(12, -19);
    ctx.moveTo(19, -19); ctx.lineTo(30, -14);
  } else {
    ctx.moveTo(0, -16); ctx.lineTo(12, -18);
    ctx.moveTo(19, -18); ctx.lineTo(30, -16);
  }
  ctx.stroke();

  // Nez
  ctx.fillStyle = shade(L.skin, -0.06);
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(30, -4);
  ctx.quadraticCurveTo(44, 10, 36, 14);
  ctx.quadraticCurveTo(31, 15, 28, 12);
  ctx.fill();
  ctx.stroke();

  // Bouche
  ctx.lineWidth = 3;
  ctx.strokeStyle = OUT;
  const mx = 20, my = 27;
  if (happy) {
    ctx.fillStyle = '#5a1a1a';
    ctx.beginPath();
    ctx.moveTo(mx - 12, my - 3);
    ctx.quadraticCurveTo(mx + 2, my + 14, mx + 14, my - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillRect(mx - 8, my - 3, 18, 4);
  } else if (angry) {
    ctx.fillStyle = '#fff';
    roundRect(ctx, mx - 10, my - 4, 22, 9, 3);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx - 10, my); ctx.lineTo(mx + 12, my);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (hurt || ko) {
    ctx.fillStyle = '#5a1a1a';
    ellipse(ctx, mx, my + 2, 7, 9);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(mx - 9, my);
    ctx.quadraticCurveTo(mx + 2, my + 4, mx + 12, my - 1);
    ctx.stroke();
  }
  if (L.lips && !happy && !hurt && !ko && !angry) {
    ctx.strokeStyle = L.lips;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mx - 8, my);
    ctx.quadraticCurveTo(mx + 2, my + 4, mx + 11, my - 1);
    ctx.stroke();
  }

  // Cheveux / couvre-chef
  drawHair(ctx, L, t);
}

function drawHair(ctx, L, t) {
  const OUT = '#141414';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ctx.fillStyle = L.hairColor;
  switch (L.hair) {
    case 'bald': {
      // crâne luisant + couronne grise
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ellipse(ctx, 4, -36, 13, 6, -0.2);
      ctx.fill();
      ctx.fillStyle = L.hairColor;
      ctx.beginPath();
      ctx.moveTo(-31, -10);
      ctx.bezierCurveTo(-36, -30, -26, -40, -14, -42);
      ctx.bezierCurveTo(-20, -30, -18, -18, -16, -8);
      ctx.quadraticCurveTo(-22, 2, -31, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(26, -34);
      ctx.quadraticCurveTo(32, -28, 33, -20);
      ctx.lineWidth = 4;
      ctx.strokeStyle = L.hairColor;
      ctx.stroke();
      break;
    }
    case 'shaved': {
      ctx.fillStyle = 'rgba(80,72,66,0.35)';
      ctx.beginPath();
      ctx.moveTo(-30, -6);
      ctx.bezierCurveTo(-34, -52, 30, -56, 33, -22);
      ctx.quadraticCurveTo(14, -34, -14, -30);
      ctx.quadraticCurveTo(-22, -14, -20, -4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ellipse(ctx, 2, -40, 12, 5, -0.2);
      ctx.fill();
      break;
    }
    case 'short': {
      ctx.beginPath();
      ctx.moveTo(-32, -4);
      ctx.bezierCurveTo(-40, -50, 10, -66, 34, -30);
      ctx.quadraticCurveTo(36, -22, 31, -20);
      ctx.quadraticCurveTo(14, -34, -6, -32);
      ctx.quadraticCurveTo(-18, -22, -18, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'recede': {
      ctx.beginPath();
      ctx.moveTo(-32, -2);
      ctx.bezierCurveTo(-38, -46, -8, -60, 22, -46);
      ctx.quadraticCurveTo(10, -42, 2, -40);
      ctx.quadraticCurveTo(-16, -30, -18, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = shade(L.hairColor, -0.25);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-22, -40); ctx.quadraticCurveTo(-4, -50, 14, -46);
      ctx.moveTo(-26, -30); ctx.quadraticCurveTo(-12, -42, 4, -42);
      ctx.stroke();
      break;
    }
    case 'slick': {
      ctx.beginPath();
      ctx.moveTo(-32, -2);
      ctx.bezierCurveTo(-42, -58, 20, -72, 38, -30);
      ctx.quadraticCurveTo(38, -22, 32, -22);
      ctx.quadraticCurveTo(20, -40, 4, -36);
      ctx.quadraticCurveTo(-16, -28, -18, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -48); ctx.quadraticCurveTo(10, -58, 30, -36);
      ctx.stroke();
      break;
    }
    case 'swept': {
      ctx.beginPath();
      ctx.moveTo(-28, 14);
      ctx.bezierCurveTo(-48, -10, -40, -58, 0, -60);
      ctx.bezierCurveTo(26, -60, 40, -42, 36, -26);
      ctx.quadraticCurveTo(22, -40, 2, -38);
      ctx.quadraticCurveTo(-14, -28, -16, -4);
      ctx.quadraticCurveTo(-20, 6, -28, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-30, -20); ctx.quadraticCurveTo(-6, -54, 28, -44);
      ctx.moveTo(-34, -6); ctx.quadraticCurveTo(-16, -40, 10, -46);
      ctx.stroke();
      break;
    }
    case 'wavy': {
      ctx.beginPath();
      ctx.moveTo(-32, 2);
      ctx.bezierCurveTo(-48, -40, -24, -74, 10, -66);
      ctx.bezierCurveTo(36, -62, 48, -42, 40, -26);
      ctx.quadraticCurveTo(30, -34, 26, -26);
      ctx.quadraticCurveTo(14, -40, 0, -34);
      ctx.quadraticCurveTo(-16, -28, -18, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(200,190,180,0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-30, -14); ctx.quadraticCurveTo(-30, -40, -14, -52);
      ctx.moveTo(-6, -58); ctx.quadraticCurveTo(16, -64, 32, -48);
      ctx.stroke();
      break;
    }
    case 'long': {
      ctx.beginPath();
      ctx.moveTo(-32, 8);
      ctx.bezierCurveTo(-44, -44, 0, -68, 30, -40);
      ctx.quadraticCurveTo(40, -28, 36, -16);
      ctx.quadraticCurveTo(18, -36, -2, -30);
      ctx.quadraticCurveTo(-16, -20, -18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-20, -44); ctx.quadraticCurveTo(6, -56, 26, -38);
      ctx.stroke();
      break;
    }
    case 'turban': {
      const c = L.hairColor;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(-32, -6);
      ctx.bezierCurveTo(-44, -60, 8, -82, 34, -48);
      ctx.quadraticCurveTo(40, -36, 34, -22);
      ctx.quadraticCurveTo(14, -32, -18, -18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = shade(c, -0.3);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-26, -24); ctx.quadraticCurveTo(0, -48, 32, -30);
      ctx.moveTo(-30, -40); ctx.quadraticCurveTo(-2, -62, 28, -46);
      ctx.moveTo(-20, -58); ctx.quadraticCurveTo(0, -70, 18, -62);
      ctx.stroke();
      break;
    }
  }
}

// ---------- Corps ----------
function ik(ox, oy, tx, ty, l1, l2, bend) {
  let dx = tx - ox, dy = ty - oy;
  let d = Math.hypot(dx, dy);
  const max = l1 + l2 - 0.5;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  if (d < 1) d = 1;
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const ang = Math.atan2(dy, dx) + bend * a;
  return { jx: ox + Math.cos(ang) * l1, jy: oy + Math.sin(ang) * l1, ex: ox + dx, ey: oy + dy };
}
function seg(ctx, x1, y1, x2, y2, w, color) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = w + 6;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

// Dessine le personnage selon une pose (coordonnées locales, regard +x, pieds à y=0)
function drawCharacter(ctx, c, P, expr, t, prop) {
  const L = c.look;
  const lean = P.lean || 0;
  const ux = Math.sin(lean), uy = -Math.cos(lean);
  const px = Math.cos(lean), py = Math.sin(lean);
  const TL = 74;
  const hx = P.hx, hy = P.hy;
  const nx = hx + ux * TL, ny = hy + uy * TL;
  const fs = { x: nx - ux * 12 + px * 9, y: ny - uy * 12 + py * 9 };
  const bs = { x: nx - ux * 12 - px * 11, y: ny - uy * 12 - py * 11 };

  const drawArm = (s, hand, back) => {
    const col = back ? shade(L.suit, -0.25) : L.suit;
    const k = ik(s.x, s.y, hand[0], hand[1], 38, 36, 1);
    seg(ctx, s.x, s.y, k.jx, k.jy, 17, col);
    seg(ctx, k.jx, k.jy, k.ex, k.ey, 15, col);
    // poing
    ctx.fillStyle = back ? shade(L.skin, -0.12) : L.skin;
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 3;
    circle(ctx, k.ex, k.ey, 10);
    ctx.fill();
    ctx.stroke();
    return k;
  };
  const drawLeg = (hip, foot, back) => {
    const col = back ? shade(L.pants, -0.25) : L.pants;
    const k = ik(hip.x, hip.y, foot[0], foot[1], 50, 50, -1);
    seg(ctx, hip.x, hip.y, k.jx, k.jy, 21, col);
    seg(ctx, k.jx, k.jy, k.ex, k.ey, 19, col);
    const ang = Math.atan2(k.ey - k.jy, k.ex - k.jx) - Math.PI / 2;
    if (L.socks) {
      // bas colorés à rayures
      ctx.save();
      ctx.translate(k.ex, k.ey);
      ctx.rotate(ang);
      const cols = ['#ff3b6b', '#ffd23f', '#3bceac', '#5b5bff'];
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = cols[(i + (back ? 1 : 0)) % 4];
        ctx.fillRect(-9, -14 + i * 3.5, 18, 3.5);
      }
      ctx.restore();
    }
    ctx.save();
    ctx.translate(k.ex, k.ey);
    ctx.rotate(ang);
    ctx.fillStyle = back ? '#0b0b0b' : '#1b1b1b';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    roundRect(ctx, -11, -4, 36, 13, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(2, -2, 16, 3);
    ctx.restore();
  };

  // bras arrière
  drawArm(bs, P.bH, true);
  // jambes
  drawLeg({ x: hx - px * 8, y: hy - py * 8 }, P.bF, true);
  drawLeg({ x: hx + px * 8, y: hy + py * 8 }, P.fF, false);

  // Torse (veston)
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(lean);
  ctx.fillStyle = L.suit;
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-21, 6);
  ctx.lineTo(23, 6);
  ctx.quadraticCurveTo(28, -40, 26, -66);
  ctx.quadraticCurveTo(20, -78, 0, -78);
  ctx.quadraticCurveTo(-24, -78, -26, -64);
  ctx.quadraticCurveTo(-28, -30, -21, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // chemise / haut
  ctx.fillStyle = L.top || L.shirt;
  ctx.beginPath();
  ctx.moveTo(-2, -76);
  ctx.lineTo(22, -76);
  ctx.lineTo(12, -38);
  ctx.closePath();
  ctx.fill();
  if (L.tie) {
    ctx.fillStyle = L.tie;
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(7, -74); ctx.lineTo(15, -74); ctx.lineTo(13, -68);
    ctx.lineTo(17, -40); ctx.lineTo(12, -34); ctx.lineTo(8, -40); ctx.lineTo(10, -68);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (!L.top) {
    // col ouvert
    ctx.strokeStyle = '#9aa3b5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(2, -76); ctx.lineTo(10, -62); ctx.lineTo(20, -76);
    ctx.stroke();
  } else {
    // collier
    ctx.strokeStyle = '#e8c35a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(10, -80, 10, 0.3, Math.PI - 0.3);
    ctx.stroke();
  }
  // revers
  ctx.strokeStyle = shade(L.suit, -0.45);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-3, -74); ctx.lineTo(10, -34);
  ctx.moveTo(24, -72); ctx.lineTo(12, -36);
  ctx.stroke();
  // boutons
  ctx.fillStyle = shade(L.suit, -0.5);
  circle(ctx, 14, -26, 2.5); ctx.fill();
  circle(ctx, 15, -14, 2.5); ctx.fill();
  // épinglette du parti
  ctx.fillStyle = c.color;
  circle(ctx, -8, -56, 4); ctx.fill();
  ctx.restore();

  // Cou + tête
  const headX = nx + ux * 34 + (P.headX || 0), headY = ny + uy * 34 + (P.headY || 0);
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(nx + 4, ny); ctx.lineTo(headX - 4, headY + 26); ctx.stroke();
  ctx.strokeStyle = L.skin;
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(nx + 4, ny); ctx.lineTo(headX - 4, headY + 26); ctx.stroke();
  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(lean * 0.5 + (P.tilt || 0));
  drawHead(ctx, c, expr, t);
  ctx.restore();

  // bras avant (+ accessoire)
  const k = drawArm(fs, P.fH, false);
  if (prop) drawProp(ctx, prop, k.ex, k.ey, Math.atan2(k.ey - k.jy, k.ex - k.jx), c);
}

function drawProp(ctx, prop, x, y, ang, c) {
  ctx.save();
  ctx.translate(x, y);
  if (prop === 'sign') {
    ctx.strokeStyle = '#7a5130';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, -70); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 3;
    ctx.fillRect(-46, -128, 92, 60);
    ctx.strokeRect(-46, -128, 92, 60);
    text(ctx, 'LOGEMENT', 0, -106, 19, c.color, { stroke: false });
    text(ctx, 'POUR TOUS!', 0, -84, 17, '#141414', { stroke: false });
  } else if (prop === 'mic') {
    ctx.rotate(ang);
    ctx.fillStyle = '#222';
    ctx.fillRect(4, -5, 28, 10);
    ctx.fillStyle = '#9aa0a8';
    circle(ctx, 38, 0, 10); ctx.fill();
    ctx.strokeStyle = '#141414'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = '#666';
    ctx.beginPath(); ctx.moveTo(32, -4); ctx.lineTo(44, 4); ctx.moveTo(32, 4); ctx.lineTo(44, -4); ctx.stroke();
  } else if (prop === 'elbow') {
    ctx.fillStyle = 'rgba(255,60,60,0.35)';
    circle(ctx, 0, 0, 30); ctx.fill();
  }
  ctx.restore();
}

// ---------- Projectiles ----------
function drawProjectileShape(ctx, p, t) {
  ctx.save();
  ctx.translate(p.x, p.y);
  const dir = p.dir || (p.vx < 0 ? -1 : 1);
  switch (p.kind) {
    case 'tunnel': {
      ctx.scale(dir, 1);
      // poussière
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(150,130,100,${0.5 - i * 0.08})`;
        circle(ctx, -55 - i * 16, 18 - (i % 2) * 6, 14 - i);
        ctx.fill();
      }
      ctx.fillStyle = '#6f7680';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-50, 25); ctx.lineTo(-50, -5);
      ctx.quadraticCurveTo(0, -40, 50, -5);
      ctx.lineTo(50, 25); ctx.lineTo(28, 25);
      ctx.quadraticCurveTo(0, -12, -28, 25);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(-46, -14, 92, 4);
      text(ctx, '3e LIEN', 0, -32, 22, '#ffd23f');
      break;
    }
    case 'battery': {
      const s = 1 + Math.sin(t * 0.4) * 0.04;
      ctx.scale(dir * s, s);
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(120,255,140,${0.5 + Math.random() * 0.4})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        let ax = rand(-70, 70), ay = rand(-45, 45);
        ctx.moveTo(ax, ay);
        for (let j = 0; j < 3; j++) { ax += rand(-25, 25); ay += rand(-25, 25); ctx.lineTo(ax, ay); }
        ctx.stroke();
      }
      ctx.fillStyle = '#2ecc71';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 4;
      roundRect(ctx, -64, -32, 120, 64, 10);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ccc';
      ctx.fillRect(56, -14, 12, 28);
      ctx.strokeRect(56, -14, 12, 28);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-64, -32, 34, 64);
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.moveTo(4, -26); ctx.lineTo(-14, 4); ctx.lineTo(0, 4); ctx.lineTo(-6, 28); ctx.lineTo(18, -6); ctx.lineTo(4, -6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      text(ctx, 'BATTERIE', 4, 44, 18, '#ffe14d');
      break;
    }
    case 'ballot': {
      ctx.rotate(Math.sin(t * 0.3) * 0.25);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      ctx.fillRect(-34, -24, 68, 48);
      ctx.strokeRect(-34, -24, 68, 48);
      ctx.strokeRect(-26, -12, 22, 22);
      ctx.strokeStyle = '#0a4ea2';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-24, -10); ctx.lineTo(-6, 8); ctx.moveTo(-6, -10); ctx.lineTo(-24, 8); ctx.stroke();
      text(ctx, 'OUI', 14, 0, 24, '#0a4ea2', { stroke: false });
      break;
    }
    case 'fleur': {
      ctx.rotate(Math.sin(t * 0.25) * 0.3);
      const s = p.w * 0.45;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0a4ea2';
      ctx.lineWidth = 6;
      fleurPath(ctx, s);
      ctx.stroke();
      ctx.fill();
      break;
    }
    case 'radio': {
      ctx.scale(dir, 1);
      for (let i = 0; i < 4; i++) {
        const r = 14 + i * 12 + ((t * 2) % 12);
        ctx.strokeStyle = `rgba(255,${200 - i * 30},80,${1 - i * 0.2})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(-30, 0, r, -0.9, 0.9);
        ctx.stroke();
      }
      ctx.fillStyle = '#e02020';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 2;
      roundRect(ctx, -30, -50, 64, 22, 5);
      ctx.fill(); ctx.stroke();
      text(ctx, 'EN ONDES', 2, -39, 14, '#fff', { stroke: false });
      break;
    }
    case 'signs': {
      ctx.scale(dir, 1);
      const labels = ['GRÈVE!', 'LOGEMENT!', 'SOLIDARITÉ!'];
      for (let i = 0; i < 3; i++) {
        const ox = -60 + i * 60, bob = Math.sin(t * 0.4 + i * 2) * 8;
        ctx.strokeStyle = '#7a5130';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(ox, 75); ctx.lineTo(ox, -10 + bob); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3;
        ctx.fillRect(ox - 48, -60 + bob, 96, 52);
        ctx.strokeRect(ox - 48, -60 + bob, 96, 52);
        text(ctx, labels[i], ox, -34 + bob, 18, '#ff6a13', { stroke: false });
      }
      // foule (silhouettes)
      ctx.fillStyle = 'rgba(40,20,10,0.75)';
      for (let i = 0; i < 6; i++) {
        const ox = -100 + i * 40, bob = Math.abs(Math.sin(t * 0.3 + i)) * 6;
        circle(ctx, ox, 30 - bob, 13); ctx.fill();
        roundRect(ctx, ox - 15, 42 - bob, 30, 40, 8); ctx.fill();
      }
      break;
    }
    case 'rate': {
      ctx.scale(dir, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      roundRect(ctx, -40, -30, 80, 60, 6);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#d71920';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-30, -18); ctx.lineTo(-12, -4); ctx.lineTo(0, -12); ctx.lineTo(26, 16);
      ctx.stroke();
      ctx.fillStyle = '#d71920';
      ctx.beginPath(); ctx.moveTo(32, 22); ctx.lineTo(16, 18); ctx.lineTo(28, 6); ctx.closePath(); ctx.fill();
      text(ctx, '-0,25 %', 0, -44, 20, '#ffe14d');
      break;
    }
    case 'axe':
    case 'bigaxe': {
      const s = p.kind === 'bigaxe' ? 2.6 : 1;
      if (p.kind === 'bigaxe') {
        ctx.fillStyle = 'rgba(80,160,255,0.25)';
        circle(ctx, 0, 0, 90); ctx.fill();
      }
      ctx.rotate(p.rot * dir);
      ctx.scale(s, s);
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3 / s * 1.5;
      ctx.fillStyle = '#8a5a2b';
      roundRect(ctx, -4, -26, 8, 52, 3);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c9d1da';
      ctx.beginPath();
      ctx.moveTo(2, -24); ctx.quadraticCurveTo(28, -26, 26, -6);
      ctx.quadraticCurveTo(18, -8, 2, -8);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.kind === 'bigaxe') text(ctx, 'AXE THE TAX!', 0, -100, 30, '#5fa8ff');
      break;
    }
    case 'bloc': {
      // ombre d'avertissement
      ctx.restore();
      ctx.save();
      const a = clamp((p.y + 200) / (GROUND), 0.15, 0.6);
      ctx.fillStyle = `rgba(0,0,0,${a})`;
      ellipse(ctx, p.x, GROUND + 4, p.w * 0.55 * a * 1.6, 14);
      ctx.fill();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#8e8e8a';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 5;
      ctx.fillRect(-p.w / 2, -p.hh / 2, p.w, p.hh);
      ctx.strokeRect(-p.w / 2, -p.hh / 2, p.w, p.hh);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-60, -80); ctx.lineTo(-30, -40); ctx.lineTo(-44, 10);
      ctx.moveTo(50, 70); ctx.lineTo(30, 30); ctx.lineTo(56, -6);
      ctx.stroke();
      text(ctx, 'BLOC', 0, 0, 56, '#2fb4d4');
      break;
    }
    case 'sock': {
      ctx.rotate(p.rot);
      const cols = ['#ff3b6b', '#ffd23f', '#3bceac', '#5b5bff'];
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -26); ctx.lineTo(10, -26); ctx.lineTo(10, 6);
      ctx.quadraticCurveTo(30, 6, 30, 18); ctx.quadraticCurveTo(30, 28, 10, 28);
      ctx.lineTo(-4, 28); ctx.quadraticCurveTo(-10, 28, -10, 18);
      ctx.closePath();
      ctx.save(); ctx.clip();
      for (let i = 0; i < 8; i++) { ctx.fillStyle = cols[i % 4]; ctx.fillRect(-12, -26 + i * 7, 44, 7); }
      ctx.restore();
      ctx.stroke();
      ctx.fillStyle = '#d52b1e';
      ctx.save(); ctx.translate(0, -12); maplePath(ctx, 7); ctx.fill(); ctx.restore();
      break;
    }
    case 'tooth': {
      ctx.rotate(Math.sin(t * 0.2) * 0.2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-50, -40);
      ctx.bezierCurveTo(-60, -70, -10, -70, 0, -52);
      ctx.bezierCurveTo(10, -70, 60, -70, 50, -40);
      ctx.bezierCurveTo(46, 0, 40, 30, 30, 60);
      ctx.quadraticCurveTo(20, 66, 14, 40);
      ctx.quadraticCurveTo(0, 14, -14, 40);
      ctx.quadraticCurveTo(-20, 66, -30, 60);
      ctx.bezierCurveTo(-40, 30, -46, 0, -50, -40);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(120,200,255,0.5)';
      ellipse(ctx, -22, -40, 10, 6, -0.4); ctx.fill();
      // sourire
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -14, 14, 0.2, Math.PI - 0.2); ctx.stroke();
      circle(ctx, -12, -30, 3); ctx.fillStyle = '#141414'; ctx.fill();
      circle(ctx, 12, -30, 3); ctx.fill();
      text(ctx, 'DENTAIRE', 0, 84, 22, '#f37021');
      break;
    }
    case 'beam': {
      ctx.restore();
      ctx.save();
      const r = p.rect();
      const fade = Math.min(1, p.life / 10);
      const g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
      g.addColorStop(0, `rgba(255,170,0,${0.0})`);
      g.addColorStop(0.3, `rgba(255,220,60,${0.8 * fade})`);
      g.addColorStop(0.5, `rgba(255,255,220,${fade})`);
      g.addColorStop(0.7, `rgba(255,220,60,${0.8 * fade})`);
      g.addColorStop(1, `rgba(255,170,0,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(r.x, r.y + Math.sin(t) * 3, r.w, r.h);
      // soleil souriant à la source
      const sx = dir < 0 ? r.x + r.w : r.x;
      ctx.translate(sx, r.y + r.h / 2);
      ctx.rotate(t * 0.1);
      ctx.fillStyle = '#ffd23f';
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath(); ctx.moveTo(40, -8); ctx.lineTo(66, 0); ctx.lineTo(40, 8); ctx.fill();
      }
      circle(ctx, 0, 0, 42);
      ctx.fill();
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.rotate(-t * 0.1);
      ctx.fillStyle = '#141414';
      circle(ctx, -14, -8, 5); ctx.fill();
      circle(ctx, 14, -8, 5); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 4, 20, 0.2, Math.PI - 0.2); ctx.stroke();
      break;
    }
  }
  ctx.restore();
}
