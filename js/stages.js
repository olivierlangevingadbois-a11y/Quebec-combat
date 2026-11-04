'use strict';
// ---------- Arènes ----------
// Chaque arène a une couche statique (mise en cache) et une couche animée.
const STAGES = {
  salonbleu: { name: 'Le Salon bleu', place: 'Assemblée nationale, Québec', music: 0, floor: '#1d3a7a' },
  communes: { name: 'La Chambre des communes', place: 'Parlement, Ottawa', music: 1, floor: '#2f5e3a' },
  colline: { name: 'La Colline du Parlement', place: 'Ottawa, au coucher du soleil', music: 2, floor: '#3d6b2f' },
  vieuxquebec: { name: 'La Terrasse Dufferin', place: 'Vieux-Québec, en hiver', music: 0, floor: '#7b6a58' },
  pontjc: { name: 'Le pont Jacques-Cartier', place: 'Montréal, la nuit', music: 1, floor: '#3a3a44' },
};
const STAGE_IDS = Object.keys(STAGES);
const stageCache = {};

function stageLayer(id) {
  if (stageCache[id]) return stageCache[id];
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  STAGE_STATIC[id](ctx);
  stageCache[id] = cv;
  return cv;
}

function drawStage(ctx, id, t) {
  ctx.drawImage(stageLayer(id), 0, 0);
  const dyn = STAGE_DYNAMIC[id];
  if (dyn) dyn(ctx, t);
}

const STAGE_STATIC = {
  salonbleu(ctx) {
    // murs bleus
    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, '#16285a');
    g.addColorStop(1, '#2d4f98');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // corniche dorée
    ctx.fillStyle = '#c8a24a';
    ctx.fillRect(0, 70, W, 10);
    ctx.fillRect(0, 380, W, 8);
    // panneaux / fenêtres en arc
    for (let i = 0; i < 7; i++) {
      const x = 40 + i * 180;
      ctx.fillStyle = '#23417f';
      ctx.strokeStyle = '#c8a24a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, 370);
      ctx.lineTo(x, 170);
      ctx.arc(x + 60, 170, 60, Math.PI, 0);
      ctx.lineTo(x + 120, 370);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(180,210,255,0.12)';
      ctx.fillRect(x + 12, 170, 96, 190);
    }
    // grand tableau au centre
    ctx.fillStyle = '#5a3d1e';
    ctx.fillRect(470, 100, 340, 200);
    ctx.fillStyle = '#c8a24a';
    ctx.fillRect(480, 110, 320, 180);
    g = ctx.createLinearGradient(0, 120, 0, 280);
    g.addColorStop(0, '#6f87a8');
    g.addColorStop(1, '#3b4b35');
    ctx.fillStyle = g;
    ctx.fillRect(490, 120, 300, 160);
    ctx.fillStyle = 'rgba(30,30,30,0.6)';
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(520 + i * 32, 260, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(508 + i * 32, 260, 24, 20);
    }
    // drapeaux
    drawQcFlag(ctx, 90, 120, 120, 80);
    drawQcFlag(ctx, 1070, 120, 120, 80);
    // fauteuil de la présidence
    ctx.fillStyle = '#4a2c14';
    ctx.fillRect(590, 300, 100, 130);
    ctx.fillStyle = '#1d3a7a';
    ctx.fillRect(605, 315, 70, 80);
    ctx.fillStyle = '#c8a24a';
    ctx.fillRect(585, 296, 110, 8);
    // pupitres en rangées
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 14; i++) {
        const x = i * 96 - 20 + r * 48, y = 430 + r * 52;
        ctx.fillStyle = '#4a2c14';
        ctx.fillRect(x, y, 84, 40);
        ctx.fillStyle = '#2a6b55';
        ctx.fillRect(x + 4, y + 2, 76, 10);
        ctx.fillStyle = '#2f1b0c';
        ctx.fillRect(x, y + 34, 84, 6);
      }
    }
    // tapis
    g = ctx.createLinearGradient(0, GROUND - 100, 0, H);
    g.addColorStop(0, '#1d3a7a');
    g.addColorStop(1, '#0f224d');
    ctx.fillStyle = g;
    ctx.fillRect(0, GROUND - 80, W, H);
    ctx.fillStyle = 'rgba(200,162,74,0.25)';
    for (let i = 0; i < 20; i++) {
      ctx.save();
      ctx.translate(i * 70 + 20, GROUND + 40);
      fleurPath(ctx, 12);
      ctx.fill();
      ctx.restore();
    }
  },

  communes(ctx) {
    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, '#2e2318');
    g.addColorStop(1, '#6b4a2c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // arches gothiques en pierre
    for (let i = 0; i < 8; i++) {
      const x = i * 165 - 10;
      ctx.fillStyle = '#b9a787';
      ctx.fillRect(x, 0, 22, 420);
      ctx.fillStyle = '#3a2a1a';
      ctx.beginPath();
      ctx.moveTo(x + 30, 400);
      ctx.lineTo(x + 30, 160);
      ctx.quadraticCurveTo(x + 30, 90, x + 90, 60);
      ctx.quadraticCurveTo(x + 150, 90, x + 150, 160);
      ctx.lineTo(x + 150, 400);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b9a787';
      ctx.lineWidth = 5;
      ctx.stroke();
      // vitraux
      ctx.fillStyle = 'rgba(255,220,140,0.18)';
      ctx.fillRect(x + 45, 140, 90, 120);
      ctx.strokeStyle = 'rgba(185,167,135,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 45, 140, 90, 120);
      ctx.beginPath();
      ctx.moveTo(x + 90, 140); ctx.lineTo(x + 90, 260);
      ctx.moveTo(x + 45, 200); ctx.lineTo(x + 135, 200);
      ctx.stroke();
    }
    // lambris de bois
    ctx.fillStyle = '#5a3b1e';
    ctx.fillRect(0, 400, W, 120);
    ctx.strokeStyle = '#3b250f';
    ctx.lineWidth = 3;
    for (let i = 0; i < 26; i++) ctx.strokeRect(i * 50 + 4, 410, 42, 100);
    // fauteuil du Président
    ctx.fillStyle = '#3b250f';
    ctx.beginPath();
    ctx.moveTo(580, 520); ctx.lineTo(580, 280); ctx.lineTo(640, 200); ctx.lineTo(700, 280); ctx.lineTo(700, 520);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2f6b40';
    ctx.fillRect(598, 320, 84, 120);
    ctx.fillStyle = '#c8a24a';
    ctx.save();
    ctx.translate(640, 270);
    maplePath(ctx, 18);
    ctx.fill();
    ctx.restore();
    drawCaFlag(ctx, 420, 250, 110, 56);
    drawCaFlag(ctx, 750, 250, 110, 56);
    // banquettes vertes
    for (let r = 0; r < 2; r++) {
      ctx.fillStyle = r ? '#24543a' : '#2d6747';
      roundRect(ctx, -20, 470 + r * 46, W + 40, 44, 10);
      ctx.fill();
      ctx.strokeStyle = '#173826';
      ctx.lineWidth = 3;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 48, 474 + r * 46);
        ctx.lineTo(i * 48, 510 + r * 46);
        ctx.stroke();
      }
    }
    // tapis vert
    g = ctx.createLinearGradient(0, GROUND - 80, 0, H);
    g.addColorStop(0, '#2f6b40');
    g.addColorStop(1, '#173826');
    ctx.fillStyle = g;
    ctx.fillRect(0, GROUND - 80, W, H);
    ctx.strokeStyle = 'rgba(200,162,74,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND - 60); ctx.lineTo(W, GROUND - 60);
    ctx.moveTo(0, H - 20); ctx.lineTo(W, H - 20);
    ctx.stroke();
  },

  colline(ctx) {
    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, '#2b2d6e');
    g.addColorStop(0.45, '#d9596b');
    g.addColorStop(0.8, '#ffb35c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // soleil
    ctx.fillStyle = 'rgba(255,230,150,0.9)';
    circle(ctx, 960, 400, 70);
    ctx.fill();
    // édifice du Centre (silhouette)
    ctx.fillStyle = '#3a2840';
    ctx.fillRect(250, 300, 780, 220);
    for (let i = 0; i < 13; i++) {
      ctx.beginPath();
      ctx.moveTo(250 + i * 60, 300);
      ctx.lineTo(280 + i * 60, 270);
      ctx.lineTo(310 + i * 60, 300);
      ctx.fill();
    }
    // tours latérales
    for (const x of [230, 1010]) {
      ctx.fillRect(x, 240, 50, 280);
      ctx.beginPath();
      ctx.moveTo(x - 4, 240); ctx.lineTo(x + 25, 190); ctx.lineTo(x + 54, 240);
      ctx.fill();
    }
    // Tour de la Paix
    ctx.fillRect(590, 120, 100, 400);
    ctx.beginPath();
    ctx.moveTo(585, 120); ctx.lineTo(640, 30); ctx.lineTo(695, 120);
    ctx.fill();
    ctx.fillRect(637, 0, 6, 40);
    // horloge
    ctx.fillStyle = '#f7e6b0';
    circle(ctx, 640, 170, 26);
    ctx.fill();
    ctx.strokeStyle = '#3a2840';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(640, 170); ctx.lineTo(640, 152);
    ctx.moveTo(640, 170); ctx.lineTo(654, 176);
    ctx.stroke();
    // fenêtres éclairées
    ctx.fillStyle = 'rgba(255,214,120,0.75)';
    for (let r = 0; r < 3; r++)
      for (let i = 0; i < 22; i++) {
        if ((i * 7 + r * 3) % 5 === 0) continue;
        ctx.fillRect(270 + i * 34, 330 + r * 50, 12, 24);
      }
    // pelouse
    g = ctx.createLinearGradient(0, 500, 0, H);
    g.addColorStop(0, '#2e5a25');
    g.addColorStop(1, '#1b3a15');
    ctx.fillStyle = g;
    ctx.fillRect(0, 510, W, H);
    // allée
    ctx.fillStyle = '#a99a84';
    ctx.beginPath();
    ctx.moveTo(560, 520); ctx.lineTo(720, 520); ctx.lineTo(980, H); ctx.lineTo(300, H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, GROUND - 6, W, H);
    // flamme du centenaire (socle)
    ctx.fillStyle = '#5b5560';
    ellipse(ctx, 640, 540, 70, 14);
    ctx.fill();
  },

  vieuxquebec(ctx) {
    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, '#0b1230');
    g.addColorStop(1, '#2c3a6b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // étoiles
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 70; i++) ctx.fillRect((i * 173) % W, (i * 97) % 260, 2, 2);
    // lune
    ctx.fillStyle = '#f4f1de';
    circle(ctx, 1110, 90, 36);
    ctx.fill();
    // Château (silhouette)
    const cx = 380;
    ctx.fillStyle = '#5b3a2e';
    ctx.fillRect(cx, 230, 460, 260);
    ctx.fillRect(cx + 170, 140, 120, 120);
    ctx.fillStyle = '#2f7a62';
    ctx.beginPath();
    ctx.moveTo(cx + 160, 140); ctx.lineTo(cx + 230, 40); ctx.lineTo(cx + 300, 140);
    ctx.closePath();
    ctx.fill();
    for (const [x, w, h] of [[cx - 10, 90, 70], [cx + 80, 90, 60], [cx + 300, 90, 60], [cx + 380, 90, 70]]) {
      ctx.beginPath();
      ctx.moveTo(x, 232); ctx.lineTo(x + w / 2, 232 - h); ctx.lineTo(x + w, 232);
      ctx.closePath();
      ctx.fill();
    }
    // tourelles
    for (const x of [cx - 20, cx + 450]) {
      ctx.fillStyle = '#5b3a2e';
      ctx.fillRect(x, 200, 40, 290);
      ctx.fillStyle = '#2f7a62';
      ctx.beginPath();
      ctx.moveTo(x - 6, 202); ctx.lineTo(x + 20, 130); ctx.lineTo(x + 46, 202);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,214,120,0.85)';
    for (let r = 0; r < 4; r++)
      for (let i = 0; i < 14; i++) {
        if ((i * 5 + r * 7) % 6 === 0) continue;
        ctx.fillRect(cx + 15 + i * 32, 260 + r * 48, 10, 18);
      }
    for (let i = 0; i < 3; i++) ctx.fillRect(cx + 195 + i * 30, 170, 10, 18);
    // fleuve
    g = ctx.createLinearGradient(0, 470, 0, 540);
    g.addColorStop(0, '#16224a');
    g.addColorStop(1, '#0c1430');
    ctx.fillStyle = g;
    ctx.fillRect(0, 480, W, 80);
    // garde-fou de la terrasse
    ctx.fillStyle = '#2a2420';
    ctx.fillRect(0, 548, W, 8);
    for (let i = 0; i < 64; i++) ctx.fillRect(i * 20, 556, 4, 30);
    ctx.fillRect(0, 584, W, 6);
    // kiosques
    for (const x of [130, 1080]) {
      ctx.fillStyle = '#3d5a4a';
      ctx.fillRect(x, 470, 70, 80);
      ctx.fillStyle = '#2f7a62';
      ctx.beginPath();
      ctx.moveTo(x - 14, 474); ctx.quadraticCurveTo(x + 35, 400, x + 84, 474);
      ctx.fill();
    }
    // planches
    ctx.fillStyle = '#6e5b48';
    ctx.fillRect(0, 590, W, H);
    ctx.strokeStyle = '#4e3f30';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 600 + i * 16); ctx.lineTo(W, 600 + i * 16);
      ctx.stroke();
    }
    // neige au sol
    ctx.fillStyle = 'rgba(240,245,255,0.75)';
    ctx.beginPath();
    ctx.moveTo(0, 600);
    for (let x = 0; x <= W; x += 40) ctx.quadraticCurveTo(x + 20, 590 + ((x / 40) % 3) * 4, x + 40, 600);
    ctx.lineTo(W, 612); ctx.lineTo(0, 612);
    ctx.fill();
  },

  pontjc(ctx) {
    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, '#07071a');
    g.addColorStop(1, '#25204a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // gratte-ciel de Montréal
    const blds = [[60, 260], [130, 180], [190, 300], [260, 140], [330, 220], [400, 120], [470, 200], [540, 260], [610, 160], [880, 240], [950, 190], [1020, 280], [1090, 210], [1160, 300]];
    for (const [x, h] of blds) {
      ctx.fillStyle = '#181633';
      ctx.fillRect(x, 470 - h, 64, h);
      ctx.fillStyle = 'rgba(255,220,140,0.55)';
      for (let yy = 470 - h + 12; yy < 460; yy += 18)
        for (let xx = x + 8; xx < x + 58; xx += 14) if ((xx * 3 + yy) % 7 > 2) ctx.fillRect(xx, yy, 6, 8);
    }
    // croix du mont Royal
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(760, 120); ctx.lineTo(760, 200);
    ctx.moveTo(740, 140); ctx.lineTo(780, 140);
    ctx.stroke();
    ctx.fillStyle = '#100e24';
    ctx.beginPath();
    ctx.moveTo(640, 470); ctx.quadraticCurveTo(760, 170, 900, 470);
    ctx.fill();
    // fleuve
    g = ctx.createLinearGradient(0, 470, 0, 600);
    g.addColorStop(0, '#141238');
    g.addColorStop(1, '#07061a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 470, W, 140);
    // quai
    ctx.fillStyle = '#34343e';
    ctx.fillRect(0, 600, W, H);
    ctx.fillStyle = '#ffd23f';
    for (let i = 0; i < 20; i++) ctx.fillRect(i * 70, 606, 40, 4);
  },
};

const STAGE_DYNAMIC = {
  salonbleu(ctx, t) {
    // lustres scintillants
    for (const x of [200, 640, 1080]) {
      const a = 0.25 + Math.sin(t * 0.05 + x) * 0.05;
      const g = ctx.createRadialGradient(x, 60, 0, x, 60, 120);
      g.addColorStop(0, `rgba(255,240,190,${a})`);
      g.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 120, 0, 240, 200);
    }
  },
  communes(ctx, t) {
    // petite foule de députés qui s'agitent
    for (let i = 0; i < 26; i++) {
      const x = i * 50 + 10, bob = Math.max(0, Math.sin(t * 0.08 + i * 1.7)) * 8;
      ctx.fillStyle = i % 3 ? '#1d2233' : '#2a2a2a';
      circle(ctx, x, 456 - bob, 11);
      ctx.fill();
      roundRect(ctx, x - 14, 466 - bob, 28, 20, 6);
      ctx.fill();
    }
  },
  colline(ctx, t) {
    // flamme du centenaire
    for (let i = 0; i < 6; i++) {
      const h = 30 + Math.sin(t * 0.3 + i) * 10 + Math.random() * 8;
      ctx.fillStyle = i % 2 ? 'rgba(255,140,0,0.8)' : 'rgba(255,220,80,0.8)';
      ctx.beginPath();
      ctx.moveTo(610 + i * 10, 540);
      ctx.quadraticCurveTo(615 + i * 10, 540 - h, 625 + i * 10 + Math.sin(t * 0.2) * 4, 540 - h - 10);
      ctx.quadraticCurveTo(630 + i * 10, 540 - h / 2, 635 + i * 10, 540);
      ctx.fill();
    }
    // bernaches qui passent
    const bx = (t * 1.2) % (W + 400) - 200;
    ctx.strokeStyle = '#1a1030';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const x = bx - i * 30, y = 120 + Math.abs(i - 2) * 14, f = Math.sin(t * 0.25 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(x - 10, y - f); ctx.lineTo(x, y); ctx.lineTo(x + 10, y - f);
      ctx.stroke();
    }
  },
  vieuxquebec(ctx, t) {
    // lampadaires
    for (const x of [300, 980]) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x - 3, 470, 6, 130);
      const g = ctx.createRadialGradient(x, 470, 0, x, 470, 70);
      g.addColorStop(0, 'rgba(255,220,140,0.6)');
      g.addColorStop(1, 'rgba(255,220,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 70, 400, 140, 140);
      ctx.fillStyle = '#ffe9a8';
      circle(ctx, x, 470, 8);
      ctx.fill();
    }
  },
  pontjc(ctx, t) {
    // pont aux lumières changeantes
    const hue = (t * 0.6) % 360;
    ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) {
      const x0 = 120 + i * 360;
      ctx.strokeStyle = `hsl(${(hue + i * 50) % 360},90%,60%)`;
      ctx.beginPath();
      ctx.moveTo(x0, 430);
      ctx.quadraticCurveTo(x0 + 180, 300, x0 + 360, 430);
      ctx.stroke();
      for (let k = 1; k < 8; k++) {
        const u = k / 8;
        const x = x0 + u * 360;
        const y = (1 - u) * (1 - u) * 430 + 2 * (1 - u) * u * 300 + u * u * 430;
        ctx.strokeStyle = `hsla(${(hue + k * 25) % 360},90%,65%,0.8)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, 432);
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#0c0b1e';
    ctx.fillRect(0, 430, W, 10);
    for (let i = 0; i < 4; i++) ctx.fillRect(110 + i * 360, 430, 20, 60);
    // reflets
    for (let i = 0; i < 40; i++) {
      const x = (i * 131 + t * 0.4) % W, y = 490 + (i * 37) % 100;
      ctx.fillStyle = `hsla(${(hue + i * 9) % 360},80%,60%,${0.15 + 0.15 * Math.sin(t * 0.1 + i)})`;
      ctx.fillRect(x, y, 26, 2);
    }
  },
};

// Neige (Vieux-Québec), dessinée par-dessus les combattants
function drawStageFront(ctx, id, t) {
  if (id === 'vieuxquebec') {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 90; i++) {
      const sp = 0.6 + (i % 5) * 0.25;
      const x = (i * 211 + Math.sin(t * 0.02 + i) * 30 + t * 0.3) % W;
      const y = (i * 89 + t * sp) % H;
      circle(ctx, x, y, 1.5 + (i % 3));
      ctx.fill();
    }
  }
}
