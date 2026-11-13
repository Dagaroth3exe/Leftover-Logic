// Order matches the prompt in backend/recipes.js: Indian, Italian, Chinese.
// Flat, food-coloured surfaces; text on them is always ink.
export const CUISINES = [
  {
    id: "indian",
    name: "Indian",
    emoji: "🍛",
    tagline: "slow-simmered & spiced",
    color: "#F5C84C", // marigold
    blob: "58% 42% 52% 48% / 46% 54% 46% 54%",
  },
  {
    id: "italian",
    name: "Italian",
    emoji: "🍝",
    tagline: "simple, fresh, honest",
    color: "#F39A7F", // tomato
    blob: "44% 56% 40% 60% / 56% 44% 56% 44%",
  },
  {
    id: "chinese",
    name: "Chinese",
    emoji: "🥡",
    tagline: "hot wok, quick toss",
    color: "#A9D6C3", // celadon
    blob: "50% 50% 62% 38% / 42% 58% 42% 58%",
  },
];

const MAGNET_COLORS = ["#F5C84C", "#F39A7F", "#A9D6C3", "#BFC8F5", "#F4B8CC", "#D9E58A"];

function hash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Stable pseudo-random tilt in degrees, so a word always sits at the same angle. */
export const tiltFor = (str, max = 4) => ((hash(str) % (max * 20 + 1)) / 10 - max).toFixed(1);

export const magnetColor = (str) => MAGNET_COLORS[hash(str) % MAGNET_COLORS.length];
