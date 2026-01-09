import React from "react";

// 👇 Updated to accept 'data' (the recipe info) and 'onClose' (to close the popup)
function RecipeYellow({ data, onClose }) {
  
  // Safety check: If no data is passed, don't render anything
  if (!data) return null;

  return (
    // Fixed Overlay
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      
      {/* Main Content Wrapper */}
      <div className="w-full max-w-5xl relative">
        
        {/* Close Button (The 'X') */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-[#E3FF31] hover:text-[#464B00] rounded-full p-2 shadow-lg font-bold z-10"
        >
          ✕
        </button>

        {/* Red Recipe Box */}
        <div className="bg-[#E3FF31] flex flex-col items-start rounded-xl p-4 shadow-2xl max-h-[85vh]">
          
          {/* Dish Name */}
          <h1 className="font-bold text-[#464B00] text-3xl mb-4 px-1">
            {data.title}
          </h1>

          {/* White Content Box (Scrollable) */}
          <div className="bg-white w-full p-8 rounded-lg text-xl text-gray-800 leading-relaxed overflow-y-auto">
            
            {/* Description Section */}
            <p className="italic text-gray-500 mb-6 border-b pb-4">
                {data.description}
            </p>

            {/* Instructions Section */}
            <ul className="list-disc pl-6 space-y-3 font-medium">
              {data.instructions
                ?.split("\n")
                .filter((line) => line.trim())
                .map((step, i) => (
                  <li key={i} className="pl-2 mb-3 leading-relaxed">
                    {step.replace(/^\d+\.\s*|^\*\s*|^\-\s*/, "")}
                  </li>
                ))}
            </ul>

          </div>
          
        </div>
      </div>
    </div>
  );
}

export default RecipeYellow;