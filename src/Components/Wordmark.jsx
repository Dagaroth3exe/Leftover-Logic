const TOP = "LeftOVER";

/**
 * Typographic version of the logo: heavy red "LeftOVER" with a light "LOGIC"
 * tucked under its right edge. Size it with a text-size class.
 */
export default function Wordmark({ animated = false, className = "" }) {
  return (
    <span
      role="img"
      aria-label="Leftover Logic"
      className={`inline-flex select-none flex-col font-logo items-end leading-[0.85] ${className}`}
    >
      <span aria-hidden className="font-black tracking-[-0.03em] text-brand">
        {animated
          ? TOP.split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block animate-rise"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {ch}
              </span>
            ))
          : TOP}
      </span>
      <span
        aria-hidden
        className={`mt-[0.14em] pr-[0.05em] text-[0.28em] font-normal tracking-[0.08em] text-ink ${
          animated ? "animate-fade-in" : ""
        }`}
        style={animated ? { animationDelay: "480ms" } : undefined}
      >
        LOGIC
      </span>
    </span>
  );
}
