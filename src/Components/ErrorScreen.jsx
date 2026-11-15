import { Link } from "react-router-dom";
import { StockPot } from "./DishArt";

/**
 * Full-screen error state. Gemini's API limit (code "quota") gets its own,
 * friendlier variant: the AI chef is on a tea break.
 *
 * onChangeFridge: optional handler; without it "Change fridge" links to "/".
 */
export default function ErrorScreen({ error, onRetry, onChangeFridge }) {
  const quota = error?.code === "quota";
  const secondary =
    "grid h-14 flex-1 place-items-center rounded-full bg-card text-[16px] font-medium ring-1 ring-ink/10 transition hover:ring-ink/30";

  return (
    <main className="flex min-h-dvh animate-fade-in items-center justify-center px-5 py-8 sm:px-8">
      <div className="w-full max-w-[480px] md:grid md:max-w-[960px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-12">
        <div
          className={`tilt relative rounded-[36px] p-7 md:p-10 ${quota ? "bg-[#F5C84C]" : "bg-[#F39A7F]"}`}
          style={{ "--tilt": quota ? "1.5deg" : "-1.5deg" }}
        >
          <div className="mx-auto h-32 w-44 md:h-52 md:w-72" aria-hidden>
            <StockPot smoky={!quota} />
          </div>
          {quota && (
            <span
              aria-hidden
              className="snooze absolute right-7 top-6 font-serif text-[28px] italic text-ink/60 md:right-10 md:top-9 md:text-[36px]"
            >
              z<span className="text-[0.8em]">z</span>
              <span className="text-[0.6em]">z</span>
            </span>
          )}
        </div>
        <div className="mt-8 md:mt-0">
          <p className="font-serif text-[22px] italic text-ink/70 md:text-[28px]">
            {quota ? "The AI chef is on a tea break ☕" : "Well, that burned."}
          </p>
          <h1 className="mt-1 text-[30px] font-semibold leading-[1] tracking-[-0.035em] md:text-[44px]">
            {error?.message}
          </h1>
          {quota && (
            <p className="mt-4 text-[15px] leading-snug text-ink/55">
              Free-tier kitchens close early. Don't worry, your leftovers will keep.
            </p>
          )}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="h-14 flex-1 rounded-full bg-ink text-[16px] font-medium text-white transition active:scale-[0.98]"
            >
              Try again
            </button>
            {onChangeFridge ? (
              <button type="button" onClick={onChangeFridge} className={secondary}>
                Change fridge
              </button>
            ) : (
              <Link to="/" className={secondary}>
                Change fridge
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
