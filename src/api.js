const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fire-and-forget ping so a sleeping free-tier backend starts booting while
 * the user is still typing ingredients, instead of after they hit generate.
 */
let warmed = false;
export function warmUpBackend() {
  if (warmed) return;
  warmed = true;
  fetch(`${API_BASE}/api/health`).catch(() => {});
}

export async function fetchRecipes(ingredients, signal) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Couldn't reach the kitchen. Is the backend running?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !Array.isArray(data.recipes) || data.recipes.length === 0) {
    throw new Error(data.error || "The chef came back empty-handed.");
  }
  return data.recipes;
}
