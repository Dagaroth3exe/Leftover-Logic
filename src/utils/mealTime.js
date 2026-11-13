/** A little bit of personality: what meal is it right now? */
export function mealTime(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return { emoji: "☕", label: "Breakfast" };
  if (h >= 11 && h < 16) return { emoji: "🥪", label: "Lunch" };
  if (h >= 16 && h < 18) return { emoji: "🫖", label: "Snack o'clock" };
  if (h >= 18 && h < 23) return { emoji: "🍽️", label: "Dinner" };
  return { emoji: "🌙", label: "Midnight snack" };
}
