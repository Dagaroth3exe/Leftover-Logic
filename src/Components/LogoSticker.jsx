import Logo from "../assets/Logo.png";

export default function LogoSticker({ className = "" }) {
  return (
    <div className={`relative pointer-events-none ${className}`}>
      {/* White sticker background behind LOGIC text */}
      <div
        className="absolute bg-white rounded-2xl z-0"
        style={{
          left: "68%",
          top: "55%",
          width: "29%",
          height: "34%",
          boxShadow:
            "0 3px 14px rgba(0,0,0,0.35), 0 0 0 1.5px rgba(255,255,255,0.5)",
        }}
      />
      <img
        src={Logo}
        alt="Leftover Logic"
        className="relative z-10 w-full drop-shadow-2xl"
      />
    </div>
  );
}
