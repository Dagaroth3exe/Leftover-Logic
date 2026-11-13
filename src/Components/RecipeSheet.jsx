import { useCallback, useEffect, useRef, useState } from "react";
import DishArt from "./DishArt";
import { ArrowLeft, Check, Copy } from "./Icons";
import { ingredientEmoji } from "../utils/ingredientEmoji";
import { play, startLoop } from "../sound/sfx";
import SoundToggle from "./SoundToggle";

const EXIT_MS = 250;

function toSteps(instructions) {
  if (Array.isArray(instructions)) return instructions.map(String).filter(Boolean);
  return String(instructions ?? "")
    .split(/(?=\b\d+\.\s)|\n/)
    .map((s) => s.trim().replace(/^\d+\.\s*/, ""))
    .filter(Boolean);
}

function MetaRow({ icon, children }) {
  return (
    <li className="flex items-center gap-3 text-[15px]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-base">{icon}</span>
      {children}
    </li>
  );
}

/** Full recipe as a bottom sheet with tick-off-as-you-cook steps. */
export default function RecipeSheet({ recipe, cuisine, ingredients, onClose }) {
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(() => new Set());
  const [started, setStarted] = useState(false);
  const backRef = useRef(null);
  const methodRef = useRef(null);
  const steps = toSteps(recipe.steps ?? recipe.instructions);
  const uses = recipe.uses ?? [];

  const close = useCallback(() => {
    play("close");
    setClosing(true);
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    backRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  const toggle = (i) => {
    const willBeDone = !done.has(i);
    const doneAfter = done.size + (willBeDone ? 1 : -1);
    // Notes climb with progress (1st tick lowest), and the final step resolves on a chord.
    if (willBeDone && doneAfter === steps.length) play("complete");
    else play(willBeDone ? "check" : "uncheck", { step: willBeDone ? doneAfter - 1 : done.size - 1 });
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const copy = async () => {
    const text = [
      recipe.title,
      "",
      recipe.description,
      "",
      uses.length && `From your fridge: ${uses.join(", ")}`,
      recipe.pantry?.length && `From the pantry: ${recipe.pantry.join(", ")}`,
      recipe.extras?.length && `To buy: ${recipe.extras.join(", ")}`,
      "",
      ...steps.map((s, i) => `${i + 1}. ${s}`),
    ]
      .filter((l) => l !== 0 && l !== false && l !== undefined)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nextStep = steps.findIndex((_, i) => !done.has(i));
  const allDone = steps.length > 0 && nextStep === -1;
  const cta = () => {
    if (allDone) return close();
    methodRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (started || done.size > 0) toggle(nextStep);
    else {
      play("ignite");
      setStarted(true);
    }
  };
  const cooking = started || done.size > 0;

  // The pan sizzles quietly for as long as you're actively cooking.
  const sizzling = cooking && !allDone && !closing;
  useEffect(() => (sizzling ? startLoop("sizzle") : undefined), [sizzling]);
  const ctaLabel = allDone
    ? "All done. Enjoy! 🎉"
    : !cooking
      ? "Start cooking"
      : `Done with step ${nextStep + 1} of ${steps.length}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-ink/35 sm:items-center sm:p-6 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`relative flex h-[94dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[34px] bg-paper sm:h-[90dvh] sm:rounded-[34px] md:max-w-[1180px] md:rounded-[40px] ${
          closing ? "animate-sheet-out" : "animate-sheet-in"
        }`}
      >
        <header className="relative z-30 flex shrink-0 items-center justify-between px-4 pb-2 pt-4 md:px-6 md:pt-5">
          <button
            ref={backRef}
            type="button"
            data-sfx="none"
            onClick={close}
            aria-label="Back to menu"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5"
          >
            <ArrowLeft />
          </button>
          <span className="text-[17px] font-semibold">{cuisine.name} kitchen</span>
          <div className="flex items-center gap-1">
            <SoundToggle className="bg-transparent hover:bg-ink/5" />
            <button
              type="button"
              onClick={copy}
              aria-label="Copy recipe"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5"
            >
              {copied ? <Check /> : <Copy />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-28 md:grid md:grid-cols-2 md:items-start md:gap-10 md:px-10 lg:gap-14 lg:px-14">
          <div className="md:sticky md:top-0 md:pb-6">
          <h2 id="sheet-title" className="mt-3 text-[36px] font-semibold leading-[0.98] tracking-[-0.035em] lg:text-[48px]">
            {recipe.title} <span className="text-[30px]">{cuisine.emoji}</span>
          </h2>

          <ul className="mt-5 space-y-2.5">
            {recipe.region && <MetaRow icon="📍">{recipe.region}</MetaRow>}
            {recipe.time && <MetaRow icon="⏱️">{recipe.time}, start to finish</MetaRow>}
            {ingredients?.length > 0 && (
              <MetaRow icon="🧺">
                Uses {uses.length} of your {ingredients.length} leftovers
              </MetaRow>
            )}
          </ul>

          {recipe.description && (
            <blockquote className="mt-6 rounded-r-2xl border-l-[3px] border-ink bg-ink/[0.06] px-4 py-3.5 font-serif text-[20px] italic leading-[1.25] lg:text-[23px]">
              “{recipe.description}”
            </blockquote>
          )}

          {uses.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[15px] font-medium">From your fridge</span>
              <span className="flex -space-x-2">
                {uses.map((u) => (
                  <span key={u} className="grid h-9 w-9 place-items-center rounded-full bg-white text-lg ring-2 ring-paper">
                    {ingredientEmoji(u)}
                  </span>
                ))}
              </span>
              <span className="text-[13px] text-ink/60">{uses.join(", ")}</span>
            </div>
          )}

          {(recipe.pantry?.length > 0 || recipe.extras?.length > 0) && (
            <div className="mt-5 space-y-3">
              {recipe.pantry?.length > 0 && (
                <div>
                  <p className="text-[13px] text-ink/55">From the pantry</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {recipe.pantry.map((p) => (
                      <span key={p} className="rounded-full bg-white px-3 py-1 text-[14px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {recipe.extras?.length > 0 && (
                <div>
                  <p className="text-[13px] text-ink/55">You'll need to grab</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {recipe.extras.map((p) => (
                      <span key={p} className="rounded-full px-3 py-1 text-[14px]" style={{ background: cuisine.color }}>
                        🛒 {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          </div>

          <section
            ref={methodRef}
            className="relative mt-8 scroll-mt-4 rounded-[32px] p-5 md:mt-3 lg:p-7"
            style={{ background: cuisine.color }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-[34px] italic leading-none">Method</h3>
                <p className="mt-1.5 text-[13px] text-ink/65">
                  {done.size}/{steps.length} done · tap a step to tick it off
                </p>
              </div>
              <div className="-mr-2 -mt-3 h-20 w-28 shrink-0">
                <DishArt cuisine={cuisine.id} />
              </div>
            </div>

            <ol className="mt-4 space-y-2">
              {steps.map((step, i) => {
                const isDone = done.has(i);
                const isNext = i === nextStep && cooking;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      data-sfx="none"
                      onClick={() => toggle(i)}
                      aria-pressed={isDone}
                      className={`flex w-full gap-3 rounded-[22px] p-3.5 text-left text-[15px] leading-snug transition ${
                        isDone ? "bg-white/30 text-ink/45" : "bg-white/75 hover:bg-white"
                      } ${isNext ? "ring-2 ring-ink" : ""}`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold transition ${
                          isDone ? "bg-ink text-white" : "border-[1.5px] border-ink/70"
                        }`}
                      >
                        {isDone ? <Check width={14} height={14} /> : i + 1}
                      </span>
                      <span className={`pt-0.5 ${isDone ? "line-through decoration-ink/30" : ""}`}>{step}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper via-paper/90 to-transparent px-5 pb-5 pt-10 md:left-1/2 md:pl-5 md:pr-10 lg:pl-7 lg:pr-14">
          <button
            type="button"
            data-sfx="none"
            onClick={cta}
            className="pointer-events-auto flex h-14 w-full items-center justify-center rounded-full bg-ink text-[16px] font-medium text-white transition active:scale-[0.98]"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
