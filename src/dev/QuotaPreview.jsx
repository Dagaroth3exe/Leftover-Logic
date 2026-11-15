// DEV ONLY: a floating button that previews the "Gemini API limit" screen in a
// popup, so it can be checked without actually burning through the quota.
// Mounted from App.jsx behind import.meta.env.DEV, so it never ships to production.
import { useEffect, useState } from "react";
import ErrorScreen from "../Components/ErrorScreen";
import { Close } from "../Components/Icons";
import { play } from "../sound/sfx";

// Same copy the backend returns with code "quota" (backend/server.js).
const QUOTA_ERROR = {
  code: "quota",
  message: "My creator's broke. No API tokens, just free-tier dreams. 💀🥲 Try later!",
};

export default function QuotaPreview() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    play("error");
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        data-sfx="none"
        onClick={show}
        className="fixed bottom-24 left-4 z-40 rounded-full border border-dashed border-ink/40 bg-card/95 px-3.5 py-2 text-[13px] text-ink/70 shadow-sm transition hover:border-ink hover:text-ink lg:bottom-4"
      >
        🧪 Preview API-limit screen <span className="text-[11px] text-ink/40">dev</span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Preview: API limit screen" className="fixed inset-0 z-[70] overflow-y-auto bg-paper">
          <div className="fixed left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-dashed border-ink/30 bg-card px-3.5 py-1.5 text-[13px] text-ink/60">
            🧪 Preview: what users see when Gemini's quota is hit
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close preview"
            className="fixed right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-card ring-1 ring-ink/10 transition hover:bg-white"
          >
            <Close />
          </button>
          <ErrorScreen error={QUOTA_ERROR} onRetry={() => setOpen(false)} onChangeFridge={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
