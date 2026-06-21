import React, { useEffect, useState } from "react";
import LinearBuffer from "../Components/LinearBuffer";
import LogoSticker from "../Components/LogoSticker";

const MESSAGES = [
  "Consulting the AI chef...",
  "Rummaging through the fridge...",
  "Preheating the algorithm...",
  "Chopping virtual vegetables...",
  "Tasting for perfection...",
  "Almost ready to plate...",
];

const LoadingScreen = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 flex items-center justify-center flex-col gap-6 px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-red-950/25 rounded-full blur-[100px] pointer-events-none" />

      <LogoSticker className="w-56 sm:w-72 animate-pulse" />

      <div className="text-center">
        <p className="text-gray-300 text-lg font-medium min-h-[28px]">
          {MESSAGES[msgIndex]}
        </p>
        <p className="text-gray-600 text-sm mt-1">This usually takes 5–10 seconds</p>
      </div>

      <div className="w-72 sm:w-80">
        <LinearBuffer onComplete={onComplete} />
      </div>
    </div>
  );
};

export default LoadingScreen;
