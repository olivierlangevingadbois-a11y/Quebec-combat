// Extrait toutes les répliques du jeu en JSON (utilisé par gen_voices.py)
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.join(__dirname, '..');
const code = ['js/util.js', 'js/store.js', 'js/characters.js'].map((f) => fs.readFileSync(path.join(root, f), 'utf8')).join('\n;\n');
const out = vm.runInNewContext(code + `
;(() => {
  const chars = ROSTER.map((c) => ({ id: c.id, name: c.name, intro: c.intro, win: c.win, special: c.special.name, super: c.super.name }));
  const rv = applySkin(ROSTER_BY_ID.riel, SKINS.findIndex((s) => s.id === 'revenant'));
  chars.push({ id: 'riel-revenant', name: 'Louis Riel', intro: rv.intro, win: rv.win, special: rv.special.name, super: rv.super.name });
  return JSON.stringify(chars);
})()`, { window: {}, console });
process.stdout.write(out);
