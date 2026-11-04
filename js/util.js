'use strict';
// ---------- Constantes & utilitaires ----------
const W = 1280, H = 720, GROUND = 640;
const GRAV = 0.95;
const FONT = '"Bangers", Impact, "Arial Black", sans-serif';
const FONT2 = '"Roboto Condensed", "Arial Narrow", Arial, sans-serif';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, k) => a + (b - a) * k;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const ease = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - (1 - k) * (1 - k));
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function overlap(a, b) {
  return a && b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function shade(hex, amt) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
  const f = amt < 0 ? (v) => v * (1 + amt) : (v) => v + (255 - v) * amt;
  return `rgb(${f(r) | 0},${f(g) | 0},${f(b) | 0})`;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}

// Texte style BD avec contour
function text(ctx, str, x, y, size, fill = '#fff', opts = {}) {
  ctx.save();
  ctx.font = `${opts.weight || ''} ${size}px ${opts.font || FONT}`;
  ctx.textAlign = opts.align || 'center';
  ctx.textBaseline = opts.base || 'middle';
  if (opts.stroke !== false) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = opts.lw || Math.max(3, size * 0.14);
    ctx.strokeStyle = opts.stroke || '#000';
    ctx.strokeText(str, x, y);
  }
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
  ctx.restore();
}

// Fleur de lys (centrée, hauteur ~2s)
function fleurPath(ctx, s) {
  ctx.beginPath();
  // pétale central
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(0.38 * s, -0.6 * s, 0.26 * s, -0.12 * s, 0.09 * s, 0.12 * s);
  ctx.lineTo(-0.09 * s, 0.12 * s);
  ctx.bezierCurveTo(-0.26 * s, -0.12 * s, -0.38 * s, -0.6 * s, 0, -s);
  ctx.closePath();
  // pétales latéraux
  for (const d of [1, -1]) {
    ctx.moveTo(0.08 * s * d, 0.12 * s);
    ctx.bezierCurveTo(0.12 * s * d, -0.45 * s, 0.9 * s * d, -0.6 * s, 0.8 * s * d, -0.12 * s);
    ctx.bezierCurveTo(0.74 * s * d, 0.08 * s, 0.52 * s * d, 0.06 * s, 0.54 * s * d, -0.12 * s);
    ctx.bezierCurveTo(0.42 * s * d, 0.08 * s, 0.28 * s * d, 0.12 * s, 0.08 * s * d, 0.12 * s);
    ctx.closePath();
  }
  // bande
  ctx.rect(-0.46 * s, 0.12 * s, 0.92 * s, 0.15 * s);
  // base
  ctx.moveTo(-0.1 * s, 0.27 * s);
  ctx.lineTo(0.1 * s, 0.27 * s);
  ctx.lineTo(0.05 * s, 0.62 * s);
  ctx.lineTo(-0.05 * s, 0.62 * s);
  ctx.closePath();
  for (const d of [1, -1]) {
    ctx.moveTo(0.08 * s * d, 0.27 * s);
    ctx.quadraticCurveTo(0.42 * s * d, 0.3 * s, 0.36 * s * d, 0.55 * s);
    ctx.quadraticCurveTo(0.2 * s * d, 0.4 * s, 0.06 * s * d, 0.4 * s);
    ctx.closePath();
  }
}

const MAPLE = [
  [0, -1], [0.12, -0.74], [0.27, -0.82], [0.21, -0.38], [0.44, -0.6], [0.5, -0.46], [0.8, -0.52],
  [0.7, -0.29], [0.83, -0.24], [0.45, 0.06], [0.52, 0.22], [0.06, 0.16], [0.06, 0.6], [-0.06, 0.6],
  [-0.06, 0.16], [-0.52, 0.22], [-0.45, 0.06], [-0.83, -0.24], [-0.7, -0.29], [-0.8, -0.52],
  [-0.5, -0.46], [-0.44, -0.6], [-0.21, -0.38], [-0.27, -0.82], [-0.12, -0.74],
];
function maplePath(ctx, s) {
  ctx.beginPath();
  MAPLE.forEach(([x, y], i) => (i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)));
  ctx.closePath();
}

function drawQcFlag(ctx, x, y, w, h, wave = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#0a4ea2';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w / 2, wave, w, 0);
  ctx.lineTo(w, h);
  ctx.quadraticCurveTo(w / 2, h + wave, 0, h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(w * 0.44, wave * 0.5, w * 0.12, h);
  ctx.fillRect(0, h * 0.42 + wave * 0.5, w, h * 0.16);
  const s = Math.min(w, h) * 0.13;
  for (const [fx, fy] of [[0.22, 0.21], [0.78, 0.21], [0.22, 0.79], [0.78, 0.79]]) {
    ctx.save();
    ctx.translate(w * fx, h * fy + wave * 0.5);
    fleurPath(ctx, s);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
function drawCaFlag(ctx, x, y, w, h, wave = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w / 2, wave, w, 0);
  ctx.lineTo(w, h);
  ctx.quadraticCurveTo(w / 2, h + wave, 0, h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d52b1e';
  ctx.fillRect(0, wave * 0.3, w * 0.25, h);
  ctx.fillRect(w * 0.75, wave * 0.3, w * 0.25, h);
  ctx.translate(w / 2, h / 2 + wave * 0.5);
  maplePath(ctx, h * 0.38);
  ctx.fill();
  ctx.restore();
}
