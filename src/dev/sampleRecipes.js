// TEMPORARY: sample data for previewing the recipe UI without calling Gemini.
// Only reachable in dev builds (`npm run dev`). Delete this file and the
// `DEV_PREVIEW` bits in Landing.jsx / RecipePage.jsx when no longer needed.

export const SAMPLE_INGREDIENTS = ["paneer", "potato", "peas", "onion"];

export const SAMPLE_RECIPES = [
  {
    cuisine: "Indian",
    title: "Matar Paneer",
    region: "Punjab",
    description: "Soft paneer and sweet green peas simmered in a gently spiced onion-tomato gravy. A weeknight staple across North India.",
    time: "35 min",
    uses: ["paneer", "peas", "onion"],
    pantry: ["ghee", "cumin seeds", "turmeric", "red chilli powder", "garam masala", "ginger", "garlic"],
    extras: ["tomato"],
    steps: [
      "Heat 2 tbsp ghee on medium and add cumin seeds; let them sizzle for 20 seconds.",
      "Add finely chopped onion and cook 6–8 minutes until deep golden.",
      "Stir in ginger-garlic paste and cook for 1 minute until the raw smell goes.",
      "Add chopped tomato, turmeric, chilli powder and salt; cook until the oil separates, about 6 minutes.",
      "Pour in 1 cup water and the peas; simmer covered for 8 minutes.",
      "Add paneer cubes and garam masala, simmer 2 more minutes and serve with roti or rice.",
    ],
  },
  {
    cuisine: "Italian",
    title: "Frittata di Patate e Cipolle",
    region: "Campania",
    description: "A thick, golden omelette of slow-cooked potato and onion, served warm or at room temperature.",
    time: "30 min",
    uses: ["potato", "onion"],
    pantry: ["extra-virgin olive oil", "black pepper"],
    extras: ["eggs"],
    steps: [
      "Slice the potatoes and onion thinly.",
      "Cook them gently in 3 tbsp olive oil in a non-stick pan for 12–15 minutes until tender, not crisp.",
      "Beat 5 eggs with salt and pepper, then pour over the potatoes.",
      "Cook on low heat for 8 minutes until the edges set and the top is nearly firm.",
      "Slide onto a plate, flip back into the pan and cook 2 more minutes. Rest 5 minutes before slicing.",
    ],
  },
  {
    cuisine: "Chinese",
    title: "Suan La Tudou Si",
    region: "Sichuan",
    description: "Hot and sour shredded potato: crisp-tender matchsticks flash-fried with dried chilli and black vinegar.",
    time: "20 min",
    uses: ["potato"],
    pantry: ["oil", "rice vinegar", "garlic", "spring onions", "sugar"],
    extras: ["dried red chillies"],
    steps: [
      "Cut the potatoes into thin matchsticks and soak in cold water for 10 minutes to remove starch; drain well.",
      "Heat the wok until smoking, add oil, then dried chillies and garlic for 10 seconds.",
      "Add the potato and stir-fry on high heat for 2–3 minutes; it should stay crunchy.",
      "Splash in vinegar, add salt and a pinch of sugar, toss for 30 seconds.",
      "Finish with spring onions and serve immediately.",
    ],
  },
];
