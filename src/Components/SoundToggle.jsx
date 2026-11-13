import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { getVolume, isSoundOn, play, setSoundOn, setVolume, subscribe } from "../sound/sfx";
import { SpeakerOff, SpeakerOn } from "./Icons";

/** Speaker button that opens a small panel: on/off switch plus a volume slider. */
export default function SoundToggle({ className = "" }) {
  const on = useSyncExternalStore(subscribe, isSoundOn, () => true);
  const volume = useSyncExternalStore(subscribe, getVolume, () => 0.7);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const sliderId = useId();
  const pct = Math.round(volume * 100);
  const audible = on && pct > 0;

  // Close on outside click or Escape (without letting Escape close a parent dialog).
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        data-sfx="none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Sound settings (${audible ? `${pct}%` : "off"})`}
        title="Sound"
        className={`grid h-10 w-10 place-items-center rounded-full bg-card transition hover:bg-white ${
          audible ? "text-ink" : "text-ink/40"
        } ${open ? "ring-2 ring-ink" : ""} ${className}`}
      >
        {audible ? <SpeakerOn /> : <SpeakerOff />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Sound settings"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] animate-fade-in rounded-[24px] bg-white p-4 text-left shadow-[0_18px_50px_-18px_rgba(28,27,25,0.45)] ring-1 ring-ink/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold">Sound effects</span>
            <button
              type="button"
              role="switch"
              data-sfx="none"
              aria-checked={on}
              aria-label="Sound effects"
              onClick={() => setSoundOn(!on)}
              className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-ink" : "bg-ink/15"}`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left] ${on ? "left-6" : "left-1"}`}
              />
            </button>
          </div>

          <div className={`mt-4 flex items-center gap-3 ${on ? "" : "opacity-40"}`}>
            <SpeakerOff width={16} height={16} className="shrink-0 text-ink/50" />
            <label htmlFor={sliderId} className="sr-only">
              Volume
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={pct}
              disabled={!on}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              // Preview the new level when the user lets go.
              onPointerUp={() => play("tap")}
              onKeyUp={(e) => e.key.startsWith("Arrow") && play("tap")}
              className="volume-slider min-w-0 flex-1"
              style={{ "--fill": `${pct}%` }}
            />
            <span className="w-10 shrink-0 text-right text-[13px] tabular-nums text-ink/60">{pct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
