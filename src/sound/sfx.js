// Synthesised UI sound effects (Web Audio API): no audio files to load or license.
//
// Aesthetic: every sound is a variant of one crisp, tactile "snap" (a sharp
// transient plus a tiny resonant body), varied by pitch, weight, brightness and
// how many snaps play in a row. Pitched snaps stay inside D major pentatonic so
// anything that overlaps is consonant. A touch of room reverb, no pitch slides.
//
// Browsers only allow audio after a user gesture, so the AudioContext is created
// on the first pointerdown/keydown (see installGlobalSfx). Until then every call
// is a silent no-op. The on/off preference persists in localStorage.

const STORAGE_KEY = "leftover-logic:sound";
const VOLUME_KEY = "leftover-logic:volume";
const DEFAULT_VOLUME = 0.7;
// Mix level feeding the limiter (what the sounds were balanced at).
const MIX_GAIN = 0.82;

let enabled = readPref();
let volume = readVolume();
const listeners = new Set();
const loops = new Set();
let ctx = null;
let master = null; // dry bus
let output = null; // user volume, after the limiter
let room = null; // reverb send
let noiseBuf = null;
let lastHoverAt = 0;

function readPref() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function readVolume() {
  try {
    const v = parseFloat(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
}

// The user's volume is applied AFTER the limiter, so the limiter's automatic makeup
// gain can't flatten it. Squared for a perceptual curve; the default 70% = 1.0 (unity),
// 100% ≈ +6 dB, 30% ≈ -15 dB.
const outputLevel = () => (volume / DEFAULT_VOLUME) ** 2;

export const isSoundOn = () => enabled;
export const getVolume = () => volume;

/** Set volume from 0 to 1. Applies immediately (smoothly) and persists. */
export function setVolume(v) {
  volume = Math.min(1, Math.max(0, v));
  try {
    localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    /* ignore */
  }
  if (ctx && output) output.gain.setTargetAtTime(outputLevel(), ctx.currentTime, 0.03);
  listeners.forEach((l) => l());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSoundOn(on) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable: preference lasts for this visit only */
  }
  if (!on) [...loops].forEach((l) => l.stop());
  listeners.forEach((l) => l());
  if (on) {
    unlock();
    play("check", { step: 0 });
  }
}

/** A short, dark, stereo room: exponentially decaying noise. */
function roomImpulse(c, seconds = 1.4, decay = 3.2) {
  const length = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, length, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buf;
}

function softClipCurve(knee = 0.7, size = 2048) {
  const curve = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const x = (i / (size - 1)) * 2 - 1;
    const a = Math.abs(x);
    curve[i] = a <= knee ? x : Math.sign(x) * (knee + (1 - knee) * Math.tanh((a - knee) / (1 - knee)));
  }
  return curve;
}

/** Create/resume the AudioContext. Must be called from a user gesture. */
export function unlock() {
  if (!enabled) return;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();

    // master → soft high-cut → soft clipper → user volume → speakers; reverb returns into the high-cut.
    const highCut = ctx.createBiquadFilter();
    highCut.type = "lowpass";
    highCut.frequency.value = 8500;
    highCut.Q.value = 0.5;
    // Safety soft-clipper instead of a DynamicsCompressor: Chrome's compressor adds
    // automatic makeup gain and its attack lets the first snap after silence through
    // boosted, which made loudness depend on how recently the last sound played.
    // This curve is perfectly linear below ±0.7 and only rounds off peaks above it.
    const limiter = ctx.createWaveShaper();
    limiter.curve = softClipCurve();
    limiter.oversample = "2x";
    output = ctx.createGain();
    output.gain.value = outputLevel();
    highCut.connect(limiter).connect(output).connect(ctx.destination);

    master = ctx.createGain();
    master.gain.value = MIX_GAIN;
    master.connect(highCut);

    const reverb = ctx.createConvolver();
    reverb.buffer = roomImpulse(ctx);
    const reverbTone = ctx.createBiquadFilter();
    reverbTone.type = "lowpass";
    reverbTone.frequency.value = 3200;
    room = ctx.createGain();
    room.gain.value = 0.55;
    room.connect(reverb).connect(reverbTone).connect(highCut);
  }
  if (ctx.state === "suspended") ctx.resume();
}

function audio() {
  if (!enabled || !ctx || ctx.state === "closed") return null;
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// ---------- primitives ----------

/** Route a node to the dry bus and, optionally, the room. */
function out(c, node, { wet = 0, dest = master }) {
  node.connect(dest);
  if (wet > 0 && dest === master) {
    const send = c.createGain();
    send.gain.value = wet;
    node.connect(send).connect(room);
  }
}

function envelope(param, t, { attack, peak, decay }) {
  param.setValueAtTime(0.0001, t);
  param.exponentialRampToValueAtTime(peak, t + attack);
  param.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

/** A sine partial with a percussive envelope. */
function partial(c, { freq, at = 0, attack = 0.003, decay = 0.3, gain = 0.05, wet = 0, dest }) {
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.frequency.setValueAtTime(freq, t);
  envelope(amp.gain, t, { attack, peak: gain, decay });
  osc.connect(amp);
  out(c, amp, { wet, dest });
  osc.start(t);
  osc.stop(t + attack + decay + 0.05);
}

function whiteNoise(c) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

function noise(c, { at = 0, dur = 0.2, filter = "bandpass", freq = 1000, to, q = 0.7, gain = 0.05, attack = 0.005, wet = 0, dest }) {
  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = whiteNoise(c);
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + attack + dur);
  f.Q.value = q;
  const amp = c.createGain();
  envelope(amp.gain, t, { attack, peak: gain, decay: dur });
  src.connect(f).connect(amp);
  out(c, amp, { wet, dest });
  src.start(t, Math.random() * 1.5);
  src.stop(t + attack + dur + 0.05);
}

// D major pentatonic, from D4 upwards.
const PENTA = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];

/**
 * The core sound: a crisp, tactile snap. Every UI sound is a variant of this.
 *  - crack: a ~3ms high-passed noise burst (the "click" your ear locks onto)
 *  - body:  a very short resonant band of noise that gives it pitch and material
 *  - thump: an optional low sine for weight (latches, magnets)
 *
 * pitch:  multiplies the body/crack frequencies (1 = neutral)
 * ring:   body decay in seconds (short = plastic click, longer = woodblock "tok")
 * q:      body resonance (low = dry snap, high = clearly pitched)
 * note:   if set, tunes the body to that frequency instead of using pitch
 */
function snap(
  c,
  { at = 0, gain = 0.09, pitch = 1, ring = 0.025, q = 6, note, bright = 1, thump = 0, wet = 0.05, dest } = {}
) {
  const bodyFreq = note ?? 1900 * pitch;
  // crack
  noise(c, { at, dur: 0.003, filter: "highpass", freq: 3800 * bright, q: 0.7, gain: gain * 0.9, attack: 0.0005, wet, dest });
  // body
  noise(c, { at, dur: ring, filter: "bandpass", freq: bodyFreq, q, gain: gain * (q > 12 ? 1.6 : 0.8), attack: 0.0008, wet, dest });
  // tonal tick on top of the body keeps it from sounding like plain noise
  partial(c, { freq: Math.min(bodyFreq * 1.5, 9000), at, attack: 0.0005, decay: Math.min(ring, 0.03), gain: gain * 0.18, wet, dest });
  // weight
  if (thump) partial(c, { freq: 140 * Math.sqrt(pitch), at, attack: 0.001, decay: 0.045, gain: gain * thump, dest });
}

/** A quick run of snaps, e.g. a latch closing or a gas igniter ticking. */
function snaps(c, list) {
  list.forEach((opts) => snap(c, opts));
}

// ---------- the sound palette (all variants of a snap) ----------

const SOUNDS = {
  // The lightest possible tick.
  hover: (c) => snap(c, { gain: 0.035, pitch: 1.7, ring: 0.008, q: 3, bright: 1.3, wet: 0 }),

  // Standard button press: one clean, neutral snap.
  tap: (c) => snap(c, { gain: 0.11, pitch: 1, ring: 0.02 }),

  // Magnet onto the fridge: a weighty snap that "seats" with a second, smaller click.
  stick: (c) =>
    snaps(c, [
      { gain: 0.1, pitch: 0.75, ring: 0.03, thump: 0.9 },
      { at: 0.038, gain: 0.045, pitch: 1.15, ring: 0.012 },
    ]),
  // Pulling it off: the same two clicks, reversed and lighter.
  unstick: (c) =>
    snaps(c, [
      { gain: 0.04, pitch: 1.1, ring: 0.012 },
      { at: 0.032, gain: 0.06, pitch: 1.45, ring: 0.015 },
    ]),

  // Sending the fridge off: three quick snaps stepping up.
  whoosh: (c) =>
    snaps(c, [
      { gain: 0.04, note: PENTA[3], ring: 0.05, q: 18 },
      { at: 0.06, gain: 0.045, note: PENTA[5], ring: 0.05, q: 18 },
      { at: 0.12, gain: 0.052, note: PENTA[8], ring: 0.09, q: 18, wet: 0.12 },
    ]),

  // Sheet closing: a two-snap latch, high then low.
  close: (c) =>
    snaps(c, [
      { gain: 0.05, pitch: 1.3, ring: 0.015 },
      { at: 0.045, gain: 0.07, pitch: 0.8, ring: 0.025, thump: 0.5 },
    ]),

  // A card landing on the table: a dry, papery snap.
  deal: (c) => snap(c, { gain: 0.1, pitch: 1.4, ring: 0.012, q: 2, bright: 1.2 }),

  // Recipes ready: a bright snap with a pitched "tink" that rings a little.
  ding: (c) =>
    snaps(c, [
      { gain: 0.1, note: PENTA[8], ring: 0.18, q: 30, wet: 0.2 },
      { at: 0.09, gain: 0.12, note: PENTA[10], ring: 0.32, q: 34, wet: 0.25 },
    ]),

  // Ticking a step: a pitched woodblock snap that climbs the scale with progress.
  check: (c, { step = 0 } = {}) =>
    snap(c, { gain: 0.12, note: PENTA[Math.min(step, 6) + 3], ring: 0.11, q: 22, thump: 0.25, wet: 0.08 }),
  uncheck: (c, { step = 0 } = {}) =>
    snap(c, { gain: 0.06, note: PENTA[Math.min(step, 6) + 2], ring: 0.04, q: 10 }),

  // Dish complete: a fast run of snaps up the scale, landing on a ringing top note.
  complete: (c) =>
    snaps(c, [
      ...[3, 5, 6, 7].map((n, i) => ({ at: i * 0.055, gain: 0.09, note: PENTA[n], ring: 0.07, q: 22 })),
      { at: 0.24, gain: 0.12, note: PENTA[10], ring: 0.45, q: 36, wet: 0.3 },
    ]),

  // Something went wrong: two low, dull snaps.
  error: (c) =>
    snaps(c, [
      { gain: 0.07, note: 196, ring: 0.06, q: 10, thump: 0.6 },
      { at: 0.12, gain: 0.07, note: 164.81, ring: 0.09, q: 10, thump: 0.6 },
    ]),

  // An ingredient dropping into the pot: a low, wet "tok".
  plop: (c) => snap(c, { gain: 0.07, note: 330, ring: 0.06, q: 14, bright: 0.6, thump: 0.5, wet: 0.1 }),

  // Gas hob: the piezo igniter ticks three times, then the burner catches softly.
  ignite: (c) => {
    snaps(c, [0, 0.09, 0.18].map((at) => ({ at, gain: 0.05, pitch: 2, ring: 0.006, q: 2, bright: 1.4 })));
    noise(c, { at: 0.22, dur: 0.5, filter: "lowpass", freq: 260, to: 800, gain: 0.015, attack: 0.08, wet: 0.1 });
  },

  // Ba-dum-tss for the welcome card's punchline: two low snaps, then a soft hi-hat.
  rimshot: (c) => {
    snaps(c, [
      { gain: 0.08, note: 146.83, ring: 0.07, q: 10, thump: 0.8 },
      { at: 0.13, gain: 0.08, note: 196.0, ring: 0.07, q: 10, thump: 0.8 },
    ]);
    noise(c, { at: 0.3, dur: 0.38, filter: "highpass", freq: 7000, gain: 0.03, attack: 0.002, wet: 0.15 });
  },

  // Each kitchen has its own pitched snap on hover (D5, F#5, A5: a D major triad).
  indian: (c) => snap(c, { gain: 0.1, note: PENTA[5], ring: 0.07, q: 20, wet: 0.08 }),
  italian: (c) => snap(c, { gain: 0.055, note: PENTA[7], ring: 0.07, q: 20, wet: 0.08 }),
  chinese: (c) => snap(c, { gain: 0.055, note: PENTA[8], ring: 0.07, q: 20, wet: 0.08 }),
};

const HOVER_SOUNDS = new Set(["hover", "indian", "italian", "chinese"]);

export function play(name, opts) {
  if (import.meta.env.DEV) (window.__sfx ||= []).push(name);
  const c = audio();
  if (!c || !SOUNDS[name]) return;
  if (HOVER_SOUNDS.has(name)) {
    const now = performance.now();
    if (now - lastHoverAt < 90) return; // don't chatter when sweeping across buttons
    lastHoverAt = now;
  }
  SOUNDS[name](c, opts);
}

/**
 * Start an ambient kitchen loop. Returns a stop function.
 *  - "simmer": faint hiss with occasional low, muffled bubbles (loading screen)
 *  - "sizzle": quiet pan sizzle with fine crackle (cooking mode)
 */
export function startLoop(kind) {
  if (import.meta.env.DEV) (window.__sfx ||= []).push(`loop:${kind}`);
  const c = audio();
  if (!c) return () => {};

  const sizzle = kind === "sizzle";
  const bus = c.createGain();
  const t0 = c.currentTime;
  bus.gain.setValueAtTime(0.0001, t0);
  bus.gain.exponentialRampToValueAtTime(sizzle ? 0.32 : 0.26, t0 + 1.2);
  bus.connect(master);

  const hiss = c.createBufferSource();
  hiss.buffer = whiteNoise(c);
  hiss.loop = true;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = sizzle ? 6000 : 3500;
  band.Q.value = 0.4;
  const hissAmp = c.createGain();
  hissAmp.gain.value = sizzle ? 0.03 : 0.012;
  hiss.connect(band).connect(hissAmp).connect(bus);
  hiss.start();

  const timer = setInterval(
    () => {
      if (c.state !== "running") return;
      if (sizzle) {
        if (Math.random() < 0.5)
          noise(c, {
            dur: 0.008 + Math.random() * 0.02,
            filter: "bandpass",
            freq: 4000 + Math.random() * 4000,
            q: 2,
            gain: 0.04 * Math.random(),
            attack: 0.001,
            dest: bus,
          });
      } else if (Math.random() < 0.35) {
        // Low, muffled "blub": filtered noise, not a rising beep.
        noise(c, {
          dur: 0.05 + Math.random() * 0.05,
          filter: "lowpass",
          freq: 300 + Math.random() * 250,
          q: 4,
          gain: 0.05 + Math.random() * 0.04,
          attack: 0.004,
          dest: bus,
        });
      }
    },
    sizzle ? 80 : 240
  );

  let stopped = false;
  const handle = {
    stop() {
      if (stopped) return;
      stopped = true;
      clearInterval(timer);
      const t = c.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), t);
      bus.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      hiss.stop(t + 0.65);
      loops.delete(handle);
    },
  };
  loops.add(handle);
  return () => handle.stop();
}

/**
 * Wire up gesture unlocking plus default hover/click sounds via event delegation.
 *  - data-sfx="name" on a button/link picks its click sound ("none" to handle it in code)
 *  - data-sfx-hover="name" picks a hover sound and also makes non-buttons hoverable
 */
export function installGlobalSfx() {
  const unlockOnGesture = () => unlock();
  window.addEventListener("pointerdown", unlockOnGesture, true);
  window.addEventListener("keydown", unlockOnGesture, true);

  let lastHovered = null;
  document.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.target.closest?.("[data-sfx-hover], button, a, [role=tab]");
    if (el === lastHovered) return;
    lastHovered = el;
    if (!el || el.disabled || el.dataset.sfxHover === "none") return;
    play(el.dataset.sfxHover || "hover");
  });

  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("button, a");
    if (!el || el.disabled || el.dataset.sfx === "none") return;
    play(el.dataset.sfx || "tap");
  });
}
