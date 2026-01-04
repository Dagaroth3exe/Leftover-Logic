import React from "react";
import Logo from "../assets/Logo.png";
import { FakeRecipes } from "../utils/FakeRecipes";
import { useNavigate, useLocation } from "react-router";
import RecipePage from "../Pages/RecipePage";

function RecipeRed() {

    const navigate = useNavigate();
    const location = useLocation();
    
    // Get recipes from route state or use FakeRecipes as fallback
    const recipes = location.state?.recipes || FakeRecipes(["tomato", "cheese", "pasta"]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      
      

      {/* Main Content Wrapper */}
      <div className="w-full max-w-6xl">


        {/* Red Recipe Box - Changed items-center to items-start */}
        <div className="bg-[#FF3131] flex flex-col items-start rounded-xl p-4 shadow-xl">
          
          {/* Dish Name - Now aligns to the left naturally */}
          <h1 className="font-bold text-[#4B0000] text-3xl mb-4 px-1">
            {recipes[0]?.title}
          </h1>

          {/* White Content Box */}
          <div className="bg-white w-full p-8 rounded-lg text-xl text-gray-800 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque labore facere animi quo illo, sint, numquam a enim dignissimos facilis perferendis accusantium quisquam eos, maxime consequatur quos excepturi veritatis! Quis nostrum dolorum animi perferendis deserunt ad, eius sequi sit aut, nihil provident ratione doloremque rerum porro! Aliquid quos alias sunt id quis? Temporibus sit odio, laudantium distinctio fugiat corrupti ipsa veniam deserunt praesentium error labore delectus minus itaque aspernatur dolores optio a cupiditate culpa reiciendis saepe?
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default RecipeRed;