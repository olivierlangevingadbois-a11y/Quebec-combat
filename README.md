# Québec Combat 🥊⚜️🍁

**Le tournoi politique ultime : Québec contre Ottawa.**

A 2D browser fighting game where caricatures of Quebec and federal Canadian politicians settle their differences
the old-fashioned way. Everything is drawn in code on a `<canvas>`: no images, no build step, no dependencies.

> Parodie humoristique. Aucun politicien n'a été blessé pendant ce combat.

## Jouer

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

It also works on GitHub Pages (Settings → Pages → deploy from branch, root folder).
Add `?demo` to the URL to start straight into a CPU vs CPU match.

## Les combattants

| Québec | Parti | Spécial | Super |
|---|---|---|---|
| François Legault | CAQ | Le 3e lien! (onde au sol) | Méga-batterie! |
| Paul St-Pierre Plamondon | PQ | Bulletin du OUI! | Pays! (pluie de fleurs de lys) |
| Ruba Ghazal | QS | Pancarte! (charge) | Grève générale! |
| Éric Duhaime | PCQ | En ondes! (ondes radio) | LIBERTÉ! (charge) |

| Ottawa | Parti | Spécial | Super |
|---|---|---|---|
| Mark Carney | PLC | Taux directeur! | Coudes levés! (charge) |
| Pierre Poilievre | PCC | Hache la taxe! | AXE THE TAX! |
| Yves-François Blanchet | BQ | Fleur de lys! | LE BLOC! (tombe du ciel) |
| Jagmeet Singh | NPD | Genou volant! (invincible) | Assurance dentaire! |
| Justin Trudeau | PLC | Bas colorés! | Voies ensoleillées! (rayon) |

### Histoire

| Personnage | Spécial | Super |
|---|---|---|
| John A. Macdonald | Une p'tite shot! | Canadien Pacifique! (locomotive) |
| Louis Riel | Ceinture fléchée! (charge) | Chasse au bison! |
| Robert Baldwin | Motion de censure! | LaFontaine, à moi! |
| Louis-Joseph Papineau | 92 Résolutions! | La tête à Papineau! (tombe du ciel) |
| Wilfrid Laurier | Sunny ways 1895! | Le XXe siècle! |
| Maurice Duplessis | Loi du cadenas! | Grande Noirceur! (rayon) |
| René Lévesque | Boucane! | Maîtres chez nous! (éclair) |
| Pierre Elliott Trudeau | Pirouette! | Just watch me! |
| Jean Chrétien | Poivre! | Poignée de Shawinigan! |
| Thérèse Casgrain | Droit de vote! | Suffrage universel! |

Six arenas: the Salon bleu, the House of Commons, Parliament Hill at sunset, the Dufferin Terrace in winter,
the Jacques-Cartier Bridge at night, and the Plains of Abraham.

## Tenues à débloquer

Every fighter has 4 outfits (Louis Riel has a fifth, Halloween one). Progress is saved in the browser (`localStorage`). On the select screen, press
**H** (player 1) or **/** (player 2), or tap the info card, to cycle through unlocked outfits.

| Tenue | Comment la débloquer |
|---|---|
| Classique | — |
| Chandail de hockey | 3 victoires avec le personnage |
| Bûcheron (chemise à carreaux + tuque) | 8 victoires avec le personnage |
| Statue dorée | Finir le mode Arcade avec le personnage |
| **Revenant** (Louis Riel seulement) | Vaincre Macdonald avec Riel. Riel revient d'entre les morts, corde cassée au cou, avec ses propres répliques d'Halloween |

## Objets

Items parachute into the arena during fights; walk over one to use it. Turn them off in the main menu (**OBJETS : NON**).

| Objet | Effet |
|---|---|
| Poutine | Redonne de la santé |
| Castor enragé | Court au sol et mord l'adversaire |
| Ballon de Naismith | Ballon de basket qui rebondit (inventé par un Canadien) |
| Rondelle | Lancer frappé rapide au ras du sol |
| Sirop d'érable | L'adversaire est collé (ralenti) quelques secondes |
| Insuline de Banting | Remplit la jauge de SUPER |
| Coupe Stanley | Puissance augmentée quelques secondes |

## Voix

Every fighter speaks: intro line on the VS screen, special and super callouts, victory line, plus an arena announcer
("Ronde un!", "Combattez!", "K.O.!", names...). The lines are pre-recorded MP3 files in `audio/voix/` (~4.5 MB),
generated offline for free with [Piper](https://github.com/rhasspy/piper), an open-source neural text-to-speech engine.
Each character gets its own voice setting (pitch, speed) and sound treatment: AM radio for Duplessis, talk-radio for
Duhaime, 1970s TV for Lévesque, P.E. Trudeau and Chrétien, wax-cylinder crackle for the 19th-century figures, and an
echoing ghost voice for Riel's *Revenant* outfit. Voices can be turned off in the menu (**VOIX : NON**).
Voice credits and licences: `audio/voix/CREDITS.md`.

To regenerate after editing lines in `js/characters.js`:

```bash
pip install piper-tts                      # plus ffmpeg with libmp3lame
# download the fr_FR tom/upmc/gilles/siwis voices (.onnx + .onnx.json) from
# https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR into ./voices
python3 tools/gen_voices.py ./voices            # everything
python3 tools/gen_voices.py ./voices legault    # one character
```

## Modes

- **Arcade**: beat 6 opponents in a row (difficulty ramps up), with continues.
- **Versus — 2 joueurs**: two players on one keyboard, or with gamepads.
- **Versus — Ordinateur**: pick your fighter and your opponent.
- **Démo**: CPU vs CPU (also starts after ~25 s idle on the title screen).

## Commandes

| | Joueur 1 | Joueur 2 |
|---|---|---|
| Bouger / sauter / s'accroupir | W A S D | Flèches |
| Coup de poing | F | `,` ou Pavé 1 |
| Coup de pied | G | `.` ou Pavé 2 |
| Spécial | H | `/` ou Pavé 3 |
| **Super** (jauge pleine) | S + H | ↓ + Spécial |
| Pause | Échap / P | |

In single-player modes, player 1 can also use the arrows + J / K / L.
Gamepads: A = punch, B = kick, X/Y = special, Start = pause. On touch screens, on-screen buttons appear during fights.

- Hold **back** to block. Crouch-block stops sweeps, stand-block stops jump-ins.
- **Down + kick** = sweep (knockdown).
- Landing and taking hits fills the **SUPER** meter.
- Best of 3 rounds, 99 seconds per round.

## Code

```
index.html        page + touch controls
css/style.css
js/util.js        constants, drawing helpers (fleur-de-lys, maple leaf, flags)
js/audio.js       synthesized sound effects, chiptune music
js/voice.js       plays the pre-recorded voice lines (falls back to the browser's speech synthesis)
js/input.js       keyboard / gamepad / touch
js/store.js       saved progress + unlockable outfits
js/characters.js  roster, quotes, caricature drawing, projectiles
js/items.js       item list and icons
js/stages.js      the six arenas
js/fighter.js     poses (2-bone IK), frame data, fighter state machine
js/ai.js          CPU opponent
js/game.js        combat rules, HUD, scenes (title, menu, select, VS, fight, results)
tools/            gen_voices.py + dump_lines.js: voice line generator
audio/voix/       generated voice lines (one folder per character + annonceur)
```

To add a fighter: add an entry to `ROSTER` in `js/characters.js` (colours, hair style, quotes, special and super) and place it in
`GRID` in `js/game.js`.
