'use strict';
// ---------- Les combattants ----------
// Caricatures humoristiques. Les « coups spéciaux » font référence à des slogans,
// promesses et débats publics bien connus. C'est une parodie, rien de plus!
const ROSTER = [
  // ===== Québec =====
  {
    id: 'legault', name: 'François Legault', short: 'LEGAULT', party: 'CAQ', level: 'QC', num: 3,
    title: 'Le Comptable', color: '#1fb5e0', winProp: 'calc',
    look: { skin: '#f0c4a0', suit: '#1e2b48', pants: '#19233b', tie: '#1fb5e0', shirt: '#ffffff', hair: 'bald', hairColor: '#bdb7ae' },
    spd: 0.95, pow: 1.06, stage: 'salonbleu',
    special: { name: 'Le 3e lien!', type: 'wave', kind: 'tunnel', dmg: 70, speed: 7.5 },
    super: { name: 'Méga-batterie!', type: 'projectile', kind: 'battery', dmg: 250, hits: 3, speed: 8.5 },
    intro: ["Ça va bien aller. Pas pour toi, par exemple.", "Je suis comptable : tu vas finir dans le rouge.", "Le 3e lien? Oui. Non. Oui. Tiens, une claque."],
    win: ["7 millions pour les Kings... pis une volée gratis pour toi.", "Le 3e lien, c'est réglé : mon poing, ta face.", "On va continuer! ...Toi, non.", "Colonne des revenus : moi. Colonne des dépenses : tes dents."],
  },
  {
    id: 'pspp', name: 'Paul St-Pierre Plamondon', short: 'PSPP', party: 'PQ', level: 'QC', num: 95,
    title: 'Le Référendaire', color: '#2c64c8',
    look: { skin: '#eebf9c', suit: '#1b2a55', pants: '#141f40', tie: '#2c64c8', shirt: '#ffffff', hair: 'short', hairColor: '#3b2a1f' },
    spd: 1.05, pow: 1.0, stage: 'vieuxquebec',
    special: { name: 'Bulletin du OUI!', type: 'projectile', kind: 'ballot', dmg: 65, speed: 10.5 },
    super: { name: 'Pays!', type: 'rain', kind: 'fleur', dmg: 270, count: 9 },
    intro: ["Je prête pas serment au roi. Mais je te jure une volée.", "La question est claire : veux-tu une claque, OUI ou OUI?", "Ce combat, c'est un mandat clair."],
    win: ["50 % plus un... coup de poing.", "Le roi Charles peut ben aller se coucher. Toi, c'est fait.", "Référendum gagnant : 100 % de OUI, t'es à terre.", "À la prochaine fois? Non non. C'est CETTE fois-ci."],
  },
  {
    id: 'ghazal', name: 'Ruba Ghazal', short: 'GHAZAL', party: 'QS', level: 'QC', num: 99,
    title: 'La Militante', color: '#ff6a13',
    look: { skin: '#d9a47f', suit: '#2a2a33', pants: '#22222a', tie: null, top: '#ff6a13', shirt: '#ff6a13', hair: 'long', hairColor: '#1d1512', lips: '#b8323a' },
    spd: 1.12, pow: 0.95, stage: 'pontjc',
    special: { name: 'Pancarte!', type: 'dash', prop: 'sign', dmg: 85, speed: 13, dur: 16 },
    super: { name: 'Grève générale!', type: 'wave', kind: 'signs', dmg: 250, hits: 5, speed: 6.5 },
    intro: ["On taxe les ultra-riches. Pis on tape les autres.", "Co-porte-parole? Co-knock-out.", "So-so-so... solide droite!"],
    win: ["Ça, c'est de la redistribution de claques.", "Solidaire, oui. Avec ta mâchoire, non.", "Le 1 % le plus magané, c'est toi.", "Mon loyer monte, toi tu descends."],
  },
  {
    id: 'duhaime', name: 'Éric Duhaime', short: 'DUHAIME', party: 'PCQ', level: 'QC', num: 0,
    title: 'La Voix des ondes', color: '#2a3f8f', winProp: 'mic',
    look: { skin: '#efc2a0', suit: '#262d3d', pants: '#1c2230', tie: null, shirt: '#dfe7f5', hair: 'shaved', hairColor: '#6d655d', stubble: true },
    spd: 1.0, pow: 1.05, stage: 'pontjc',
    special: { name: 'En ondes!', type: 'projectile', kind: 'radio', dmg: 64, hits: 2, speed: 8.5, prop: 'mic' },
    super: { name: 'LIBERTÉ!', type: 'dash', prop: 'mic', dmg: 240, hits: 4, speed: 16, dur: 28 },
    intro: ["On ouvre les lignes... pis ta lèvre.", "En ondes dans 3, 2, 1... PAF.", "Zéro siège, mais deux poings."],
    win: ["T'es en ondes. Pis t'es K.O.", "Libârté! Surtout celle de te sacrer une volée.", "Ligne 1, t'es là? ...Ligne 1? Y répond pu.", "C'est ça qui est ça, mon chum."],
  },
  // ===== Ottawa =====
  {
    id: 'carney', name: 'Mark Carney', short: 'CARNEY', party: 'PLC', level: 'CA', num: 24,
    title: 'Le Banquier', color: '#d71920',
    look: { skin: '#f2c9ad', suit: '#1d2740', pants: '#171f33', tie: '#d71920', shirt: '#ffffff', hair: 'recede', hairColor: '#9a958f' },
    spd: 0.95, pow: 1.08, stage: 'communes',
    special: { name: 'Taux directeur!', type: 'projectile', kind: 'rate', dmg: 70, speed: 9.5 },
    super: { name: 'Coudes levés!', type: 'dash', prop: 'elbow', dmg: 260, hits: 3, speed: 18, dur: 24 },
    intro: ["Coudes levés, mon chum.", "J'ai géré deux banques centrales. Toi, t'es un p'tit déficit.", "J'ai un plan. Il a des graphiques. Pis un crochet."],
    win: ["Ton taux de survie vient de baisser de 100 points de base.", "Coudes levés, taux baissés, adversaire couché.", "Ça, c'est un resserrement quantitatif de ta face.", "Marché baissier : toi."],
  },
  {
    id: 'poilievre', name: 'Pierre Poilievre', short: 'POILIEVRE', party: 'PCC', level: 'CA', num: 7,
    title: 'Le Hache-Taxe', color: '#1a4fa0', winProp: 'apple',
    look: { skin: '#f0c6a6', suit: '#1a2338', pants: '#151c2d', tie: '#1a4fa0', shirt: '#ffffff', hair: 'slick', hairColor: '#2c2119' },
    spd: 1.08, pow: 1.0, stage: 'colline',
    special: { name: 'Hache la taxe!', type: 'projectile', kind: 'axe', dmg: 75, speed: 11 },
    super: { name: 'AXE THE TAX!', type: 'projectile', kind: 'bigaxe', dmg: 260, hits: 4, speed: 10 },
    intro: ["Gros bon sens : je frappe, tu tombes.", "Tout est brisé. Ta garde aussi.", "Verbe, nom, claque."],
    win: ["*croque dans sa pomme* ...Pis? C'était quoi ta question?", "Hache la taxe. Hache la face.", "Ramenons le gros bon sens : reste couché.", "*crounch* Qui ça? Quelle page? Quelle ligne?"],
  },
  {
    id: 'blanchet', name: 'Yves-François Blanchet', short: 'BLANCHET', party: 'BQ', level: 'CA', qc: true, num: 78,
    title: 'Le Bloqueur', color: '#2fb4d4',
    look: { skin: '#f2c8ab', suit: '#30343d', pants: '#25282f', tie: '#2fb4d4', shirt: '#ffffff', hair: 'swept', hairColor: '#e4e2dc', glasses: true },
    spd: 0.9, pow: 1.12, stage: 'communes',
    special: { name: 'Fleur de lys!', type: 'projectile', kind: 'fleur', dmg: 70, speed: 9.5 },
    super: { name: 'LE BLOC!', type: 'drop', kind: 'bloc', dmg: 280 },
    intro: ["Je suis ici pour bloquer. Tout. Même toi.", "Le Bloc bloque. C'est dans le nom.", "Ottawa, c'est pas mon pays. Mais c'est mon ring."],
    win: ["Le Québec a parlé. Toi, tu parles pu.", "Bloqué, barré, couché.", "Je négocie pas. Je bloque.", "Un artificiel de moins."],
  },
  {
    id: 'singh', name: 'Jagmeet Singh', short: 'SINGH', party: 'NPD', level: 'CA', num: 12,
    title: 'Le Jiu-jitsuka', color: '#f37021',
    look: { skin: '#b98058', suit: '#5b2a6e', pants: '#2b1d36', tie: '#f37021', shirt: '#ffffff', hair: 'turban', hairColor: '#e0457f', beard: '#151111' },
    spd: 1.15, pow: 0.95, stage: 'colline',
    special: { name: 'Genou volant!', type: 'rising', dmg: 95 },
    super: { name: 'Assurance dentaire!', type: 'projectile', kind: 'tooth', dmg: 250, hits: 3, speed: 9 },
    intro: ["J'ai déchiré l'entente. T'es le prochain.", "Un peu de jiu-jitsu parlementaire?", "Les ultra-riches vont payer. Toi aussi."],
    win: ["Ton K.O. est couvert par l'assurance dentaire.", "Les gens ordinaires gagnent. Toi, t'es extraordinairement couché.", "Ceinture noire. Œil au beurre noir. Coïncidence?", "Ça, ça s'en va direct sur TikTok."],
  },
  {
    id: 'trudeau', name: 'Justin Trudeau', short: 'TRUDEAU', party: 'PLC', level: 'CA', num: 15,
    title: 'L\'Ex', color: '#e2343b', winProp: 'drinkbox',
    look: { skin: '#e9bc98', suit: '#22355e', pants: '#1a2a4a', tie: '#e2343b', shirt: '#ffffff', hair: 'wavy', hairColor: '#3a2a20', socks: true },
    spd: 1.1, pow: 0.95, stage: 'colline',
    special: { name: 'Bas colorés!', type: 'projectile', kind: 'sock', dmg: 60, speed: 11.5 },
    super: { name: 'Voies ensoleillées!', type: 'beam', kind: 'sun', dmg: 270, hits: 6, dur: 54 },
    intro: ["Laisse-moi être très clair : euh... tu vas en manger une.", "Parce qu'on est en 2026.", "Check mes bas. Dernière chose que tu vas voir."],
    win: ["Je bois dans des... genres de boîtes à boire en carton. Toi, tu bois la tasse.", "Le budget va s'équilibrer tout seul. Ta mâchoire, non.", "Coudegate 2 : le retour.", "Des voies ensoleillées. Pour moi."],
  },
  // ===== Histoire =====
  {
    id: 'macdonald', name: 'John A. Macdonald', short: 'MACDONALD', party: 'L-C', level: 'HI', num: 67,
    title: 'Le Vieux Chef', color: '#7a4a9c', winProp: 'bottle',
    look: { skin: '#f1c7ab', suit: '#2a2530', pants: '#5a5560', tie: '#7a1f2e', shirt: '#ffffff', hair: 'curly', hairColor: '#3a3029', bigNose: true, bow: true },
    spd: 0.92, pow: 1.1, stage: 'colline',
    special: { name: 'Une p\'tite shot!', type: 'projectile', kind: 'bottle', dmg: 68, speed: 10.5 },
    super: { name: 'Canadien Pacifique!', type: 'wave', kind: 'train', dmg: 270, hits: 4, speed: 11 },
    intro: ["Un Dominion d'un océan à l'autre. Une claque d'une oreille à l'autre.", "J'ai fondé le pays avant mon premier café. Façon de parler.", "1867, mon jeune. Tu connais?"],
    win: ["Mieux vaut Macdonald pompette que toi à jeun.", "Le dernier crampon, c'était toi.", "Tchou-tchou, mon grand.", "A mari usque ad plancher."],
  },
  {
    id: 'riel', name: 'Louis Riel', short: 'RIEL', party: 'MÉTIS', level: 'HI', num: 70,
    title: 'Le Père du Manitoba', color: '#c0392b',
    look: { skin: '#dcae8a', suit: '#33291f', pants: '#2a221a', tie: null, shirt: '#efe6d2', hair: 'wavy', hairColor: '#2a1d15', mustache: '#2a1d15', sash: true },
    spd: 1.08, pow: 1.02, stage: 'plaines',
    special: { name: 'Ceinture fléchée!', type: 'dash', prop: 'sash', dmg: 85, speed: 13, dur: 16 },
    super: { name: 'Chasse au bison!', type: 'wave', kind: 'bison', dmg: 260, hits: 4, speed: 9.5 },
    intro: ["Élu trois fois, jamais assis. Aujourd'hui, c'est toi qui t'assois.", "La Rivière-Rouge te salue.", "Gouvernement provisoire. Claque permanente."],
    win: ["Mon peuple dormira cent ans. Toi, dix secondes, ça va suffire.", "Le Manitoba, c'est moi. Le plancher, c'est toi.", "L'histoire m'a donné raison. Encore.", "Les Prairies ont voté."],
  },
  {
    id: 'baldwin', name: 'Robert Baldwin', short: 'BALDWIN', party: 'RÉF', level: 'HI', num: 48,
    title: 'Le Réformiste', color: '#3a8f5a',
    look: { skin: '#f3ccb2', suit: '#1f2a25', pants: '#34302c', tie: '#3a8f5a', shirt: '#ffffff', hair: 'recede', hairColor: '#5a4636', sideburns: true, bow: true },
    spd: 0.98, pow: 1.02, stage: 'communes',
    special: { name: 'Motion de censure!', type: 'projectile', kind: 'scroll', dmg: 66, speed: 10 },
    super: { name: 'LaFontaine, à moi!', type: 'wave', kind: 'lafontaine', dmg: 255, hits: 4, speed: 10 },
    intro: ["Un gouvernement responsable... de ta défaite.", "LaFontaine pis moi, on est un duo. Toi, t'es tout seul.", "Je propose une motion : toi, par terre."],
    win: ["Motion adoptée à l'unanimité.", "1848 : gouvernement responsable. Aujourd'hui : adversaire irresponsable.", "Baldwin-LaFontaine : le premier « tag team » du pays.", "La Chambre a tranché."],
  },
  {
    id: 'papineau', name: 'Louis-Joseph Papineau', short: 'PAPINEAU', party: 'PATRIOTE', level: 'HI', qc: true, num: 37,
    title: 'La Tête', color: '#2e8b57',
    look: { skin: '#f0c8ac', suit: '#1e2a22', pants: '#2c2824', tie: '#b02a2a', shirt: '#ffffff', hair: 'quiff', hairColor: '#e9e6df', bow: true },
    spd: 1.0, pow: 1.05, stage: 'plaines',
    special: { name: '92 Résolutions!', type: 'projectile', kind: 'scroll', dmg: 64, hits: 2, speed: 9 },
    super: { name: 'La tête à Papineau!', type: 'drop', kind: 'bighead', dmg: 280 },
    intro: ["Ça prend pas la tête à Papineau pour savoir qui va gagner.", "J'ai 92 résolutions. La première : te planter.", "Patriote un jour, patriote dans ta face."],
    win: ["92 résolutions. La 93e : reste couché.", "Ça prenait la tête à Papineau. Tu l'avais pas.", "Vive la liberté, vive l'uppercut!", "1837, c'était juste l'échauffement."],
  },
  {
    id: 'laurier', name: 'Wilfrid Laurier', short: 'LAURIER', party: 'PLC', level: 'HI', num: 5,
    title: 'Le Conciliateur', color: '#c9a227',
    look: { skin: '#f2cdb4', suit: '#23252e', pants: '#2f3038', tie: '#c9a227', shirt: '#ffffff', hair: 'swept', hairColor: '#f1efe9', bow: true },
    spd: 1.02, pow: 1.0, stage: 'colline',
    special: { name: 'Sunny ways 1895!', type: 'projectile', kind: 'sunny', dmg: 66, speed: 10 },
    super: { name: 'Le XXe siècle!', type: 'drop', kind: 'century', dmg: 275 },
    intro: ["Les voies ensoleillées, c'est MOI. Le petit Trudeau a copié.", "Je suis sur ton billet de 5 $. Montre du respect.", "Faisons un compromis : tu perds."],
    win: ["Le XXe siècle appartient au Canada. Ce combat-là, à moi.", "Un compromis honorable : moi debout, toi couché.", "Rends-moi mon 5 piasses.", "Suivez mon panache blanc... jusqu'au tapis."],
  },
  {
    id: 'duplessis', name: 'Maurice Duplessis', short: 'DUPLESSIS', party: 'UN', level: 'HI', qc: true, num: 36,
    title: 'Le Cheuf', color: '#1f4fa3',
    look: { skin: '#eec3a5', suit: '#20222b', pants: '#1a1c24', tie: '#1f4fa3', shirt: '#ffffff', hair: 'slick', hairColor: '#1e1a18', mustache: '#1e1a18', bigNose: true },
    spd: 0.9, pow: 1.14, stage: 'salonbleu',
    special: { name: 'Loi du cadenas!', type: 'projectile', kind: 'padlock', dmg: 72, speed: 9 },
    super: { name: 'Grande Noirceur!', type: 'beam', kind: 'dark', dmg: 265, hits: 6, dur: 54 },
    intro: ["Le ciel est bleu, l'enfer est rouge... pis ton œil va être noir.", "Toé, tais-toé!", "Un bon frigidaire pour ton comté si tu te couches tout de suite."],
    win: ["Les évêques mangent dans ma main. Toi, tu manges le plancher.", "Cadenassé.", "Le Cheuf a parlé.", "Tu voulais un pont? T'auras rien pantoute."],
  },
  {
    id: 'levesque', name: 'René Lévesque', short: 'LÉVESQUE', party: 'PQ', level: 'HI', qc: true, num: 76,
    title: 'Ti-Poil', color: '#3b6fd4',
    look: { skin: '#edc3a6', suit: '#4a4f58', pants: '#3c4048', tie: '#3b6fd4', shirt: '#ffffff', hair: 'combover', hairColor: '#8b8279', cig: true },
    spd: 1.08, pow: 0.98, stage: 'salonbleu',
    special: { name: 'Boucane!', type: 'projectile', kind: 'smoke', dmg: 62, hits: 2, speed: 8 },
    super: { name: 'Maîtres chez nous!', type: 'beam', kind: 'bolt', dmg: 270, hits: 6, dur: 54 },
    intro: ["Si je vous ai bien compris... vous voulez une claque.", "On est pas un p'tit peuple. Toi, par contre...", "Attends, j'finis ma cigarette. ...Bon. Viens-t'en."],
    win: ["À la prochaine fois!", "Si je vous ai bien compris, vous êtes en train de dire : ayoye.", "Quelque chose comme un grand K.O.", "Nationalisé."],
  },
  {
    id: 'pet', name: 'Pierre Elliott Trudeau', short: 'P.E. TRUDEAU', party: 'PLC', level: 'HI', num: 68,
    title: 'Le Philosophe', color: '#b3202a', winProp: 'rose',
    look: { skin: '#eac0a0', suit: '#3a3f4a', pants: '#2e323b', tie: '#b3202a', shirt: '#ffffff', hair: 'bald', hairColor: '#5c4a3c', rose: true },
    spd: 1.12, pow: 0.97, stage: 'communes',
    special: { name: 'Pirouette!', type: 'dash', spin: true, dmg: 82, speed: 12, dur: 16 },
    super: { name: 'Just watch me!', type: 'dash', dmg: 250, hits: 5, speed: 17, dur: 26 },
    intro: ["Just watch me.", "La raison avant la passion. Mon poing avant ta face.", "Jusqu'où j'irais? Regarde-moi ben aller."],
    win: ["Fuddle duddle.", "*pirouette derrière ton dos*", "Finies les folies.", "Bienvenue dans les années 80."],
  },
  {
    id: 'chretien', name: 'Jean Chrétien', short: 'CHRÉTIEN', party: 'PLC', level: 'HI', num: 93,
    title: 'Le p\'tit gars de Shawinigan', color: '#d0312d', winProp: 'pepper',
    look: { skin: '#eec4a8', suit: '#262b3a', pants: '#1e2230', tie: '#d0312d', shirt: '#ffffff', hair: 'short', hairColor: '#a9a39b', crooked: true },
    spd: 1.0, pow: 1.08, stage: 'communes',
    special: { name: 'Poivre!', type: 'projectile', kind: 'pepper', dmg: 66, speed: 10.5 },
    super: { name: 'Poignée de Shawinigan!', type: 'dash', prop: 'choke', dmg: 265, hits: 3, speed: 18, dur: 24 },
    intro: ["Le poivre? Moi, j'le mets dans mon assiette. Toi, j'te mets à terre.", "Le p'tit gars de Shawinigan a un message pour toi.", "Que c'est qu'tu fais dans mon chemin?"],
    win: ["Une preuve, c'est une preuve. Pis quand t'as une bonne preuve, c'est parce qu'elle est prouvée.", "Poignée de main de Shawinigan. Service compris.", "Le plusse meilleur pays au monde!", "Y'était dans mon chemin."],
  },
  {
    id: 'casgrain', name: 'Thérèse Casgrain', short: 'CASGRAIN', party: 'PSD', level: 'HI', qc: true, num: 40,
    title: 'La Suffragette', color: '#8e44ad',
    look: { skin: '#f1cbb3', suit: '#4b2a5e', pants: '#35203f', tie: null, top: '#e9e1ef', shirt: '#e9e1ef', hair: 'bun', hairColor: '#7d7068', lips: '#a8324a', pearls: true },
    spd: 1.1, pow: 0.96, stage: 'plaines',
    special: { name: 'Droit de vote!', type: 'projectile', kind: 'vote', dmg: 64, speed: 11 },
    super: { name: 'Suffrage universel!', type: 'rain', kind: 'vote', dmg: 270, count: 9 },
    intro: ["Le droit de vote, on l'a arraché. Ta dent aussi, ça s'en vient.", "Quatorze ans à cogner à la porte du Parlement. Je cogne fort.", "Ces messieurs ont dit non. Regarde-les aujourd'hui."],
    win: ["1940 : les femmes votent. Résultat unanime : t'es K.O.", "On ne naît pas championne, on le devient.", "Retourne à tes chaudrons, mon grand.", "Le vote est secret. La claque, non."],
  },
];
const ROSTER_BY_ID = Object.fromEntries(ROSTER.map((c) => [c.id, c]));
const PARTY_NAMES = {
  CAQ: 'Coalition Avenir Québec', PQ: 'Parti Québécois', QS: 'Québec solidaire', PCQ: 'Parti conservateur du Québec',
  PLC: 'Parti libéral du Canada', 'L-C': 'Parti libéral-conservateur', 'MÉTIS': 'Nation métisse · Gouv. provisoire', 'RÉF': 'Parti réformiste', PATRIOTE: 'Parti patriote', UN: 'Union nationale', PSD: 'Parti social démocratique', PCC: 'Parti conservateur du Canada', BQ: 'Bloc Québécois', NPD: 'Nouveau Parti démocratique',
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
      if (L.ghost) {
        ctx.fillStyle = '#7dff9a';
        circle(ctx, ex + 2, -3, 2.2);
        ctx.fill();
      }
    }
    if (L.ghost) {
      // cernes de mort-vivant
      ctx.strokeStyle = 'rgba(40,60,45,0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ex, 1, rx + 1, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }
  if (L.ghost) {
    // cicatrice recousue
    ctx.strokeStyle = '#3d4a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -30); ctx.lineTo(-4, -20);
    for (let i = 0; i < 3; i++) { ctx.moveTo(-14 + i * 4, -22 - i * 1); ctx.lineTo(-8 + i * 4, -28 - i * 1); }
    ctx.stroke();
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
  if (L.bigNose) {
    ctx.quadraticCurveTo(54, 8, 42, 17);
    ctx.quadraticCurveTo(33, 19, 28, 12);
  } else {
    ctx.quadraticCurveTo(44, 10, 36, 14);
    ctx.quadraticCurveTo(31, 15, 28, 12);
  }
  ctx.fill();
  ctx.stroke();

  // Bouche
  ctx.lineWidth = 3;
  ctx.strokeStyle = OUT;
  const mx = 20, my = 27;
  if (L.crooked) { ctx.save(); ctx.translate(mx, my); ctx.rotate(0.28); ctx.translate(-mx, -my); }
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

  if (L.crooked) ctx.restore();

  // Pilosité et accessoires
  if (L.mustache) {
    ctx.fillStyle = L.mustache;
    ctx.beginPath();
    ctx.moveTo(6, 22);
    ctx.quadraticCurveTo(24, 10, 40, 21);
    ctx.quadraticCurveTo(24, 21, 6, 26);
    ctx.closePath();
    ctx.fill();
  }
  if (L.sideburns) {
    ctx.fillStyle = L.hairColor;
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-30, -12); ctx.lineTo(-15, -12); ctx.lineTo(-9, 12); ctx.lineTo(0, 30);
    ctx.lineTo(-14, 37); ctx.lineTo(-28, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (L.cig) {
    ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(30, 29); ctx.lineTo(54, 27); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(30, 29); ctx.lineTo(50, 27.3); ctx.stroke();
    ctx.strokeStyle = '#ff7a1a';
    ctx.beginPath(); ctx.moveTo(50, 27.3); ctx.lineTo(54, 27); ctx.stroke();
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const k = ((t * 0.02 + i / 3) % 1);
      ctx.fillStyle = `rgba(220,220,220,${0.5 * (1 - k)})`;
      circle(ctx, 58 + Math.sin(k * 6 + i) * 5, 22 - k * 40, 4 + k * 7);
      ctx.fill();
    }
  }
  if (L.pearls) {
    ctx.fillStyle = '#fdfaf0'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
    circle(ctx, -24, 18, 4); ctx.fill(); ctx.stroke();
  }

  // Cheveux / couvre-chef
  drawHair(ctx, L, t);
  if (L.tuque) {
    ctx.fillStyle = L.tuque;
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, -20);
    ctx.bezierCurveTo(-42, -74, 38, -78, 38, -24);
    ctx.quadraticCurveTo(0, -38, -35, -20);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-34, -21); ctx.quadraticCurveTo(0, -39, 37, -25); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-34, -21); ctx.quadraticCurveTo(0, -39, 37, -25); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
    circle(ctx, -8, -70, 10); ctx.fill(); ctx.stroke();
  }
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
    case 'curly': {
      const pts = [[-34, 10, 12], [-36, -10, 14], [-34, -30, 15], [-22, -46, 15], [-4, -54, 15], [14, -52, 14], [28, -42, 12]];
      for (const [x, y, r] of pts) { circle(ctx, x, y, r); ctx.stroke(); }
      for (const [x, y, r] of pts) { circle(ctx, x, y, r); ctx.fill(); }
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      for (const [x, y, r] of pts) { ctx.beginPath(); ctx.arc(x, y, r * 0.55, Math.PI, Math.PI * 1.8); ctx.stroke(); }
      break;
    }
    case 'quiff': {
      ctx.beginPath();
      ctx.moveTo(-30, 12);
      ctx.bezierCurveTo(-46, -20, -40, -50, -14, -52);
      ctx.bezierCurveTo(-8, -96, 34, -100, 50, -70);
      ctx.quadraticCurveTo(34, -74, 32, -58);
      ctx.quadraticCurveTo(38, -40, 30, -34);
      ctx.quadraticCurveTo(12, -42, -4, -34);
      ctx.quadraticCurveTo(-16, -24, -16, -2);
      ctx.quadraticCurveTo(-22, 8, -30, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -50); ctx.quadraticCurveTo(4, -84, 36, -76);
      ctx.moveTo(4, -44); ctx.quadraticCurveTo(10, -70, 30, -64);
      ctx.stroke();
      break;
    }
    case 'combover': {
      ctx.beginPath();
      ctx.moveTo(-31, -8);
      ctx.bezierCurveTo(-36, -30, -26, -40, -14, -42);
      ctx.bezierCurveTo(-20, -30, -18, -18, -16, -6);
      ctx.quadraticCurveTo(-22, 4, -31, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = L.hairColor;
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-22, -40 + i * 3);
        ctx.quadraticCurveTo(2, -62 + i * 5, 30 - i * 2, -40 + i * 2);
        ctx.stroke();
      }
      break;
    }
    case 'bun': {
      circle(ctx, -36, -34, 15); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-32, 6);
      ctx.bezierCurveTo(-44, -46, -4, -68, 28, -44);
      ctx.quadraticCurveTo(38, -32, 35, -20);
      ctx.quadraticCurveTo(16, -38, -2, -30);
      ctx.quadraticCurveTo(-16, -20, -18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-24, -40); ctx.quadraticCurveTo(0, -56, 24, -40);
      ctx.moveTo(-28, -26); ctx.quadraticCurveTo(-10, -44, 8, -40);
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
  if (L.jersey || L.plaid) {
    ctx.save();
    ctx.clip();
    if (L.jersey) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(-32, -14, 64, 9);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(-32, -3, 64, 5);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.moveTo(-2, -79); ctx.lineTo(10, -64); ctx.lineTo(22, -79); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      for (let x = -30; x < 30; x += 13) ctx.fillRect(x, -82, 5, 92);
      for (let y = -74; y < 8; y += 13) ctx.fillRect(-32, y, 64, 5);
      ctx.fillStyle = '#f3e9d2';
      for (let y = -66; y < 0; y += 15) { circle(ctx, 12, y, 2.5); ctx.fill(); }
    }
    ctx.restore();
    if (L.jersey) text(ctx, String(c.num === undefined ? 1 : c.num), 2, -42, 30, '#fff', { lw: 5 });
  } else {
  if (L.tattered) {
    // veston en lambeaux, troué, plein de terre
    ctx.fillStyle = '#141414';
    ctx.beginPath();
    for (const [x, d] of [[-16, 10], [-4, 14], [8, 9], [18, 13]]) { ctx.moveTo(x - 5, 7); ctx.lineTo(x, 7 - d); ctx.lineTo(x + 5, 7); }
    ctx.fill();
    ctx.fillStyle = 'rgba(120,100,70,0.45)';
    ellipse(ctx, -12, -24, 6, 4, 0.4); ctx.fill();
    ellipse(ctx, 16, -50, 4, 3, -0.3); ctx.fill();
    ctx.fillStyle = '#0d0f0d';
    ellipse(ctx, -14, -46, 4, 5, 0.2); ctx.fill();
  }
  // chemise / haut
  ctx.fillStyle = L.top || L.shirt;
  ctx.beginPath();
  ctx.moveTo(-2, -76);
  ctx.lineTo(22, -76);
  ctx.lineTo(12, -38);
  ctx.closePath();
  ctx.fill();
  if (L.bow) {
    ctx.fillStyle = L.tie || '#222';
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(11, -70); ctx.lineTo(1, -77); ctx.lineTo(1, -62); ctx.closePath();
    ctx.moveTo(11, -70); ctx.lineTo(21, -77); ctx.lineTo(21, -62); ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (L.tie) {
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
  if (L.rose) {
    ctx.fillStyle = '#d7263d'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 1.5;
    circle(ctx, -8, -56, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-8, -56, 3, 0, Math.PI * 1.4); ctx.stroke();
  }
  if (L.sash) {
    ctx.save();
    const cols = ['#c0392b', '#f1c40f', '#2e86c1', '#27ae60', '#c0392b'];
    cols.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(-23, -6 + i * 2.6, 47, 2.6); });
    ctx.strokeStyle = '#141414'; ctx.lineWidth = 2; ctx.strokeRect(-23, -6, 47, 13);
    cols.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(-22 + i * 3, 7, 3, 22); });
    ctx.restore();
  }
  }
  // épinglette du parti
  if (!L.jersey && !L.plaid && !L.rose) {
    ctx.fillStyle = c.color;
    circle(ctx, -8, -56, 4); ctx.fill();
  }
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
  if (L.noose) drawNoose(ctx, nx, ny, headX, headY, t);

  // bras avant (+ accessoire)
  const k = drawArm(fs, P.fH, false);
  if (prop) drawProp(ctx, prop, k.ex, k.ey, Math.atan2(k.ey - k.jy, k.ex - k.jx), c);
}

// Corde de pendu cassée, autour du cou (tenue « Revenant »)
function drawNoose(ctx, nx, ny, hx, hy, t) {
  const cx = (nx + hx) / 2 + 2, cy = ny + (hy + 26 - ny) * 0.45;
  const rope = (draw, w) => {
    ctx.strokeStyle = '#141414'; ctx.lineWidth = w + 4; draw(); ctx.stroke();
    ctx.strokeStyle = '#a8834a'; ctx.lineWidth = w; draw(); ctx.stroke();
  };
  // nœud coulant autour du cou
  rope(() => { ctx.beginPath(); ctx.ellipse(cx, cy, 13, 5, -0.2, 0, Math.PI * 2); }, 5);
  // gros nœud enroulé derrière la nuque
  ctx.fillStyle = '#a8834a';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cx - 22, cy - 6, 12, 26, 4);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#6e5228';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) { ctx.moveTo(cx - 22, cy - 1 + i * 6); ctx.lineTo(cx - 10, cy + 1 + i * 6); }
  ctx.stroke();
  // bout de corde cassé qui pend et se balance
  const sw = Math.sin(t * 0.08) * 6;
  const ex = cx - 18 + sw, ey = cy + 58;
  rope(() => { ctx.beginPath(); ctx.moveTo(cx - 16, cy + 20); ctx.quadraticCurveTo(cx - 20, cy + 40, ex, ey); }, 5);
  // bout effiloché
  ctx.strokeStyle = '#c9a66a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = -2; i <= 2; i++) { ctx.moveTo(ex, ey); ctx.lineTo(ex + i * 3, ey + 9 + Math.abs(i)); }
  ctx.stroke();
}

// Feux follets verts qui flottent autour du revenant
function drawWisps(ctx, x, y, t, seed) {
  for (let i = 0; i < 5; i++) {
    const a = t * 0.03 + i * 1.26 + seed;
    const wx = x + Math.cos(a) * 70, wy = y - 150 + Math.sin(a * 1.7) * 90;
    const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, 14);
    g.addColorStop(0, 'rgba(190,255,200,0.9)');
    g.addColorStop(1, 'rgba(90,255,140,0)');
    ctx.fillStyle = g;
    circle(ctx, wx, wy, 14);
    ctx.fill();
  }
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
  } else if (prop === 'elbow' || prop === 'choke') {
    ctx.fillStyle = 'rgba(255,60,60,0.35)';
    circle(ctx, 0, 0, 30); ctx.fill();
  } else if (prop === 'sash') {
    const cols = ['#c0392b', '#f1c40f', '#2e86c1', '#27ae60'];
    ctx.lineWidth = 5;
    cols.forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, i * 4 - 6);
      ctx.bezierCurveTo(30, -30 + i * 4, 60, 20 + i * 4, 96, -8 + i * 4);
      ctx.stroke();
    });
  } else if (prop === 'apple') {
    ctx.fillStyle = '#d7263d'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
    circle(ctx, 4, -14, 15); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff3d6';
    circle(ctx, 14, -20, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#5a3a1a';
    ctx.beginPath(); ctx.moveTo(4, -28); ctx.lineTo(7, -36); ctx.stroke();
  } else if (prop === 'calc') {
    ctx.fillStyle = '#2b2f3a'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
    roundRect(ctx, -14, -46, 30, 42, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b8e0a8'; ctx.fillRect(-10, -42, 22, 10);
    ctx.fillStyle = '#ddd';
    for (let i = 0; i < 9; i++) ctx.fillRect(-10 + (i % 3) * 8, -28 + Math.floor(i / 3) * 7, 6, 5);
  } else if (prop === 'drinkbox') {
    ctx.fillStyle = '#7fc8f8'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
    ctx.fillRect(-10, -40, 24, 34); ctx.strokeRect(-10, -40, 24, 34);
    ctx.fillStyle = '#fff'; ctx.fillRect(-10, -28, 24, 10);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(8, -40); ctx.lineTo(8, -52); ctx.lineTo(16, -58); ctx.stroke();
  } else if (prop === 'rose') {
    ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(2, -30); ctx.stroke();
    ctx.fillStyle = '#d7263d'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 2.5;
    circle(ctx, 2, -36, 11); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(2, -36, 5, 0, Math.PI * 1.5); ctx.stroke();
  } else if (prop === 'bottle') {
    ctx.fillStyle = '#3f7d4f'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
    roundRect(ctx, -8, -36, 18, 34, 4); ctx.fill(); ctx.stroke();
    ctx.fillRect(-3, -50, 8, 16); ctx.strokeRect(-3, -50, 8, 16);
    ctx.fillStyle = '#f3e9d2'; ctx.fillRect(-8, -26, 18, 12);
  } else if (prop === 'pepper') {
    ctx.fillStyle = '#3a3a3a'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
    roundRect(ctx, -9, -40, 20, 36, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c9ccd1'; ctx.fillRect(-9, -44, 20, 8); ctx.strokeRect(-9, -44, 20, 8);
    text(ctx, 'P', 1, -20, 18, '#fff', { stroke: false });
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
    case 'bloc':
    case 'century':
    case 'bighead': {
      // ombre d'avertissement
      ctx.restore();
      ctx.save();
      const a = clamp((p.y + 200) / (GROUND), 0.15, 0.6);
      ctx.fillStyle = `rgba(0,0,0,${a})`;
      ellipse(ctx, p.x, GROUND + 4, p.w * 0.55 * a * 1.6, 14);
      ctx.fill();
      ctx.translate(p.x, p.y);
      if (p.kind === 'bighead') {
        ctx.scale(2.7, 2.7);
        ctx.translate(-4, 4);
        drawHead(ctx, ROSTER_BY_ID.papineau, 'angry', t);
        break;
      }
      ctx.fillStyle = p.kind === 'century' ? '#b9965a' : '#8e8e8a';
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
      if (p.kind === 'century') text(ctx, 'XXe', 0, 0, 70, '#fff3c4');
      else text(ctx, 'BLOC', 0, 0, 56, '#2fb4d4');
      break;
    }
    case 'bottle': {
      ctx.rotate(p.rot);
      drawProp(ctx, 'bottle', 0, 24, 0, null);
      break;
    }
    case 'pepper': {
      ctx.rotate(p.rot);
      drawProp(ctx, 'pepper', 0, 22, 0, null);
      ctx.fillStyle = 'rgba(40,40,40,0.7)';
      for (let i = 0; i < 6; i++) { circle(ctx, rand(-30, 30), rand(-34, 34), 2); ctx.fill(); }
      break;
    }
    case 'train':
    case 'bison':
    case 'lafontaine': {
      ctx.scale(dir, 1);
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = `rgba(160,140,110,${0.5 - i * 0.07})`;
        circle(ctx, -p.w / 2 - i * 18, p.hh / 2 - 10 - (i % 2) * 8, 16 - i); ctx.fill();
      }
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 4;
      if (p.kind === 'train') {
        ctx.fillStyle = '#2b2b30';
        roundRect(ctx, -110, -30, 170, 60, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#8c1c1c';
        ctx.fillRect(-110, -62, 70, 40); ctx.strokeRect(-110, -62, 70, 40);
        ctx.fillStyle = '#ffe9a8'; ctx.fillRect(-96, -52, 40, 18);
        ctx.fillStyle = '#2b2b30';
        ctx.fillRect(20, -62, 22, 34); ctx.strokeRect(20, -62, 22, 34);
        ctx.fillStyle = '#c0392b';
        ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(112, 44); ctx.lineTo(60, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = `rgba(230,230,230,${0.7 - i * 0.15})`;
          circle(ctx, 30 - i * 26, -84 - i * 14 - Math.sin(t * 0.3 + i) * 4, 14 + i * 5); ctx.fill();
        }
        ctx.fillStyle = '#555';
        for (let i = 0; i < 4; i++) {
          ctx.save(); ctx.translate(-84 + i * 44, 36); ctx.rotate(t * 0.4);
          circle(ctx, 0, 0, 17); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(17, 0); ctx.moveTo(0, -17); ctx.lineTo(0, 17); ctx.stroke();
          ctx.restore();
        }
        text(ctx, 'C.P.', -30, 0, 30, '#ffd23f');
      } else if (p.kind === 'bison') {
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(-90 + i * 80, 14 - Math.abs(Math.sin(t * 0.35 + i * 1.3)) * 14);
          ctx.fillStyle = '#4a3323';
          ellipse(ctx, -8, 0, 40, 26); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#2f2016';
          ellipse(ctx, 22, -12, 26, 28); ctx.fill(); ctx.stroke();
          circle(ctx, 40, 6, 16); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#e9dfc8'; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(40, -12, 10, Math.PI, Math.PI * 1.7); ctx.stroke();
          ctx.strokeStyle = '#141414'; ctx.lineWidth = 4;
          ctx.fillStyle = '#fff'; circle(ctx, 46, 2, 3); ctx.fill();
          ctx.fillStyle = '#2f2016';
          const l = Math.sin(t * 0.5 + i) * 8;
          ctx.fillRect(-30 + l, 20, 9, 22); ctx.fillRect(10 - l, 20, 9, 22);
          ctx.restore();
        }
      } else {
        // Louis-Hippolyte LaFontaine fonce à la rescousse
        const bob = Math.abs(Math.sin(t * 0.5)) * 8;
        ctx.fillStyle = '#1f2a25';
        roundRect(ctx, -34, -30 - bob, 60, 84, 12); ctx.fill(); ctx.stroke();
        ctx.fillRect(-28 + Math.sin(t * 0.5) * 10, 46 - bob, 16, 30);
        ctx.fillRect(4 - Math.sin(t * 0.5) * 10, 46 - bob, 16, 30);
        seg(ctx, 10, -10 - bob, 62, -4 - bob, 15, '#1f2a25');
        ctx.fillStyle = '#f0c8ac'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
        circle(ctx, 66, -4 - bob, 11); ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.translate(0, -66 - bob);
        drawHead(ctx, { look: { skin: '#f0c8ac', hair: 'swept', hairColor: '#3a2d24', sideburns: true } }, 'angry', t);
        ctx.restore();
        text(ctx, 'LAFONTAINE!', 0, -140 - bob, 22, '#9be0b4');
      }
      break;
    }
    case 'scroll': {
      ctx.rotate(Math.sin(t * 0.3) * 0.2);
      ctx.fillStyle = '#f3e9d2'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
      ctx.fillRect(-28, -22, 56, 44); ctx.strokeRect(-28, -22, 56, 44);
      ctx.fillStyle = '#d9c9a3';
      roundRect(ctx, -34, -28, 68, 10, 5); ctx.fill(); ctx.stroke();
      roundRect(ctx, -34, 18, 68, 10, 5); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#6b5b45'; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-20, -10 + i * 7); ctx.lineTo(20 - (i % 2) * 10, -10 + i * 7); ctx.stroke(); }
      ctx.fillStyle = '#b02a2a'; circle(ctx, 18, 12, 6); ctx.fill();
      break;
    }
    case 'sunny': {
      ctx.rotate(t * 0.15);
      ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
      for (let i = 0; i < 10; i++) {
        ctx.rotate(Math.PI / 5);
        ctx.beginPath(); ctx.moveTo(22, -6); ctx.lineTo(38, 0); ctx.lineTo(22, 6); ctx.closePath(); ctx.fill();
      }
      circle(ctx, 0, 0, 24); ctx.fill(); ctx.stroke();
      ctx.rotate(-t * 0.15);
      // moustache et monocle d'époque
      ctx.fillStyle = '#141414';
      circle(ctx, -8, -5, 3); ctx.fill(); circle(ctx, 8, -5, 3); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -5, 7, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-12, 8); ctx.quadraticCurveTo(0, 2, 12, 8); ctx.quadraticCurveTo(0, 10, -12, 8); ctx.fill();
      break;
    }
    case 'padlock': {
      ctx.rotate(Math.sin(t * 0.3) * 0.2);
      ctx.strokeStyle = '#141414'; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(0, -10, 16, Math.PI, 0); ctx.stroke();
      ctx.strokeStyle = '#b8bcc4'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, -10, 16, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = '#d4a017'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
      roundRect(ctx, -24, -10, 48, 40, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#141414'; circle(ctx, 0, 6, 5); ctx.fill(); ctx.fillRect(-2, 6, 4, 12);
      break;
    }
    case 'smoke': {
      for (let i = 0; i < 6; i++) {
        const a2 = t * 0.1 + i;
        ctx.fillStyle = `rgba(${200 + i * 6},${200 + i * 6},${205 + i * 6},0.75)`;
        circle(ctx, Math.cos(a2) * 18 + (i - 3) * 6, Math.sin(a2 * 1.3) * 16, 18 + (i % 3) * 5);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(90,90,90,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 30, 0.4, 2.2); ctx.stroke();
      break;
    }
    case 'vote': {
      ctx.rotate(Math.sin(t * 0.3 + p.x * 0.01) * 0.25);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
      ctx.fillRect(-30, -22, 60, 44); ctx.strokeRect(-30, -22, 60, 44);
      ctx.strokeRect(-22, -10, 20, 20);
      ctx.strokeStyle = '#8e44ad'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-19, 0); ctx.lineTo(-13, 7); ctx.lineTo(-3, -9); ctx.stroke();
      text(ctx, 'VOTE', 13, 0, 17, '#8e44ad', { stroke: false });
      break;
    }
    case 'castor': {
      ctx.scale(dir * 1.5, 1.5);
      ctx.translate(0, -Math.abs(Math.sin(t * 0.4)) * 8);
      drawItemIcon(ctx, 'castor', t);
      break;
    }
    case 'puck': {
      for (let i = 1; i < 5; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.35 - i * 0.07})`;
        ctx.fillRect(-dir * i * 22 - 14, -3, 28, 6);
      }
      drawItemIcon(ctx, 'rondelle', t);
      break;
    }
    case 'bball': {
      ctx.rotate(p.rot);
      drawItemIcon(ctx, 'basket', t);
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
      const pal = {
        sun: ['255,170,0', '255,220,60', '255,255,220'],
        dark: ['20,0,40', '50,20,90', '10,5,20'],
        bolt: ['0,120,255', '90,200,255', '240,250,255'],
      }[p.style || 'sun'];
      const g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
      g.addColorStop(0, `rgba(${pal[0]},0)`);
      g.addColorStop(0.3, `rgba(${pal[1]},${0.8 * fade})`);
      g.addColorStop(0.5, `rgba(${pal[2]},${fade})`);
      g.addColorStop(0.7, `rgba(${pal[1]},${0.8 * fade})`);
      g.addColorStop(1, `rgba(${pal[0]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(r.x, r.y + Math.sin(t) * 3, r.w, r.h);
      if (p.style === 'bolt') {
        ctx.strokeStyle = `rgba(255,255,255,${fade})`;
        ctx.lineWidth = 4;
        for (let k = 0; k < 2; k++) {
          ctx.beginPath();
          ctx.moveTo(r.x, r.y + r.h / 2);
          for (let x = r.x; x <= r.x + r.w; x += 40) ctx.lineTo(x, r.y + r.h / 2 + rand(-34, 34));
          ctx.stroke();
        }
      }
      const sx = dir < 0 ? r.x + r.w : r.x;
      ctx.translate(sx, r.y + r.h / 2);
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 4;
      if (p.style === 'dark') {
        ctx.fillStyle = '#16102a';
        circle(ctx, 0, 0, 46); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e9e4c8';
        circle(ctx, 0, 0, 26); ctx.fill();
        ctx.fillStyle = '#16102a';
        circle(ctx, 11, -6, 23); ctx.fill();
      } else if (p.style === 'bolt') {
        ctx.fillStyle = '#ffd23f';
        circle(ctx, 0, 0, 44); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0a4ea2';
        ctx.beginPath();
        ctx.moveTo(6, -32); ctx.lineTo(-18, 4); ctx.lineTo(-2, 4); ctx.lineTo(-8, 32); ctx.lineTo(18, -6); ctx.lineTo(2, -6);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        // soleil souriant à la source
        ctx.rotate(t * 0.1);
        ctx.fillStyle = '#ffd23f';
        for (let i = 0; i < 12; i++) {
          ctx.rotate(Math.PI / 6);
          ctx.beginPath(); ctx.moveTo(40, -8); ctx.lineTo(66, 0); ctx.lineTo(40, 8); ctx.fill();
        }
        circle(ctx, 0, 0, 42);
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-t * 0.1);
        ctx.fillStyle = '#141414';
        circle(ctx, -14, -8, 5); ctx.fill();
        circle(ctx, 14, -8, 5); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 4, 20, 0.2, Math.PI - 0.2); ctx.stroke();
      }
      break;
    }
  }
  ctx.restore();
}
