import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wordmark from "../Components/Wordmark";
import DishArt from "../Components/DishArt";
import Magnet from "../Components/Magnet";
import { ArrowRight, Plus } from "../Components/Icons";
import { CUISINES } from "../theme";
import { warmUpBackend } from "../api";
import { ingredientEmoji } from "../utils/ingredientEmoji";
import { mealTime } from "../utils/mealTime";
import { play } from "../sound/sfx";
import SoundToggle from "../Components/SoundToggle";

const SHELVES = [
  { id: "basics", label: "Basics", emoji: "🥚", items: ["eggs", "onion", "tomato", "garlic", "potato", "lemon"] },
  { id: "veg", label: "Veg", emoji: "🥬", items: ["spinach", "peas", "cauliflower", "mushrooms", "carrot", "bell pepper"] },
  { id: "protein", label: "Protein", emoji: "🍗", items: ["paneer", "chicken", "tofu", "lentils", "prawns", "cheese"] },
  { id: "leftovers", label: "Leftovers", emoji: "🍚", items: ["leftover rice", "bread", "pasta", "noodles", "roti", "boiled potatoes"] },
];

const PREVIEW_TILTS = [-3, 2.5, -1.5];

export default function Landing() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [shelf, setShelf] = useState(SHELVES[0].id);
  const meal = mealTime();

  useEffect(warmUpBackend, []);

  const add = (raw) => {
    const items = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (items.some((i) => !ingredients.includes(i))) play("stick");
    if (items.length) setIngredients((prev) => [...new Set([...prev, ...items])]);
    setInput("");
  };

  const remove = (item) => {
    play("unstick");
    setIngredients((prev) => prev.filter((i) => i !== item));
  };

  const generate = () => {
    if (!ingredients.length) return;
    play("whoosh");
    navigate("/recipes", { state: { ingredients } });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) add(input);
      else generate();
    } else if (e.key === "Backspace" && !input && ingredients.length) {
      play("unstick");
      setIngredients((prev) => prev.slice(0, -1));
    }
  };

  const count = ingredients.length;
  const shelfItems = SHELVES.find((s) => s.id === shelf).items.filter((i) => !ingredients.includes(i));

  const ctaButton = (extra = "") => (
    <button
      type="button"
      data-sfx="none"
      onClick={generate}
      disabled={!count}
      className={`flex h-16 w-full items-center justify-between rounded-full bg-ink pl-7 pr-2 text-[17px] font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#D3D0C8] disabled:text-ink/50 ${extra}`}
    >
      <span>{count ? "Cook up 3 dishes" : "Stick something on the fridge"}</span>
      <span className="flex h-12 min-w-12 items-center justify-center gap-1.5 rounded-full bg-white/15 px-4">
        {count ? (
          <>
            {count} <ArrowRight width={18} height={18} />
          </>
        ) : (
          "0"
        )}
      </span>
    </button>
  );

  return (
    <main className="min-h-dvh overflow-x-clip lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
      {/* ---------- The fridge ---------- */}
      <div className="flex flex-col px-5 pt-5 sm:px-8 md:px-12 lg:min-h-dvh lg:pb-6 xl:px-16 2xl:px-24">
        <header className="relative z-30 flex animate-fade-in items-center justify-between">
          <Wordmark className="text-[28px] xl:text-[32px]" />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-[14px] font-medium lg:hidden">
              <span aria-hidden>{meal.emoji}</span> {meal.label}
            </span>
            <SoundToggle />
          </div>
        </header>

        <div className="mx-auto mt-10 w-full max-w-[680px] md:mt-14 lg:mx-0 lg:my-auto lg:max-w-[640px] lg:py-[2vh] 2xl:max-w-[720px]">
          <h1 className="animate-fade-up text-[46px] font-semibold leading-[0.92] tracking-[-0.045em] sm:text-[64px] lg:text-[clamp(52px,min(5.4vw,8.2vh),96px)]">
            What's left in <span className="font-serif font-normal italic tracking-[-0.02em]">your fridge?</span>
          </h1>
          <p
            className="mt-4 max-w-md animate-fade-up text-[16px] leading-snug text-ink/60 sm:text-[18px] lg:mt-[2vh] lg:[@media(max-height:760px)]:hidden"
            style={{ animationDelay: "80ms" }}
          >
            Stick your leftovers on the door. We'll find three real dishes to make with them.
          </p>

          <div
            className="mt-7 flex animate-fade-up items-center gap-2 rounded-full bg-card p-1.5 pl-5 lg:mt-[3.2vh] ring-1 ring-ink/5 transition focus-within:ring-2 focus-within:ring-ink xl:p-2 xl:pl-6"
            style={{ animationDelay: "140ms" }}
          >
            <label htmlFor="ingredient" className="sr-only">
              Add an ingredient
            </label>
            <input
              id="ingredient"
              ref={inputRef}
              type="text"
              autoComplete="off"
              placeholder="Type a leftover…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="min-w-0 flex-1 bg-transparent py-2 text-[17px] placeholder:text-ink/35 focus:outline-none xl:text-[19px]"
            />
            <button
              type="button"
              onClick={() => {
                add(input);
                inputRef.current?.focus();
              }}
              disabled={!input.trim()}
              data-sfx="none"
              aria-label="Stick it on the fridge"
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition active:scale-90 disabled:bg-ink/15 xl:h-12 xl:w-12"
            >
              <Plus />
            </button>
          </div>

          {/* Fridge door */}
          <section
            aria-label="Your fridge door"
            className="mt-4 min-h-[148px] animate-fade-up rounded-[32px] bg-card p-5 ring-1 ring-ink/5 lg:min-h-[min(148px,14vh)] xl:p-6"
            style={{ animationDelay: "200ms" }}
          >
            <p className="text-[13px] text-ink/45">
              Fridge door{count > 0 && ` · ${count} item${count > 1 ? "s" : ""}`}
            </p>
            {count > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2.5">
                {ingredients.map((item) => (
                  <li key={item}>
                    <Magnet name={item} onRemove={remove} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 font-serif text-[24px] italic leading-tight text-ink/40 lg:text-[clamp(20px,2.6vh,28px)]">
                Nothing stuck here yet. Add a leftover, or grab one from the shelf below.
              </p>
            )}
          </section>

          {/* Shelves */}
          <section className="mt-7 animate-fade-up lg:mt-[2.6vh]" style={{ animationDelay: "260ms" }} aria-label="Quick add">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist">
              {SHELVES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={shelf === s.id}
                  onClick={() => setShelf(s.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium transition ${
                    shelf === s.id ? "bg-card ring-1 ring-ink/10" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  <span aria-hidden>{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex min-h-[44px] flex-wrap gap-2" role="tabpanel">
              {shelfItems.length === 0 && (
                <p className="py-2 font-serif text-[18px] italic text-ink/45">Shelf's empty. You took everything!</p>
              )}
              {shelfItems.map((s, i) => (
                <button
                  key={`${shelf}-${s}`}
                  type="button"
                  data-sfx="none"
                  onClick={() => add(s)}
                  className="flex animate-fade-up items-center gap-1.5 rounded-full border border-dashed border-ink/25 px-3 py-1.5 text-[14px] text-ink/75 transition hover:border-solid hover:border-ink hover:bg-card hover:text-ink"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <span aria-hidden>{ingredientEmoji(s)}</span>
                  {s}
                  <span aria-hidden className="text-ink/35">+</span>
                </button>
              ))}
            </div>
          </section>

          {/* Inline CTA on desktop; phones/tablets get the sticky one below */}
          <div className="mt-9 hidden animate-fade-up lg:mt-[3vh] lg:block" style={{ animationDelay: "320ms" }}>
            {ctaButton("max-w-[460px]")}
          </div>
        </div>
      </div>

      {/* ---------- The three kitchens ---------- */}
      <aside className="px-5 pb-40 pt-14 sm:px-8 md:px-12 lg:sticky lg:top-4 lg:m-4 lg:ml-0 lg:flex lg:h-[calc(100dvh-2rem)] lg:flex-col lg:overflow-hidden lg:rounded-[44px] lg:bg-[#E2DFD6] lg:p-10 xl:p-14 2xl:p-20">
        <div className="mx-auto w-full max-w-[680px] lg:mx-0 lg:flex lg:flex-1 lg:flex-col lg:max-w-none">
          <div className="hidden items-center justify-between lg:flex">
            <span className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-[14px] font-medium">
              <span aria-hidden>{meal.emoji}</span> {meal.label}
            </span>
            <span className="text-[14px] text-ink/50">3 kitchens open</span>
          </div>

          <div className="lg:my-auto lg:py-[2vh]">
            <p className="text-[14px] text-ink/50 lg:text-[clamp(28px,2.6vw,44px)] lg:font-semibold lg:leading-[1] lg:tracking-[-0.04em] lg:text-ink">
              Three kitchens, <span className="font-serif font-normal italic lg:tracking-[-0.01em]">one fridge.</span>
            </p>

            <ul className="mt-4 md:grid md:grid-cols-3 md:gap-4 lg:mt-8 lg:block xl:mt-10">
              {CUISINES.map((c, i) => (
                <li
                  key={c.id}
                  data-sfx-hover={c.id}
                  className={`tilt relative animate-deal ${i > 0 ? "-mt-5 md:mt-0 lg:-mt-6" : ""}`}
                  style={{ "--tilt": `${PREVIEW_TILTS[i]}deg`, animationDelay: `${300 + i * 140}ms`, zIndex: i }}
                >
                  <div
                    className="flex items-center gap-4 rounded-[30px] p-4 pr-5 md:h-full md:flex-col md:items-start md:p-5 lg:flex-row lg:items-center lg:gap-6 lg:p-5 lg:pr-8 xl:rounded-[36px]"
                    style={{ background: c.color }}
                  >
                    <div
                      className="grid h-24 w-32 shrink-0 place-items-center bg-white/45 md:h-32 md:w-full lg:h-[min(8rem,14vh)] lg:w-44 xl:h-[min(10rem,15vh)] xl:w-56"
                      style={{ borderRadius: c.blob }}
                    >
                      <div className="h-20 w-28 md:h-24 md:w-36 lg:h-[85%] xl:w-44">
                        <DishArt cuisine={c.id} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[24px] font-semibold leading-none tracking-[-0.03em] xl:text-[34px]">
                        {c.name} <span className="text-[20px] xl:text-[26px]">{c.emoji}</span>
                      </p>
                      <p className="mt-1.5 font-serif text-[18px] italic leading-tight text-ink/70 xl:text-[22px]">
                        {c.tagline}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 max-w-md text-[13px] leading-snug text-ink/45 lg:mt-0">
            Real, traditional dishes only. No “tikka pasta”. Spices, soy sauce and olive oil are assumed to be in your
            pantry.
          </p>
        </div>
      </aside>

      {/* Sticky CTA for phones and tablets */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-paper via-paper/90 to-transparent px-5 pb-5 pt-10 lg:hidden">
        <div className="pointer-events-auto mx-auto max-w-[460px]">{ctaButton()}</div>
      </div>
    </main>
  );
}
