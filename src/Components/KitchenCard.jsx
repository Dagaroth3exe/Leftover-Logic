import DishArt from "./DishArt";
import { Clock } from "./Icons";

// Landscape layout for a card spanning both tablet columns (text left, dish right).
// Scoped to md..xl; at xl the grid has three columns and every card is portrait again.
const WIDE = {
  card: "md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:gap-x-8 md:max-xl:[grid-template-rows:auto_auto_1fr_auto] md:max-xl:[grid-template-areas:'head_head'_'title_art'_'desc_art'_'meta_art']",
  head: "md:max-xl:[grid-area:head]",
  title: "md:max-xl:[grid-area:title]",
  desc: "md:max-xl:[grid-area:desc]",
  art: "md:max-xl:[grid-area:art] md:max-xl:mt-5 md:max-xl:h-auto md:max-xl:min-h-[12rem]",
  artInner: "",
  meta: "md:max-xl:[grid-area:meta]",
};
// Feature layout: the only card on screen (a single kitchen is filtered). Landscape
// from md up, with a larger title, the full description and a roomier dish window.
// xl:/2xl: overrides are needed because the base classes set sizes at those breakpoints.
const FEATURE = {
  card: "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-x-10 md:p-8 md:pb-8 xl:p-10 xl:pb-10 md:[grid-template-rows:auto_auto_1fr_auto] md:[grid-template-areas:'head_art'_'title_art'_'desc_art'_'meta_art']",
  head: "md:[grid-area:head]",
  title: "md:[grid-area:title] md:mt-10 md:text-[44px] xl:mt-12 xl:text-[54px]",
  desc: "md:[grid-area:desc] md:mt-4 md:line-clamp-none md:max-w-[34ch] md:text-[22px] xl:text-[24px]",
  art: "md:[grid-area:art] md:mt-0 md:h-auto md:min-h-[19rem] xl:mt-0 xl:h-auto 2xl:h-auto",
  artInner: "md:h-44 md:w-64 xl:h-52 xl:w-72 2xl:h-56 2xl:w-80",
  meta: "md:[grid-area:meta] md:pt-8",
};
const NONE = { card: "", head: "", title: "", desc: "", art: "", artInner: "", meta: "" };

/** A recipe as a flat, coloured card dealt onto the table at a slight tilt. */
/** layout: "portrait" (default) | "wide" (spans 2 tablet columns) | "feature" (only card shown) */
export default function KitchenCard({ recipe, cuisine, tilt, delay, onOpen, layout = "portrait", className = "" }) {
  const w = layout === "feature" ? FEATURE : layout === "wide" ? WIDE : NONE;
  const counts = [
    recipe.uses?.length && `🧺 ${recipe.uses.length} from your fridge`,
    recipe.pantry?.length && `🧂 ${recipe.pantry.length} pantry`,
    recipe.extras?.length && `🛒 ${recipe.extras.length} to buy`,
  ].filter(Boolean);

  return (
    <button
      type="button"
      data-sfx="whoosh"
      data-sfx-hover={cuisine.id}
      onClick={onOpen}
      className={`tilt tilt-lift relative flex w-full flex-col animate-deal rounded-[32px] p-5 pb-8 text-left xl:rounded-[36px] xl:p-7 xl:pb-9 focus-visible:outline-offset-4 ${w.card} ${className}`}
      style={{ background: cuisine.color, "--tilt": `${tilt}deg`, animationDelay: `${delay}ms` }}
    >
      <div className={`flex items-center justify-between gap-3 ${w.head}`}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-xl">{cuisine.emoji}</span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold">{cuisine.name} kitchen</p>
            {recipe.region && <p className="text-[13px] text-ink/60">{recipe.region}</p>}
          </div>
        </div>
        {recipe.time && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-[13px] font-medium">
            <Clock width={13} height={13} />
            {recipe.time}
          </span>
        )}
      </div>

      <h2 className={`mt-5 text-[30px] font-semibold leading-[0.98] tracking-[-0.035em] xl:mt-6 xl:text-[36px] ${w.title}`}>{recipe.title}</h2>
      <p className={`mt-2.5 line-clamp-3 font-serif text-[19px] italic leading-[1.2] text-ink/75 xl:text-[21px] ${w.desc}`}>
        {recipe.description}
      </p>

      <div className={`mt-4 flex h-36 items-center justify-center bg-white/45 xl:mt-6 xl:h-44 2xl:h-52 ${w.art}`} style={{ borderRadius: cuisine.blob }}>
        <div className={`h-28 w-40 xl:h-36 xl:w-52 2xl:h-40 2xl:w-60 ${w.artInner}`}>
          <DishArt cuisine={cuisine.id} />
        </div>
      </div>

      <div className={`mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[13px] text-ink/70 xl:text-[14px] ${w.meta}`}>
        {counts.map((c) => (
          <span key={c}>{c}</span>
        ))}
        {layout === "feature" && (
          <span className="mt-4 hidden w-full md:block">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white">
              Open the recipe →
            </span>
          </span>
        )}
      </div>
    </button>
  );
}
