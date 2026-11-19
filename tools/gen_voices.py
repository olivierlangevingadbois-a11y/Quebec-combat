#!/usr/bin/env python3
"""Génère les répliques vocales du jeu avec Piper (synthèse vocale neuronale, gratuite et libre).

Prérequis :
  pip install piper-tts        (+ ffmpeg avec libmp3lame)
  Voix françaises Piper (licences libres) dans un dossier, p. ex. ./voices :
    https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR
    fr_FR-tom-medium, fr_FR-upmc-medium, fr_FR-gilles-low, fr_FR-siwis-medium (.onnx + .onnx.json)

Usage : python3 tools/gen_voices.py ./voices [id1 id2 ...]
Les fichiers .mp3 sont écrits dans audio/voix/<personnage>/.
"""
import json, os, re, subprocess, sys, tempfile, wave
from piper import PiperVoice
from piper.config import SynthesisConfig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'voix')
VOICE_DIR = sys.argv[1] if len(sys.argv) > 1 else 'voices'
ONLY = set(sys.argv[2:])
MODELS = {'tom': 'fr_FR-tom-medium', 'upmc': 'fr_FR-upmc-medium', 'gilles': 'fr_FR-gilles-low', 'siwis': 'fr_FR-siwis-medium'}

# (voix, locuteur, vitesse [>1 = plus lent], hauteur [<1 = plus grave], effet)
CAST = {
    'legault':   ('tom', None, 0.88, 1.07, 'clean'),      # débit rapide, voix un peu nasillarde
    'pspp':      ('upmc', 1, 0.95, 1.00, 'clean'),        # articulé, posé
    'ghazal':    ('siwis', None, 0.92, 0.97, 'clean'),
    'duhaime':   ('gilles', None, 0.84, 1.04, 'radio'),   # animateur de radio
    'carney':    ('tom', None, 1.08, 0.90, 'clean'),      # lent, grave, banquier
    'poilievre': ('upmc', 1, 0.84, 1.08, 'clean'),        # mitraillette à slogans
    'blanchet':  ('gilles', None, 1.12, 0.93, 'clean'),   # pince-sans-rire
    'singh':     ('tom', None, 0.94, 1.10, 'clean'),
    'trudeau':   ('upmc', 1, 1.14, 1.04, 'clean'),        # ... longues ... pauses
    'macdonald': ('gilles', None, 1.2, 0.87, 'archive'),  # vieux cylindre de cire, un peu pompette
    'riel':      ('tom', None, 1.04, 0.93, 'archive'),
    'riel-revenant': ('tom', None, 1.12, 0.88, 'ghost'),     # revenant d'outre-tombe
    'baldwin':   ('tom', None, 1.05, 0.98, 'archive'),
    'papineau':  ('upmc', 1, 1.0, 0.94, 'archive'),
    'laurier':   ('gilles', None, 1.08, 1.04, 'archive'),
    'duplessis': ('gilles', None, 0.98, 0.90, 'am'),      # radio AM des années 50
    'levesque':  ('tom', None, 0.80, 1.00, 'tv'),         # parlait vite, télé des années 70
    'pet':       ('upmc', 1, 0.98, 0.96, 'tv'),
    'chretien':  ('gilles', None, 0.95, 1.08, 'tv'),
    'casgrain':  ('upmc', 0, 1.05, 0.92, 'archive'),
    'annonceur': ('tom', None, 1.15, 0.90, 'arena'),
}
FX = {
    'clean': 'acompressor=threshold=-18dB:ratio=3',
    'radio': 'highpass=f=320,lowpass=f=3600,acompressor=threshold=-22dB:ratio=6,volume=1.4',
    'am': 'highpass=f=450,lowpass=f=2600,acompressor=threshold=-24dB:ratio=6',
    'tv': 'highpass=f=150,lowpass=f=6500,acompressor=threshold=-18dB:ratio=3',
    'archive': 'highpass=f=280,lowpass=f=3200,acompressor=threshold=-20dB:ratio=4',
    'ghost': 'aecho=0.8:0.6:90|180:0.25|0.15,vibrato=f=4:d=0.1',
    'arena': 'aecho=0.8:0.5:40:0.2,acompressor=threshold=-16dB:ratio=4,volume=1.3',
}
CRACKLE = {'archive': 0.012, 'am': 0.006}

ANNOUNCER = {
    'title': 'Québec Combat!', 'select': 'Choisissez votre politicien!', 'contre': 'contre',
    'round1': 'Ronde un!', 'round2': 'Ronde deux!', 'final': 'Ronde finale!', 'fight': 'Combattez!',
    'ko': 'Kao!', 'time': 'Temps écoulé!', 'perfect': 'Sans faute!', 'draw': 'Égalité!',
    'ending': 'Félicitations! Vous êtes premier ministre de tout!', 'continue': 'Recomptage judiciaire?',
}


def speakable(t):
    """Adapte le texte affiché pour la synthèse vocale."""
    t = re.sub(r'\*[^*]*\*', ' ', t)
    rep = [('K.O.', 'kao'), ('93e', 'quatre-vingt-treizième'), ('3e', 'troisième'), ('XXe', 'vingtième'),
           ('%', ' pour cent'), ('Libârté', 'Libaarté'), ('PDG', 'pédégé'), ('pus', 'pu'), ('...', ', '),
           ('Elbows up', 'Elbôze ope'), ('Canada strong', 'Canada stronng'), ('Fuddle duddle', 'Feudeul deudeul'),
           ('Just watch me', 'Djeust watche mi'), ('AXE THE TAX', 'Axe ze tax'), ('tag team', 'tague tîme'), ('TikTok', 'Tic Toc'), ('John', 'Djone'), ('Macdonaaald', 'Mac Donaaalde'), ('Macdonald', 'Mac Donalde')]
    for a, b in rep:
        t = t.replace(a, b)
    # mots en majuscules -> minuscules (sinon épelés)
    t = re.sub(r"\b([A-ZÀ-Ý]{2,})\b", lambda m: m.group(1).capitalize(), t)
    return re.sub(r'\s+', ' ', t).strip()


def sfx_prefix(t):
    m = re.match(r'\*([^*]*)\*', t)
    if not m:
        return None
    return 'crunch' if 'croque' in m.group(1) else 'whoosh'


_voices = {}
def voice(name):
    if name not in _voices:
        _voices[name] = PiperVoice.load(os.path.join(VOICE_DIR, MODELS[name] + '.onnx'))
    return _voices[name]


def render(text, cast, dest, tmp):
    model, spk, length, pitch, fx = cast
    raw = os.path.join(tmp, 'raw.wav')
    with wave.open(raw, 'wb') as w:
        voice(model).synthesize_wav(speakable(text), w, syn_config=SynthesisConfig(
            speaker_id=spk, length_scale=length, noise_scale=0.7, noise_w_scale=0.85))
    with wave.open(raw, 'rb') as w:
        sr = w.getframerate()  # 22,05 kHz ou 44,1 kHz selon la voix
    chain = f'asetrate={int(sr * pitch)},aresample={sr},atempo={1 / pitch:.4f},{FX[fx]}'
    inputs = ['-i', raw]
    pre = sfx_prefix(text)
    if pre == 'crunch':
        flt = (f'anoisesrc=d=0.12:c=brown:a=0.9,afade=t=out:st=0.02:d=0.1,apad=pad_dur=0.08[c1];'
               f'anoisesrc=d=0.1:c=brown:a=0.7,afade=t=out:st=0.01:d=0.09,apad=pad_dur=0.25[c2];')
        graph = flt + f'[0:a]{chain}[v];[c1][c2][v]concat=n=3:v=0:a=1[o]'
    elif pre == 'whoosh':
        graph = (f'anoisesrc=d=0.35:c=pink:a=0.5,bandpass=f=1500,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.2,apad=pad_dur=0.1[c1];'
                 f'[0:a]{chain}[v];[c1][v]concat=n=2:v=0:a=1[o]')
    elif fx in CRACKLE:
        graph = (f'[0:a]{chain}[v];anoisesrc=c=pink:a={CRACKLE[fx]},highpass=f=1500[n];'
                 f'[v][n]amix=inputs=2:duration=first:normalize=0[o]')
    else:
        graph = f'[0:a]{chain}[o]'
    graph += ';[o]loudnorm=I=-16:TP=-1.5[out]'
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]',
                    '-ac', '1', '-ar', '22050', '-c:a', 'libmp3lame', '-b:a', '48k', dest], check=True)


def main():
    chars = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'dump_lines.js')]))
    jobs = []
    for c in chars:
        cid = c['id']
        if ONLY and cid not in ONLY:
            continue
        for k in ('intro', 'win'):
            for i, t in enumerate(c[k]):
                jobs.append((cid, f'{k}{i}', t))
        jobs.append((cid, 'special', c['special']))
        jobs.append((cid, 'super', c['super']))
        if cid != 'riel-revenant':
            jobs.append(('annonceur', f'nom-{cid}', c['name'] + '!'))
            jobs.append(('annonceur', f'gagne-{cid}', f"{c['name']} l'emporte!"))
    if not ONLY or 'annonceur' in ONLY:
        jobs += [('annonceur', k, t) for k, t in ANNOUNCER.items()]
    with tempfile.TemporaryDirectory() as tmp:
        for n, (cid, key, t) in enumerate(jobs):
            render(t, CAST[cid], os.path.join(OUT, cid, key + '.mp3'), tmp)
            print(f'[{n + 1}/{len(jobs)}] {cid}/{key}: {speakable(t)}', flush=True)


if __name__ == '__main__':
    main()
