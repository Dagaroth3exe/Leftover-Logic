import React from "react";

function RecipeBlue({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-5xl relative">
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-[#3179FF] hover:text-[#000A4B] rounded-full p-2 shadow-lg font-bold z-10"
        >
          ✕
        </button>

        <div className="bg-[#3179FF] flex flex-col items-start rounded-xl p-4 shadow-2xl max-h-[85vh]">
          <h1 className="font-bold text-[#000A4B] text-3xl mb-4 px-1">
            {data.title}
          </h1>

          <div className="bg-white w-full p-8 rounded-lg text-xl text-gray-800 leading-relaxed overflow-y-auto">
            <p className="italic text-gray-500 mb-6 border-b pb-4">
                {data.description}
            </p>

            <ul className="list-none space-y-4 font-medium">
              {data.instructions
                ?.split(/(?=\d+\.\s)|\n/)
                .filter((line) => line.trim())
                .map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step.trim()}
                  </li>
                ))}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeBlue;