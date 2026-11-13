import { useEffect, useState } from "react";
import Wordmark from "../Components/Wordmark";
import Magnet from "../Components/Magnet";
import DishArt, { StockPot } from "../Components/DishArt";
import { ingredientEmoji } from "../utils/ingredientEmoji";
import { CUISINES } from "../theme";
import { play, startLoop } from "../sound/sfx";
import SoundToggle from "../Components/SoundToggle";

const MESSAGES = [
  "Rummaging through the fridge…",
  "Heating up three pans…",
  "Asking the nani, the nonna and the auntie…",
  "Tempering the spices…",
  "Tasting for salt…",
  "Plating up…",
];

// What each kitchen is "doing" while we wait (cycles with the main message).
const KITCHEN_STATUS = {
  indian: ["Tempering cumin", "Frying onions golden", "Adding the masala", "Simmering low"],
  italian: ["Salting the water", "Warming olive oil", "Grating cheese", "Tossing it together"],
  chinese: ["Heating the wok", "Mixing the sauce", "Wok-tossing", "Finishing with sesame"],
};

// Horizontal drop positions (% of the drop zone) so items don't stack.
const LANES = [30, 62, 44, 72, 36, 56];

export default function LoadingScreen({ ingredients = [] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((i) => i + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const drops = ingredients.slice(0, LANES.length);
  const dropCount = drops.length;

  // Simmering pot ambience, plus a "plop" each time an ingredient lands. The drop
  // animation is 2.4s with items staggered evenly; each one hits the pot ~65% through.
  useEffect(() => {
    const stopSimmer = startLoop("simmer");
    let interval;
    const first = dropCount
      ? setTimeout(() => {
          play("plop");
          interval = setInterval(() => play("plop"), 2400 / dropCount);
        }, 0.65 * 2400)
      : undefined;
    return () => {
      stopSimmer();
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [dropCount]);

  const msg = MESSAGES[tick % MESSAGES.length];

  return (
    <main
      className="flex min-h-dvh animate-fade-in flex-col px-5 pb-8 pt-5 sm:px-8 lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-0 lg:overflow-hidden lg:p-0"
      aria-busy="true"
    >
      {/* Pot panel */}
      <section className="flex flex-1 flex-col lg:m-4 lg:mr-0 lg:rounded-[44px] lg:bg-[#F5C84C] lg:p-10 xl:p-14">
        <header className="relative z-30 flex items-center justify-between">
          <span className="w-10 lg:hidden" aria-hidden />
          <Wordmark className="text-[24px] xl:text-[30px]" />
          <SoundToggle />
        </header>

        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center lg:max-w-none">
          <div className="rounded-[36px] bg-[#F5C84C] px-6 pb-6 pt-8 lg:bg-transparent lg:p-0">
            <div className="relative mx-auto h-52 w-64 sm:h-64 sm:w-80 xl:h-80 xl:w-[26rem]" aria-hidden>
              {drops.map((item, i) => (
                <span
                  key={item}
                  className="absolute top-0 animate-drop text-3xl xl:text-5xl"
                  style={{ left: `${LANES[i]}%`, animationDelay: `${(i * 2.4) / drops.length}s` }}
                >
                  {ingredientEmoji(item)}
                </span>
              ))}
              <div className="absolute inset-x-0 bottom-0 z-10 h-[70%]">
                <StockPot />
              </div>
            </div>
            <p
              key={msg}
              className="mx-auto mt-4 min-h-[60px] max-w-[18ch] animate-fade-up text-center font-serif text-[28px] italic leading-[1.05] sm:text-[34px] xl:mt-8 xl:text-[48px]"
              aria-live="polite"
            >
              {msg}
            </p>
            <div className="mx-auto mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-ink/15 xl:mt-6 xl:w-56">
              <div className="h-full w-1/3 animate-indeterminate rounded-full bg-ink" />
            </div>
          </div>
        </div>
      </section>

      {/* What's happening in each kitchen */}
      <section className="mx-auto w-full max-w-[560px] lg:mx-0 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:px-12 xl:px-20">
        {ingredients.length > 0 && (
          <div className="mt-6 text-center lg:mt-0 lg:text-left">
            <p className="text-[13px] text-ink/50 lg:text-[15px]">Going into the pot</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
              {ingredients.map((item, i) => (
                <Magnet key={item} name={item} small delay={i * 60} />
              ))}
            </div>
          </div>
        )}

        <ul className="mt-10 hidden space-y-3 lg:block">
          {CUISINES.map((c, i) => {
            const steps = KITCHEN_STATUS[c.id];
            return (
              <li
                key={c.id}
                className="flex animate-fade-up items-center gap-5 rounded-[30px] p-4 pr-6"
                style={{ background: c.color, animationDelay: `${200 + i * 120}ms` }}
              >
                <div className="grid h-24 w-32 shrink-0 place-items-center bg-white/45" style={{ borderRadius: c.blob }}>
                  <div className="h-20 w-28">
                    <DishArt cuisine={c.id} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[22px] font-semibold leading-none tracking-[-0.03em]">{c.name} kitchen</p>
                  <p key={tick} className="mt-2 animate-fade-up font-serif text-[20px] italic text-ink/70">
                    {steps[(tick + i) % steps.length]}…
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
