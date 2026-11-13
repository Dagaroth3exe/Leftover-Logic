// Animated, hand-drawn style dish illustrations. Animations live in index.css
// (.art-*) and all share a 160×120 viewBox so they line up side by side.

const SHADOW = "#2A211B";

function Steam({ xs, y = 44, color = "#CDBBA7" }) {
  return (
    <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      {xs.map((x, i) => (
        <path
          key={x}
          className="art-steam"
          style={{ animationDelay: `${-i * 0.9}s` }}
          d={`M${x} ${y}c-5-6 5-10 0-16s5-10 0-16`}
        />
      ))}
    </g>
  );
}

/** Copper kadai of bubbling curry with steam and a coriander leaf. */
function IndianPot() {
  return (
    <>
      <Steam xs={[64, 80, 96]} y={46} />
      <ellipse cx="80" cy="110" rx="50" ry="5" fill={SHADOW} opacity="0.08" />
      <g fill="none" stroke="#9A4F1C" strokeWidth="5" strokeLinecap="round">
        <path d="M30 66q-13 0-13-9" />
        <path d="M130 66q13 0 13-9" />
      </g>
      <path d="M26 60Q26 106 80 106Q134 106 134 60Z" fill="#C8742F" />
      <path d="M34 80Q80 94 126 80" stroke="#A85A22" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M44 72Q56 96 80 98" stroke="#E39A57" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="80" cy="60" rx="56" ry="11" fill="#A85A22" />
      <ellipse cx="80" cy="60" rx="49" ry="8" fill="#E8862A" />
      <ellipse cx="70" cy="58" rx="22" ry="3" fill="#F4A653" opacity="0.8" />
      {[
        [62, 61, 3, 0],
        [86, 62, 2.5, -0.6],
        [100, 59, 2, -1.1],
        [74, 63, 2, -1.4],
      ].map(([cx, cy, r, d]) => (
        <circle key={cx} className="art-bubble" cx={cx} cy={cy} r={r} fill="#F8BE6E" style={{ animationDelay: `${d}s` }} />
      ))}
      <g className="art-bob">
        <path d="M90 58q5-7 11-2q-5 6-11 2z" fill="#4C9A45" />
        <path d="M90 58q-2-6 3-9q3 5-3 9z" fill="#5FAF52" />
      </g>
    </>
  );
}

/** Plate of spaghetti with a twirling fork and a swaying basil leaf. */
function ItalianPlate() {
  return (
    <>
      <Steam xs={[60, 100]} y={50} />
      <ellipse cx="80" cy="110" rx="58" ry="5" fill={SHADOW} opacity="0.08" />
      <ellipse cx="80" cy="94" rx="64" ry="16" fill="#FFFFFF" stroke="#E7DCCD" strokeWidth="2" />
      <ellipse cx="80" cy="92" rx="46" ry="10" fill="#F6EFE5" />
      <path d="M40 90Q44 64 80 62Q116 64 120 90Q80 99 40 90Z" fill="#F2C14E" />
      <g fill="none" stroke="#DCA23A" strokeWidth="2" strokeLinecap="round">
        <path d="M48 86q8-9 16 0t16 0t16 0t16 0" />
        <path d="M54 78q7-8 14 0t14 0t14 0t12 0" />
        <path d="M62 70q6-6 12 0t12 0t12 0" />
      </g>
      <path d="M60 72Q80 58 100 72Q91 80 80 78Q68 80 60 72Z" fill="#D6402F" />
      <circle cx="74" cy="70" r="2.2" fill="#F07A64" />
      <circle cx="88" cy="72" r="1.8" fill="#F07A64" />
      <g className="art-bob" style={{ animationDelay: "-0.8s" }}>
        <path d="M96 64q8-8 16-2q-8 8-16 2z" fill="#4C9A45" />
        <path d="M97 64l13-1" stroke="#3A7A35" strokeWidth="1" />
      </g>
      <g className="art-twirl">
        <rect x="78" y="10" width="4" height="40" rx="2" fill="#B9B2A9" />
        <path d="M72 50q8 7 16 0v6q-8 7-16 0z" fill="#B9B2A9" />
        <g stroke="#B9B2A9" strokeWidth="2.4" strokeLinecap="round">
          <path d="M73 55v9M78 57v9M82 57v9M87 55v9" />
        </g>
        <path d="M68 62q12 9 24 0" stroke="#F2C14E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M70 67q10 7 20 0" stroke="#E6B040" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

/** Wok tossing vegetables and tofu over flickering flames. */
function ChineseWok() {
  const pieces = [
    { el: <ellipse cx="62" cy="64" rx="7" ry="3.5" fill="#6BAF5B" />, d: 0 },
    { el: <rect x="74" y="60" width="7" height="7" rx="1.5" fill="#F4E9D0" stroke="#E2D3B5" />, d: -0.08 },
    { el: <rect x="86" y="62" width="9" height="3.5" rx="1.5" fill="#F08A24" />, d: -0.16 },
    { el: <path d="M98 60q6 1 6 6q-6 0-6-6z" fill="#D6402F" />, d: -0.05 },
    { el: <ellipse cx="70" cy="66" rx="5" ry="2.5" fill="#8BC77A" />, d: -0.2 },
  ];
  return (
    <>
      <ellipse cx="78" cy="114" rx="44" ry="4" fill={SHADOW} opacity="0.08" />
      {[
        [62, "#F59E0B", 0],
        [78, "#F97316", -0.2],
        [94, "#F59E0B", -0.1],
      ].map(([x, c, d]) => (
        <g key={x} className="art-flame" style={{ animationDelay: `${d}s` }}>
          <path d={`M${x} 112q-8-8-1-20q2 6 6 8q3-5 2-10q8 9 1 22z`} fill={c} />
          <path d={`M${x + 1} 112q-4-4 0-10q3 5 3 10z`} fill="#FDE68A" />
        </g>
      ))}
      <g className="art-wok">
        <path d="M26 68Q30 100 76 100Q122 100 126 68Z" fill="#3A3532" />
        <path d="M38 80Q76 94 114 80" stroke="#55504B" strokeWidth="3" fill="none" opacity="0.7" />
        <ellipse cx="76" cy="68" rx="50" ry="6" fill="#55504B" />
        <ellipse cx="76" cy="68" rx="44" ry="4" fill="#2A2522" />
        <rect x="122" y="65" width="10" height="5" rx="1.5" fill="#55504B" />
        <rect x="130" y="63.5" width="30" height="8" rx="4" fill="#8B5A2B" />
      </g>
      {pieces.map((p, i) => (
        <g key={i} className="art-toss" style={{ animationDelay: `${p.d}s` }}>
          {p.el}
        </g>
      ))}
    </>
  );
}

/** Generic stockpot used by the loading and error screens. */
export function StockPot({ smoky = false }) {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full overflow-visible" aria-hidden>
      <Steam xs={[62, 80, 98]} y={42} color={smoky ? "#8F857B" : "#CDBBA7"} />
      <ellipse cx="80" cy="112" rx="52" ry="5" fill={SHADOW} opacity="0.08" />
      <g fill="#8E877F">
        <rect x="16" y="56" width="16" height="7" rx="3.5" />
        <rect x="128" y="56" width="16" height="7" rx="3.5" />
      </g>
      <path d="M28 52H132V98Q132 110 118 110H42Q28 110 28 98Z" fill="#CFC8BF" />
      <rect x="28" y="66" width="104" height="5" fill="#BDB5AB" />
      <path d="M40 60V98" stroke="#E4DED7" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="80" cy="52" rx="54" ry="8" fill="#ABA39A" />
      <ellipse cx="80" cy="52" rx="48" ry="5" fill={smoky ? "#4A3F36" : "#E8862A"} />
    </svg>
  );
}

const ART = { indian: IndianPot, italian: ItalianPlate, chinese: ChineseWok };

export default function DishArt({ cuisine, className = "" }) {
  const Art = ART[cuisine];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 160 120" className={`h-full w-full overflow-visible ${className}`} aria-hidden>
      <Art />
    </svg>
  );
}
