'use strict';
// ---------- Répliques vocales pré-enregistrées (générées avec Piper, voir tools/gen_voices.py) ----------
// Chaque personnage a sa propre voix (hauteur, débit, effet : radio, archive, télé, revenant...).
// Les fichiers sont lus avec <audio>, ce qui fonctionne aussi en ouvrant index.html directement.
const Voice = (() => {
  const BASE = 'audio/voix/';
  const cache = {};
  const channels = {}; // un canal par personnage + un pour l'annonceur
  let queueToken = 0;

  function clip(path) {
    if (!cache[path]) {
      const a = new Audio(BASE + path + '.mp3');
      a.preload = 'auto';
      a.addEventListener('error', () => { a.broken = true; });
      cache[path] = a;
    }
    return cache[path];
  }
  const allowed = () => Sfx.enabled && Sfx.voice;

  // Joue une réplique; `fallback` est lu par la synthèse du navigateur si le fichier manque.
  function play(path, channel = 'ann', fallback = null, onEnd = null) {
    if (!allowed()) { if (onEnd) onEnd(); return; }
    stop(channel);
    const a = clip(path);
    if (a.broken) {
      if (fallback) Sfx.say(fallback);
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }
    const inst = a.cloneNode();
    inst.volume = channel === 'ann' ? 0.95 : 1;
    channels[channel] = inst;
    let done = false;
    const finish = () => { if (!done) { done = true; if (onEnd) onEnd(); } };
    inst.addEventListener('ended', finish);
    inst.addEventListener('error', () => { if (fallback) Sfx.say(fallback); setTimeout(finish, 1200); });
    const p = inst.play();
    if (p && p.catch) p.catch(() => setTimeout(finish, 300)); // lecture bloquée avant un premier clic
  }
  function stop(channel) {
    const a = channels[channel];
    if (a) { a.pause(); channels[channel] = null; }
  }
  function stopAll() {
    queueToken++;
    for (const k in channels) stop(k);
  }
  // Joue une suite de répliques l'une après l'autre : [[path, channel, fallback], ...]
  function queue(items, onDone) {
    const token = ++queueToken;
    const next = (i) => {
      if (token !== queueToken) return;
      if (i >= items.length) { if (onDone) onDone(); return; }
      const [path, ch, fb, gap] = items[i];
      play(path, ch, fb, () => setTimeout(() => next(i + 1), gap || 120));
    };
    next(0);
  }
  function preload(paths) {
    for (const p of paths) clip(p);
  }
  // Raccourcis
  const vid = (f) => f.def.voice || f.def.id;
  return {
    play, stop, stopAll, queue, preload,
    ann: (key, fallback) => play('annonceur/' + key, 'ann', fallback),
    line: (f, key, fallback) => play(`${vid(f)}/${key}`, 'f' + f.side, fallback),
    path: (f, key) => `${vid(f)}/${key}`,
    preloadFighter(f) {
      const id = vid(f);
      preload(['intro0', 'intro1', 'intro2', 'win0', 'win1', 'win2', 'win3', 'special', 'super'].map((k) => `${id}/${k}`));
    },
  };
})();
