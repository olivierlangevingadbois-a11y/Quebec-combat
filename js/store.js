'use strict';
// ---------- Progression sauvegardée (localStorage) + tenues à débloquer ----------
const Store = (() => {
  const KEY = 'quebec-combat-v1';
  let data = { wins: {}, arcade: {}, skin: {}, beat: {}, items: true };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) data = Object.assign(data, JSON.parse(raw));
  } catch (e) { /* stockage indisponible : on joue sans sauvegarde */ }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
  return {
    get data() { return data; },
    save,
    reset() { data = { wins: {}, arcade: {}, skin: {}, beat: {}, items: data.items }; save(); },
  };
})();

const SKINS = [
  { id: 'classique', name: 'Classique', hint: '', ok: () => true },
  { id: 'hockey', name: 'Chandail de hockey', hint: '3 victoires', ok: (id) => (Store.data.wins[id] || 0) >= 3, prog: (id) => `${Math.min(3, Store.data.wins[id] || 0)}/3` },
  { id: 'bucheron', name: 'Bûcheron', hint: '8 victoires', ok: (id) => (Store.data.wins[id] || 0) >= 8, prog: (id) => `${Math.min(8, Store.data.wins[id] || 0)}/8` },
  { id: 'or', name: 'Statue dorée', hint: 'finir l\'Arcade', ok: (id) => !!Store.data.arcade[id], prog: () => '' },
  // Tenue spéciale d'Halloween : Riel revient d'entre les morts régler ses comptes avec Macdonald
  { id: 'revenant', only: 'riel', name: 'Revenant', hint: 'vaincre Macdonald avec Riel', ok: () => ((Store.data.beat || {}).riel || []).includes('macdonald'), prog: () => '' },
];
function skinsFor(id) {
  return SKINS.map((s, i) => (!s.only || s.only === id ? i : -1)).filter((i) => i >= 0);
}
function unlockedSkins(id) {
  return skinsFor(id).filter((i) => SKINS[i].ok(id));
}
function nextSkinHint(id) {
  const s = skinsFor(id).map((i) => SKINS[i]).find((k) => !k.ok(id));
  if (!s) return 'Toutes les tenues débloquées!';
  const p = s.prog(id);
  return `Prochaine : ${s.name} — ${s.hint}${p ? ` (${p})` : ''}`;
}
// Enregistre une victoire; retourne les noms des tenues nouvellement débloquées
function recordWin(id, arcadeDone, oppId) {
  const before = unlockedSkins(id);
  Store.data.wins[id] = (Store.data.wins[id] || 0) + (arcadeDone ? 0 : 1);
  if (oppId) {
    Store.data.beat = Store.data.beat || {};
    const b = (Store.data.beat[id] = Store.data.beat[id] || []);
    if (!b.includes(oppId)) b.push(oppId);
  }
  if (arcadeDone) Store.data.arcade[id] = true;
  Store.save();
  return unlockedSkins(id).filter((i) => !before.includes(i)).map((i) => SKINS[i].name);
}

// Retourne une copie du personnage avec l'apparence de la tenue choisie
function applySkin(def, idx) {
  const L = def.look;
  let over = null;
  if (!SKINS[idx] || (SKINS[idx].only && SKINS[idx].only !== def.id)) return def;
  switch (SKINS[idx] && SKINS[idx].id) {
    case 'hockey':
      over = { suit: def.color, pants: '#1b1b22', tie: null, top: null, bow: false, jersey: true };
      break;
    case 'bucheron':
      over = { suit: '#b3261e', pants: '#2c4a7c', tie: null, top: null, bow: false, plaid: true, tuque: L.hair === 'turban' ? null : def.color };
      break;
    case 'or':
      over = {
        skin: '#e8c34a', suit: '#c99a1c', pants: '#b58514', shirt: '#f6dc7a', hairColor: '#b58514', gold: true,
        tie: L.tie ? '#f6dc7a' : null, top: L.top ? '#f6dc7a' : null, beard: L.beard ? '#a87a10' : null,
        mustache: L.mustache ? '#a87a10' : null, lips: null, socks: false,
      };
      break;
    case 'revenant':
      over = {
        skin: '#a9c4a2', suit: '#262b26', pants: '#1c201c', shirt: '#bdb8a0', hairColor: '#4a4d44',
        mustache: '#55584e', ghost: true, noose: true, tattered: true,
      };
      break;
  }
  if (over && SKINS[idx].id === 'revenant') {
    const d = Object.create(def);
    d.look = Object.assign({}, L, over);
    d.skinIdx = idx;
    d.color = '#5fd38a';
    d.title = 'Le Revenant';
    d.intro = [
      "Mon peuple dormira cent ans. Moi, j'ai mis mon cadran.",
      "J'avais dit que je reviendrais. J'ai juste pris un détour par le cimetière.",
      "Bouh. ...Non, sérieusement : BOUH.",
      "Macdonald? MACDONAAALD? Viens ici, mon John.",
    ];
    d.win = [
      "Ils m'ont pendu une fois. Ça m'a pas tenu longtemps.",
      "La corde a cassé. Ta mâchoire aussi.",
      "Cent quarante ans à attendre ce moment-là. Ça valait la peine.",
      "Joyeuse Halloween, John. Bonbon ou Rivière-Rouge?",
    ];
    return d;
  }
  if (!over) return def;
  const d = Object.create(def);
  d.look = Object.assign({}, L, over);
  d.skinIdx = idx;
  return d;
}
