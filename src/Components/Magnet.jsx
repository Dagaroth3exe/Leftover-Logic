import { magnetColor, tiltFor } from "../theme";
import { ingredientEmoji } from "../utils/ingredientEmoji";

/** An ingredient as a tilted fridge magnet. Pass onRemove to make it removable. */
export default function Magnet({ name, onRemove, small = false, delay = 0 }) {
  const style = {
    background: magnetColor(name),
    "--tilt": `${tiltFor(name)}deg`,
    animationDelay: `${delay}ms`,
  };
  const cls = `tilt magnet-edge inline-flex animate-stick items-center gap-1.5 rounded-full font-medium text-ink ${
    small ? "px-2.5 py-1 text-[13px]" : "px-3.5 py-2 text-[15px]"
  }`;
  const body = (
    <>
      <span aria-hidden>{ingredientEmoji(name)}</span>
      {name}
    </>
  );

  if (!onRemove) {
    return (
      <span className={cls} style={style}>
        {body}
      </span>
    );
  }
  return (
    <button
      type="button"
      data-sfx="none"
      onClick={() => onRemove(name)}
      aria-label={`Remove ${name}`}
      className={`${cls} group`}
      style={style}
    >
      {body}
      <span aria-hidden className="ml-0.5 text-ink/35 transition-colors group-hover:text-ink">
        ×
      </span>
    </button>
  );
}
