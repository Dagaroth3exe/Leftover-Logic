import React, { useState } from "react";

function RecipeYellow({ data, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const steps = (data.instructions ?? "")
    .split(/(?=\d+\.\s)|\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const copyRecipe = () => {
    const text = `${data.title}\n\n${data.description}\n\nInstructions:\n${data.instructions}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-2xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-zinc-800 border border-white/20 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-150 text-sm"
        >
          ✕
        </button>

        <div className="bg-zinc-900 border border-[#C8E000]/25 rounded-2xl overflow-hidden shadow-2xl max-h-[88vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#C8E000]/12 to-transparent px-6 py-5 border-b border-[#C8E000]/15 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[#C8E000]/12 border border-[#C8E000]/30 text-[#D4EB50] text-xs font-bold">
                🇨🇳 Chinese
              </span>
              <button
                onClick={copyRecipe}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.06]"
              >
                {copied ? "✓ Copied!" : "Copy recipe"}
              </button>
            </div>
            <h1 className="font-bold text-white text-2xl leading-snug">{data.title}</h1>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto">
            <p className="text-gray-400 italic mb-6 text-sm leading-relaxed border-l-2 border-[#C8E000]/35 pl-4">
              {data.description}
            </p>

            <h3 className="text-[#D4EB50] font-semibold text-xs uppercase tracking-widest mb-4">
              Instructions
            </h3>

            <ol className="space-y-4 pb-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4 text-gray-300 text-sm leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C8E000]/12 border border-[#C8E000]/25 text-[#D4EB50] text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step.replace(/^\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeYellow;
