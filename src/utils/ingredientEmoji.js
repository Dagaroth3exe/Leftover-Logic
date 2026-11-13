// First match wins, so more specific words come before general ones.
const TABLE = [
  [/bok choy|pak choi|spinach|palak|cabbage|lettuce|kale|greens|methi/, "🥬"],
  [/eggplant|brinjal|aubergine|baingan/, "🍆"],
  [/egg/, "🥚"],
  [/rice/, "🍚"],
  [/noodle|ramen/, "🍜"],
  [/pasta|spaghetti|macaroni|penne/, "🍝"],
  [/bread|roti|naan|chapati|toast|bun/, "🍞"],
  [/tomato/, "🍅"],
  [/onion|shallot/, "🧅"],
  [/garlic/, "🧄"],
  [/ginger/, "🫚"],
  [/sweet potato|yam/, "🍠"],
  [/potato|aloo/, "🥔"],
  [/carrot/, "🥕"],
  [/\bpeas?\b|matar/, "🫛"],
  [/corn/, "🌽"],
  [/broccoli|cauliflower|gobi/, "🥦"],
  [/mushroom/, "🍄"],
  [/chil+i|jalapeno/, "🌶️"],
  [/capsicum|bell pepper|pepper/, "🫑"],
  [/cucumber|zucchini|courgette/, "🥒"],
  [/avocado/, "🥑"],
  [/lemon|lime/, "🍋"],
  [/coconut/, "🥥"],
  [/cheese|paneer|mozzarella|parmesan/, "🧀"],
  [/butter|ghee/, "🧈"],
  [/milk|cream|yog(h)?urt|curd|dahi/, "🥛"],
  [/chicken|turkey/, "🍗"],
  [/shrimp|prawn/, "🦐"],
  [/fish|salmon|tuna|cod/, "🐟"],
  [/bacon|ham|pork|sausage/, "🥓"],
  [/beef|lamb|mutton|goat|meat|mince|keema/, "🥩"],
  [/tofu|bean curd/, "🧊"],
  [/lentil|dal|bean|chickpea|chana|rajma/, "🫘"],
  [/apple/, "🍎"],
  [/banana/, "🍌"],
  [/herb|basil|coriander|cilantro|parsley|mint/, "🌿"],
];

export function ingredientEmoji(name) {
  const n = name.toLowerCase();
  for (const [re, emoji] of TABLE) if (re.test(n)) return emoji;
  return "🥄";
}
