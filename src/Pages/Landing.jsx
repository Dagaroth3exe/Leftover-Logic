import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingSceen";
import LogoSticker from "../Components/LogoSticker";

export default function Landing() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const addIngredients = () => {
    if (input.trim() === "") return;
    const newItems = input
      .split(/[,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setIngredients((prev) => [...prev, ...newItems]);
    setInput("");
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredients();
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    setLoading(true);
  };

  const handleLoadingComplete = () => {
    navigate("/Recipe", { state: { ingredients } });
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 flex items-center justify-center flex-col px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-red-950/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-orange-950/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Logo */}
      <LogoSticker className="w-72 sm:w-[380px] mb-3 relative z-10" />

      <p className="text-gray-500 text-sm sm:text-base mb-10 tracking-widest uppercase text-center relative z-10">
        Turn your leftovers into something legendary
      </p>

      {/* Input area */}
      <div className="w-full max-w-lg relative z-10">
        <p className="text-gray-400 text-sm mb-2 font-medium">
          Type an ingredient and click <span className="text-white font-semibold">+ Add</span> (or press Enter)
        </p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g. eggs, tomato, bread..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-5 py-3.5 rounded-xl bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:bg-zinc-700 transition-all duration-200 text-sm"
          />
          <button
            type="button"
            onClick={addIngredients}
            className="px-5 py-3.5 rounded-xl bg-zinc-700 border border-zinc-500 text-white hover:bg-zinc-600 active:scale-95 transition-all duration-150 font-semibold text-sm whitespace-nowrap"
          >
            + Add
          </button>
        </div>

        {/* Ingredient chips */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5 p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 min-h-[52px]">
            {ingredients.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-900/50 border border-red-700/60 text-red-200 text-sm font-medium"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="text-red-400 hover:text-white transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-700/50 text-xs leading-none"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={ingredients.length === 0}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg
            bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-red-900/30
            hover:from-red-500 hover:to-orange-500 hover:shadow-xl hover:-translate-y-0.5
            disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
        >
          {ingredients.length === 0
            ? "No ingredients yet — add some above ↑"
            : `Generate recipes with ${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""} ✨`}
        </button>
      </div>
    </div>
  );
}
