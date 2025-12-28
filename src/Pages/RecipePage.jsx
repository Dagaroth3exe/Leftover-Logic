import React from "react";
import Logo from "../assets/Logo.png";
import { useLocation } from "react-router";
import { FakeRecipes } from "../utils/FakeRecipes";
import Button from "@mui/material/Button";

const RecipePage = () => {
  const location = useLocation();
  const ingredients = location.state?.ingredients || [];
  const recipes = FakeRecipes(ingredients);

  return (
    <>
      <div className="p-4 h-screen bg-blue-200 flex items-center justify-center flex-col overflow-hidden">
        <img
          src={Logo}
          alt="Company Logo"
          className="pointer-events-none w-40 sm:w-52 md:w-72 mb-8"
        />

        <h1 className="pb-5 text-4xl sm:text-4xl font-bold">Take your Pick</h1>

        <div className="mb-16 cardContainer flex flex-col sm:flex-row flex-wrap justify-center gap-7 ">
          <div className="RecipeCard1 bg-[#FF3131] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center relative">
            <div className="h-36 w-72 bg-[#4B0000] p-3 rounded-2xl -translate-y-[105px] flex items-start justify-start">
              <h1 className="font-semibold text-white mt-2 ml-2">
                {recipes[0].title}
              </h1>
            </div>
            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-lg text-[#4B0000] h-12 w-72 rounded-xl font-semibold  hover:bg-[#4B0000] hover:text-white transition duration-150">Show me How</button>
          </div>
          <div className="RecipeCard2 bg-[#3179FF] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center relative">
            <div className="h-36 w-72 bg-[#000A4B] p-3 rounded-2xl -translate-y-[105px] flex items-start justify-start">
              <h1 className="font-semibold text-white mt-2 ml-2">
                {recipes[1].title}
              </h1>
            </div>
            <button className="font-semibold absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg bg-white text-[#000A4B] px-4 py-2 rounded-xl h-12 w-72 shadow hover:bg-[#000A4B] hover:text-white transition duration-150">
              Show me How
            </button>
          </div>
          <div className="RecipeCard3 bg-[#E3FF31] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center relative flex-col">
            <div className="h-36 w-72 bg-[#464B00] p-3 rounded-2xl -translate-y-[105px] flex items-start justify-start">
              <h1 className="font-semibold text-white mt-2 ml-2">
                {recipes[2].title}
              </h1>
            </div>
            <button className="font-semibold absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl shadow text-lg text-[#464B00] bg-white h-12 w-72 hover:bg-[#464B00] hover:text-white transition duration-150">Show me How</button>

          </div>
        </div>
      </div>
    </>
  );
};

export default RecipePage;
