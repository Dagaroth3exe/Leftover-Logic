import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./Icons";
import { play } from "../sound/sfx";

const STORAGE_KEY = "leftover-logic:welcomed";

// Warm greeting first, then a beat, then the deadpan line.
const PUNCHLINE = "Anyways, we don't need your name for anything. Let's start cooking.";
const PUNCHLINE_AT = 1300; // ms after the name tag sticks

/** Show on the very first visit. `?welcome` in the URL forces it (handy for testing). */
function shouldShow() {
  if (new URLSearchParams(window.location.search).has("welcome")) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return false; // storage blocked: don't nag on every page load
  }
}

function remember(name) {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
    if (name) localStorage.setItem("leftover-logic:name", name); // for absolutely nothing
  } catch {
    /* ignore */
  }
}

export default function WelcomeCard() {
  const [open, setOpen] = useState(shouldShow);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState("ask"); // ask | joke
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const doneRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || closing) return;
    (step === "ask" ? inputRef : doneRef).current?.focus();
    if (step !== "joke") return;
    const t = setTimeout(() => play("rimshot"), PUNCHLINE_AT + 150); // lands with the punchline
    return () => clearTimeout(t);
  }, [open, step, closing]);

  if (!open) return null;

  const reveal = (value) => {
    setName(value);
    remember(value);
    play("stick");
    setStep("joke");
  };

  const submit = (e) => {
    e.preventDefault();
    const value = input.replace(/\s+/g, " ").trim().slice(0, 24);
    if (value) reveal(value);
  };

  const finish = () => {
    remember(name);
    play("whoosh");
    setClosing(true);
    setTimeout(() => setOpen(false), 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-5 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
      onKeyDown={(e) => e.key === "Escape" && (step === "ask" ? reveal("") : finish())}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="tilt relative w-full max-w-[480px] animate-deal rounded-[36px] bg-paper p-7 sm:p-9"
        style={{ "--tilt": "-1deg" }}
      >
        {step === "ask" ? (
          <>
            <p className="text-[14px] text-ink/50">🧲 First time here?</p>
            <h2 id="welcome-title" className="mt-3 text-[38px] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[44px]">
              Before we open <span className="font-serif font-normal italic tracking-[-0.01em]">the fridge…</span>
            </h2>
            <p className="mt-4 text-[17px] text-ink/60">What should we call you?</p>

            <form
              onSubmit={submit}
              className="mt-4 flex items-center gap-2 rounded-full bg-card p-1.5 pl-5 ring-1 ring-ink/5 transition focus-within:ring-2 focus-within:ring-ink"
            >
              <label htmlFor="welcome-name" className="sr-only">
                Your name
              </label>
              <input
                id="welcome-name"
                ref={inputRef}
                type="text"
                autoComplete="given-name"
                maxLength={24}
                placeholder="Your name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2 text-[18px] placeholder:text-ink/35 focus:outline-none"
              />
              <button
                type="submit"
                data-sfx="none"
                disabled={!input.trim()}
                aria-label="That's me"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition active:scale-90 disabled:bg-ink/15"
              >
                <ArrowRight />
              </button>
            </form>

            <button
              type="button"
              data-sfx="none"
              onClick={() => reveal("")}
              className="mt-4 text-[14px] text-ink/45 underline decoration-ink/20 underline-offset-4 transition hover:text-ink"
            >
              I'd rather not say
            </button>
          </>
        ) : (
          <>
            {/* The classic stick-on name tag */}
            <div
              className="tilt magnet-edge mx-auto w-full max-w-[280px] animate-stick overflow-hidden rounded-[22px] bg-white"
              style={{ "--tilt": "3deg" }}
            >
              <div className="bg-brand px-4 pb-2 pt-3 text-center text-white">
                <p className="font-logo text-[30px] font-black leading-none tracking-[0.04em]">HELLO</p>
                <p className="mt-1 text-[12px] font-medium tracking-[0.12em]">my name is</p>
              </div>
              <p id="welcome-title" className="truncate px-4 py-5 text-center font-serif text-[40px] italic leading-none">
                {name || "Mystery Chef"}
              </p>
            </div>

            <div aria-live="polite" className="mt-8 text-center">
              <p className="animate-fade-up text-[20px] text-ink/60" style={{ animationDelay: "350ms" }}>
                {name ? `Nice to meet you, ${name}! 👋` : "No name? Mysterious."}
              </p>
              <p
                className="mt-3 animate-fade-up font-serif text-[30px] italic leading-[1.1] sm:text-[34px]"
                style={{ animationDelay: `${PUNCHLINE_AT}ms` }}
              >
                {PUNCHLINE}
              </p>
            </div>

            <button
              ref={doneRef}
              type="button"
              data-sfx="none"
              onClick={finish}
              className="mt-8 flex h-14 w-full animate-fade-up items-center justify-center gap-2 rounded-full bg-ink text-[16px] font-medium text-white transition active:scale-[0.98]"
              style={{ animationDelay: `${PUNCHLINE_AT + 500}ms` }}
            >
              Let's cook <ArrowRight width={18} height={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
