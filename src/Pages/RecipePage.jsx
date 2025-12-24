import React from "react";
import Logo from "../assets/Logo.png"

const RecipePage =()=>{
    return(
        <>
        <div className="min-h-screen bg-blue-200 flex items-center justify-center flex-col">
           <img
                src={Logo}
                alt="Company Logo"
                className="pointer-events-none w-40 sm:w-52 md:w-72 mb-8"

            />

            <h1 className="pb-5 text-xl sm:text-2xl font-bold">Take your Pick</h1>

            <div className="mb-16 cardContainer flex flex-col sm:flex-row flex-wrap justify-center gap-7 ">
                <div className="RecipeCard1 bg-[#FF3131] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center">
                    <div className="h-36 w-72 bg-[#4B0000] p-10 rounded-2xl -translate-y-[105px]"></div>
                </div>
                <div className="RecipeCard2 bg-[#3179FF] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center">
                    <div className="h-36 w-72 bg-[#000A4B] p-10 rounded-2xl -translate-y-[105px]"></div>
                </div>
                <div className="RecipeCard3 bg-[#E3FF31] h-96 w-72 sm:w-80 rounded-2xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center">
                    <div className="h-36 w-72 bg-[#464B00] p-10 rounded-2xl -translate-y-[105px]">Some Recipe</div>
                </div>
            </div>
            
        </div>
        </> 
    )

}

export default RecipePage;