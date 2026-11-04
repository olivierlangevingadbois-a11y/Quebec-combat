'use strict';
// ---------- Sons synthétisés (Web Audio) + musique chiptune + annonceur ----------
const Sfx = (() => {
  let ac = null, master = null, musicGain = null;
  let enabled = true, musicOn = true, voiceOn = true;
  let noiseBuf = null;

  function init() {
    if (!ac) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        master = ac.createGain();
        master.gain.value = 0.32;
        master.connect(ac.destination);
        musicGain = ac.createGain();
        musicGain.gain.value = 0.22;
        musicGain.connect(master);
        noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) {
        ac = null;
      }
    }
    if (ac && ac.state === 'suspended') ac.resume();
  }

  function tone(freq, dur, type = 'square', vol = 0.3, slide = 1, when = 0, dest = null) {
    if (!ac || !enabled) return;
    const t0 = ac.currentTime + when;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide !== 1) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g);
    g.connect(dest || master);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol = 0.4, freq = 1500, q = 1, when = 0) {
    if (!ac || !enabled) return;
    const t0 = ac.currentTime + when;
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t0, Math.random() * 0.5);
    s.stop(t0 + dur + 0.02);
  }

  // ----- Musique : petite boucle chiptune en la mineur -----
  const BPM = 148;
  const step = 60 / BPM / 4; // double-croche
  const bassLine = [45, 45, 57, 45, 43, 43, 55, 43, 41, 41, 53, 41, 43, 43, 55, 47];
  const lead = [
    69, 0, 72, 0, 76, 0, 74, 72, 71, 0, 67, 0, 71, 72, 74, 0,
    72, 0, 69, 0, 65, 0, 69, 72, 71, 0, 74, 0, 79, 0, 76, 0,
  ];
  let nextNote = 0, stepIdx = 0, musicPlaying = false, tune = 0;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function startMusic(variant = 0) {
    tune = variant;
    if (!ac) return;
    musicPlaying = true;
    nextNote = ac.currentTime + 0.05;
    stepIdx = 0;
  }
  function stopMusic() {
    musicPlaying = false;
  }
  function tickMusic() {
    if (!ac || !musicPlaying || !musicOn || !enabled) return;
    while (nextNote < ac.currentTime + 0.12) {
      const i = stepIdx;
      const tr = tune === 1 ? 2 : tune === 2 ? -2 : 0;
      if (i % 2 === 0) {
        const b = bassLine[(i >> 1) % bassLine.length] + tr;
        toneAt(mtof(b), step * 1.8, 'triangle', 0.5, nextNote);
      }
      const l = lead[i % lead.length];
      if (l && (tune !== 0 || Math.floor(i / 32) % 2 === 1)) toneAt(mtof(l + tr), step * 0.9, 'square', 0.12, nextNote);
      if (i % 4 === 0) noiseAt(0.05, 0.25, 6000, nextNote);
      if (i % 8 === 4) noiseAt(0.12, 0.35, 1800, nextNote);
      nextNote += step;
      stepIdx++;
    }
  }
  function toneAt(freq, dur, type, vol, t0) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g);
    g.connect(musicGain);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  function noiseAt(dur, vol, freq, t0) {
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    s.connect(f);
    f.connect(g);
    g.connect(musicGain);
    s.start(t0, Math.random() * 0.5);
    s.stop(t0 + dur + 0.02);
  }

  // ----- Annonceur (synthèse vocale du navigateur) -----
  let voice = null;
  function findVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices();
    return vs.find((v) => v.lang === 'fr-CA') || vs.find((v) => v.lang && v.lang.startsWith('fr')) || null;
  }
  function say(str, rate = 1.05, pitch = 0.8) {
    if (!enabled || !voiceOn || !('speechSynthesis' in window)) return;
    try {
      if (!voice) voice = findVoice();
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(str);
      u.lang = 'fr-CA';
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = pitch;
      u.volume = 0.9;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  return {
    init, say, startMusic, stopMusic, tickMusic,
    get enabled() { return enabled; },
    set enabled(v) { enabled = v; if (!v && 'speechSynthesis' in window) speechSynthesis.cancel(); },
    get music() { return musicOn; },
    set music(v) { musicOn = v; },
    get voice() { return voiceOn; },
    set voice(v) { voiceOn = v; },
    hit(heavy) { noise(heavy ? 0.18 : 0.1, heavy ? 0.9 : 0.6, heavy ? 700 : 1400, 0.8); tone(heavy ? 85 : 150, heavy ? 0.22 : 0.12, 'sine', 0.7, 0.45); },
    block() { tone(1300, 0.05, 'square', 0.12); noise(0.06, 0.3, 4200, 2); },
    whoosh() { noise(0.09, 0.18, 2600, 1.5); },
    special() { tone(260, 0.28, 'sawtooth', 0.16, 3); noise(0.2, 0.2, 3000, 1); },
    superStart() { tone(110, 0.8, 'sawtooth', 0.22, 6); tone(660, 0.6, 'square', 0.08, 0.5); noise(0.5, 0.3, 900, 0.6); },
    boom() { noise(0.6, 0.9, 300, 0.5); tone(60, 0.5, 'sine', 0.8, 0.4); },
    ko() { tone(440, 1.1, 'sawtooth', 0.25, 0.12); noise(0.8, 0.5, 500, 0.5); },
    select() { tone(880, 0.05, 'square', 0.12); },
    confirm() { tone(660, 0.08, 'square', 0.18); tone(990, 0.12, 'square', 0.18, 1, 0.07); },
    back() { tone(330, 0.1, 'square', 0.15, 0.7); },
    jump() { tone(280, 0.12, 'sine', 0.15, 2); },
    land() { noise(0.06, 0.2, 400, 1); },
  };
})();
