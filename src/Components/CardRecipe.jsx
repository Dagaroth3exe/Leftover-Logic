import React from "react";
import Logo from "../assets/Logo.png";

function CardRecipe(){
    return(
        <div className="p-4 h-screen bg-blue-200 flex items-center justify-center flex-col">
            <div>
                <img
                src={Logo}
                alt="Company Logo"
                className="w-40 sm:w-52 md:w-72 "
                />
            </div>
            <button className="Back text-black bg-white shadow-lg h-10 w-16 rounded-md">Back</button>

            <div className="flex  m-16">
                <div className="bg-[#FF3131] flex flex-col items-center rounded-xl">
                    <h1 className="font-bold text-[#4B0000] px-4 w-[1200px] h-auto">Dish Name</h1>
                    <div className="bg-white w-[1150px] p-2 mb-6 rounded-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque labore facere animi quo illo, sint, numquam a enim dignissimos facilis perferendis accusantium quisquam eos, maxime consequatur quos excepturi veritatis! Quis nostrum dolorum animi perferendis deserunt ad, eius sequi sit aut, nihil provident ratione doloremque rerum porro! Aliquid quos alias sunt id quis? Temporibus sit odio, laudantium distinctio fugiat corrupti ipsa veniam deserunt praesentium error labore delectus minus itaque aspernatur dolores optio a cupiditate culpa reiciendis saepe? Quod, illum? Minima quas neque quia unde accusantium, aspernatur magnam et sapiente quis! Iste ipsum laudantium molestiae cupiditate eum quasi, nisi vero similique expedita? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio asperiores ratione quos provident vero repellendus minus, corrupti delectus illo nulla mollitia tempore dolorum perspiciatis aliquid cumque dignissimos doloribus reprehenderit alias quae nesciunt perferendis facere eligendi! Dolores possimus dolore voluptas nam obcaecati? Necessitatibus, impedit. Suscipit earum aspernatur eaque delectus quae ratione numquam facilis aliquam, velit corporis. Autem, praesentium at itaque assumenda, dolorum, commodi ducimus eius dolorem ratione et quo error molestiae nam. Voluptatibus deleniti asperiores quam consequuntur! Eum nostrum inventore optio libero doloribus tempore quod voluptatum. Nostrum fugit aliquam, beatae eligendi dolor quae neque. Enim eveniet cumque veritatis officia pariatur repellat.</div>
                </div>
            </div>

        </div>
    )
}

export default CardRecipe;