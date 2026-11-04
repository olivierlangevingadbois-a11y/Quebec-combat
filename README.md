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

Five arenas: the Salon bleu, the House of Commons, Parliament Hill at sunset, the Dufferin Terrace in winter,
and the Jacques-Cartier Bridge at night.

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
js/audio.js       synthesized sound effects, chiptune music, fr-CA announcer (speechSynthesis)
js/input.js       keyboard / gamepad / touch
js/characters.js  roster, caricature drawing, projectiles
js/stages.js      the five arenas
js/fighter.js     poses (2-bone IK), frame data, fighter state machine
js/ai.js          CPU opponent
js/game.js        combat rules, HUD, scenes (title, menu, select, VS, fight, results)
```

To add a fighter: add an entry to `ROSTER` in `js/characters.js` (colours, hair style, special and super) and place it in
`GRID` in `js/game.js`.
