import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import KitchenCard from "../Components/KitchenCard";
import RecipeSheet from "../Components/RecipeSheet";
import Magnet from "../Components/Magnet";
import { ArrowLeft } from "../Components/Icons";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "../Components/ErrorScreen";
import { CUISINES } from "../theme";
import { fetchRecipes } from "../api";
import { mealTime } from "../utils/mealTime";
import { play } from "../sound/sfx";
import SoundToggle from "../Components/SoundToggle";

// Each card gets its own tilt.
const TILTS = [-2, 1.8, -1.2];
// Collage offsets once cards sit side by side (2 columns on tablet, 3 on desktop).
const OFFSET = ["", "md:mt-10 xl:mt-14", "xl:mt-5"]; // the third card is "wide" below xl
const STACK = ["z-0", "z-[1]", "z-[2]"];

export default function RecipePage() {
  const { state } = useLocation();
  const ingredients = state?.ingredients;
  const meal = mealTime();

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!ingredients?.length) return;
    const controller = new AbortController();

    (async () => {
      try {
        const result = await fetchRecipes(ingredients, controller.signal);
        setRecipes(result.slice(0, CUISINES.length));
        setStatus("ready");
        // Timer bell, then one card-flick per card as they're dealt (matches KitchenCard delays).
        play("ding");
        result.slice(0, CUISINES.length).forEach((_, n) => setTimeout(() => play("deal"), 150 + n * 160));
      } catch (err) {
        if (err.name === "AbortError") return;
        setError({ message: err.message, code: err.code });
        setStatus("error");
        play("error");
      }
    })();

    return () => controller.abort();
  }, [ingredients, attempt]);

  if (!ingredients?.length) return <Navigate to="/" replace />;

  if (status === "loading") return <LoadingScreen ingredients={ingredients} />;

  if (status === "error") {
    const retry = () => {
      setError(null);
      setStatus("loading");
      setAttempt((a) => a + 1);
    };
    return <ErrorScreen error={error} onRetry={retry} />;
  }

  const shown = recipes.map((r, i) => ({ r, i })).filter(({ i }) => filter === "all" || CUISINES[i].id === filter);

  return (
    <main className="min-h-dvh overflow-x-clip px-5 pb-20 pt-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24">
      <header className="relative z-30 flex animate-fade-in items-center justify-between">
        <Link
          to="/"
          aria-label="Back to your fridge"
          className="flex h-11 items-center gap-2 rounded-full pl-2.5 pr-3 transition hover:bg-ink/5"
        >
          <ArrowLeft />
          <span className="hidden text-[15px] font-medium md:inline">Your fridge</span>
        </Link>
        <span className="text-[18px] font-semibold tracking-[-0.02em]">
          {meal.label === "Midnight snack" ? "Tonight's" : meal.label} menu
        </span>
        <div className="flex items-center gap-2">
          <span className="flex h-11 items-center gap-1.5 rounded-full bg-card px-3 text-[15px] font-medium">
            <span aria-hidden className="text-lg">{meal.emoji}</span>
            <span className="hidden md:inline">{meal.label}</span>
          </span>
          <SoundToggle className="h-11 w-11" />
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-[560px] md:mt-10 md:max-w-none lg:flex lg:items-end lg:justify-between lg:gap-12">
        <h1 className="animate-fade-up text-[40px] font-semibold leading-[0.95] tracking-[-0.045em] sm:text-[56px] lg:max-w-[14ch] xl:text-[72px] 2xl:text-[88px]">
          Three dishes from <span className="font-serif font-normal italic tracking-[-0.02em]">what you had.</span>
        </h1>

        <div className="lg:flex lg:max-w-[46%] lg:flex-col lg:items-end lg:pb-2">
          <div className="mt-4 flex flex-wrap gap-2 lg:mt-0 lg:justify-end">
            {ingredients.map((item, i) => (
              <Magnet key={item} name={item} small delay={100 + i * 50} />
            ))}
          </div>
          <div
            className="no-scrollbar -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:mt-5"
            role="tablist"
            aria-label="Filter by kitchen"
          >
            {[{ id: "all", name: "All", emoji: "🍽️" }, ...CUISINES].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium transition ${
                  filter === c.id ? "bg-card ring-1 ring-ink/10" : "text-ink/55 hover:text-ink"
                }`}
              >
                <span aria-hidden>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`mx-auto mt-6 grid max-w-[560px] grid-cols-1 md:mt-10 ${
          shown.length > 1
            ? "md:max-w-none md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8"
            : "md:max-w-[980px] xl:max-w-[1120px]"
        }`}
      >
        {shown.map(({ r, i }, n) => {
          // With 2 columns (tablet), an odd card out spans the full row in landscape.
          const wide = shown.length === 3 && n === 2;
          return (
          <div
            key={i}
            className={`relative hover:z-10 focus-within:z-10 ${STACK[n]} ${n > 0 ? "-mt-4 md:mt-0" : ""} ${
              filter === "all" && !wide ? OFFSET[i] : ""
            } ${wide ? "md:max-xl:col-span-2 md:max-xl:mt-4" : ""}`}
          >
            <KitchenCard
              recipe={r}
              cuisine={CUISINES[i]}
              tilt={filter === "all" ? TILTS[i] : 0}
              delay={150 + n * 160}
              onOpen={() => setOpenIndex(i)}
              layout={shown.length === 1 ? "feature" : wide ? "wide" : "portrait"}
              className="h-full"
            />
          </div>
          );
        })}
      </section>

      {openIndex !== null && (
        <RecipeSheet
          recipe={recipes[openIndex]}
          cuisine={CUISINES[openIndex]}
          ingredients={ingredients}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </main>
  );
}
