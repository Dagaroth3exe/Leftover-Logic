import React, { useEffect, useState } from "react";
import LogoSticker from "../Components/LogoSticker";
import { useLocation, useNavigate } from "react-router";
import LoadingScreen from "./LoadingSceen";
import RecipeRed from "../Components/RecipeRed";
import RecipeBlue from "../Components/RecipeBlue";
import RecipeYellow from "../Components/RecipeYellow";

const CARDS = [
  { color: "red",    label: "🇮🇳 Indian",  accent: "#FF3131", dark: "#4B0000",  glow: "rgba(255,49,49,0.15)"   },
  { color: "blue",   label: "🇮🇹 Italian", accent: "#3179FF", dark: "#000A4B",  glow: "rgba(49,121,255,0.15)"  },
  { color: "yellow", label: "🇨🇳 Chinese", accent: "#E3FF31", dark: "#464B00",  glow: "rgba(227,255,49,0.12)"  },
];

const RecipePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = location.state?.ingredients || [];

  const [showPopup, setShowPopup] = useState(null);
  const [cardColor, setCardColor] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const stateIngredients = location.state?.ingredients || [];

    const fetchRecipes = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || "";
        const url = base ? `${base}/api/generate` : "/api/generate";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: stateIngredients }),
        });

        const data = await response.json();

        if (!isCancelled) {
          if (data.recipes) {
            setRecipes(data.recipes);
          } else {
            setError("No recipes found.");
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setError("Failed to connect to the chef!");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (stateIngredients.length > 0) {
      fetchRecipes();
    } else {
      setLoading(false);
      setError("No ingredients were provided.");
    }

    return () => { isCancelled = true; };
  }, [location.state]);

  if (loading) return <LoadingScreen />;

  if (error || recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-5xl">🍳</div>
        <h1 className="text-2xl font-bold text-red-400">{error || "Something went wrong"}</h1>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-white/[0.08] border border-white/15 text-white rounded-xl hover:bg-white/15 transition-all duration-200"
        >
          ← Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 flex flex-col items-center px-4 py-10 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-blue-950/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <LogoSticker className="w-40 sm:w-52 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Recipes</h1>

        {/* Ingredients used */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center max-w-lg">
            {ingredients.map((ing, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-gray-500 text-xs"
              >
                {ing}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 mb-10 relative z-10">
        {CARDS.map(({ color, label, accent, dark, glow }, idx) => {
          const recipe = recipes[idx];
          return (
            <div
              key={color}
              className="relative w-72 sm:w-80 rounded-2xl shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col"
              style={{
                background: `linear-gradient(145deg, ${accent}18 0%, ${accent}30 100%)`,
                border: `1px solid ${accent}35`,
                boxShadow: `0 8px 32px ${glow}`,
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
                style={{ background: accent, filter: "blur(50px)" }}
              />

              <div className="relative p-5 flex flex-col flex-1">
                {/* Cuisine badge */}
                <span
                  className="self-start px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: `${accent}22`,
                    border: `1px solid ${accent}50`,
                    color: accent,
                  }}
                >
                  {label}
                </span>

                {/* Title */}
                <h2 className="text-white font-bold text-lg mb-2 leading-snug">
                  {recipe?.title}
                </h2>

                {/* Description preview */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {recipe?.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => { setShowPopup(recipe); setCardColor(color); }}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:opacity-85 active:scale-95"
                  style={{ background: accent, color: dark }}
                >
                  View Recipe →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="relative z-10 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-gray-500 hover:text-white hover:bg-white/[0.12] transition-all duration-200 text-sm"
      >
        ← Try different ingredients
      </button>

      {/* Modals */}
      {cardColor === "red"    && <RecipeRed    data={showPopup} onClose={() => { setShowPopup(null); setCardColor(null); }} />}
      {cardColor === "blue"   && <RecipeBlue   data={showPopup} onClose={() => { setShowPopup(null); setCardColor(null); }} />}
      {cardColor === "yellow" && <RecipeYellow data={showPopup} onClose={() => { setShowPopup(null); setCardColor(null); }} />}
    </div>
  );
};

export default RecipePage;
