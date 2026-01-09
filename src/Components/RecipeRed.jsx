import React from "react";

function RecipeRed({ data, onClose }) {
  if (!data) return null;

  return (
    // Fixed Overlay
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Main Content Wrapper */}
      <div className="w-full max-w-5xl relative">
        {/* Close Button (The 'X') */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-[#FF3131] hover:text-[#4B0000] rounded-full p-2 shadow-lg font-bold z-10"
        >
          ✕
        </button>

        {/* Red Recipe Box */}
        <div className="bg-[#FF3131] flex flex-col items-start rounded-xl p-4 shadow-2xl max-h-[85vh]">
          {/* Dish Name */}
          <h1 className="font-bold text-[#4B0000] text-3xl mb-4 px-1">
            {data.title}
          </h1>

          {/* White Content Box (Scrollable) */}
          <div className="bg-white w-full p-8 rounded-lg text-xl text-gray-800 leading-relaxed overflow-y-auto">
            {/* Description Section */}
            <p className="italic text-gray-500 mb-6 border-b pb-4">
              {data.description}
            </p>

            <ul className="list-disc pl-6 space-y-4 font-medium">
              {data.instructions
                /* 1. Split by new lines OR by a period followed by a space */
                ?.split(/\n|\.(?=\s)/)
                .filter((line) => line.trim())
                .map((step, i) => (
                  <li key={i} className="pl-2 leading-relaxed">
                    {/* 2. Clean up any leftover punctuation or list markers */}
                    {step.trim().replace(/^\d+\.\s*|^\*\s*|^\-\s*/, "")}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeRed;
