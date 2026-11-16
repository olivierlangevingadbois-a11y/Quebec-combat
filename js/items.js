'use strict';
// ---------- Objets (style « party ») tirés de l'histoire et de la culture d'ici ----------
const ITEMS = {
  poutine: { name: 'Poutine!', sub: '+ santé' },
  castor: { name: 'Castor enragé!', sub: 'il mord' },
  basket: { name: 'Ballon de Naismith!', sub: 'inventé par un Canadien' },
  rondelle: { name: 'Lancer frappé!', sub: 'rondelle' },
  sirop: { name: 'Sirop d\'érable!', sub: 'adversaire collé' },
  insuline: { name: 'Insuline de Banting!', sub: 'SUPER plein' },
  coupe: { name: 'Coupe Stanley!', sub: 'puissance +' },
};
const ITEM_KINDS = Object.keys(ITEMS);

function drawItemIcon(ctx, kind, t) {
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 3;
  switch (kind) {
    case 'poutine': {
      ctx.fillStyle = '#e9c46a';
      for (let i = 0; i < 7; i++) {
        ctx.save();
        ctx.translate(-18 + i * 6, -8);
        ctx.rotate(-0.5 + i * 0.17);
        ctx.fillRect(-3, -16, 6, 20);
        ctx.strokeRect(-3, -16, 6, 20);
        ctx.restore();
      }
      ctx.fillStyle = '#7a4a21';
      ellipse(ctx, 0, -8, 20, 8); ctx.fill();
      ctx.fillStyle = '#fff8e1';
      for (const [x, y] of [[-10, -11], [2, -13], [11, -8], [-3, -6]]) { circle(ctx, x, y, 4); ctx.fill(); }
      ctx.fillStyle = '#f4f4f4';
      ctx.beginPath();
      ctx.moveTo(-26, -6); ctx.lineTo(26, -6); ctx.lineTo(18, 18); ctx.lineTo(-18, 18);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }
    case 'castor': {
      ctx.fillStyle = '#3d2a1c';
      ellipse(ctx, -26, 10, 16, 7, 0.2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8a5a33';
      ellipse(ctx, 0, 2, 24, 16); ctx.fill(); ctx.stroke();
      circle(ctx, 22, -8, 13); ctx.fill(); ctx.stroke();
      circle(ctx, 16, -20, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#141414';
      circle(ctx, 27, -11, 2.5); ctx.fill();
      circle(ctx, 35, -6, 3); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(28, -1, 7, 9); ctx.strokeRect(28, -1, 7, 9);
      break;
    }
    case 'basket': {
      ctx.fillStyle = '#e8762c';
      circle(ctx, 0, 0, 22); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-22, 0); ctx.lineTo(22, 0);
      ctx.moveTo(0, -22); ctx.lineTo(0, 22);
      ctx.moveTo(-15, -16); ctx.quadraticCurveTo(-4, 0, -15, 16);
      ctx.moveTo(15, -16); ctx.quadraticCurveTo(4, 0, 15, 16);
      ctx.stroke();
      break;
    }
    case 'rondelle': {
      ctx.fillStyle = '#1a1a1a';
      ctx.strokeStyle = '#555';
      ctx.fillRect(-20, -4, 40, 10);
      ellipse(ctx, 0, 6, 20, 6); ctx.fill();
      ctx.fillStyle = '#2c2c2c';
      ellipse(ctx, 0, -4, 20, 6); ctx.fill(); ctx.stroke();
      break;
    }
    case 'sirop': {
      ctx.fillStyle = '#c8102e';
      roundRect(ctx, -16, -22, 32, 44, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-16, -8, 32, 18);
      ctx.fillStyle = '#c8102e';
      ctx.save(); ctx.translate(0, 2); maplePath(ctx, 8); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#bbb';
      ctx.fillRect(-8, -27, 16, 6); ctx.strokeRect(-8, -27, 16, 6);
      break;
    }
    case 'insuline': {
      ctx.fillStyle = 'rgba(200,235,255,0.9)';
      roundRect(ctx, -11, -16, 22, 38, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2a7de1';
      ctx.fillRect(-11, -4, 22, 14);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-2, -2, 4, 10); ctx.fillRect(-5, 1, 10, 4);
      ctx.fillStyle = '#888';
      ctx.fillRect(-8, -24, 16, 9); ctx.strokeRect(-8, -24, 16, 9);
      break;
    }
    case 'coupe': {
      ctx.fillStyle = '#d5dbe3';
      ctx.fillRect(-12, -2, 24, 24); ctx.strokeRect(-12, -2, 24, 24);
      ctx.beginPath();
      ctx.moveTo(-18, -28); ctx.lineTo(18, -28);
      ctx.quadraticCurveTo(16, -6, 6, -2); ctx.lineTo(-6, -2);
      ctx.quadraticCurveTo(-16, -6, -18, -28);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#8d96a3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, 6); ctx.lineTo(12, 6); ctx.moveTo(-12, 14); ctx.lineTo(12, 14);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(-12, -24, 5, 14);
      break;
    }
  }
}
