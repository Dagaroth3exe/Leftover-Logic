import { useState } from 'react'
import Logo from '../assets/Logo.png'
import MagicButton from '../Components/MagicButton'
import Tiffins from '../assets/Tiffins.png'
import Snowfall from "react-snowfall"
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])

  const[loading, setLoading] = useState(false)

  const handleSubmit = (e) =>{
    e.preventDefault();

    if (input.trim()=== "") return;

    const finalIngredients = [...ingredients, input.trim()];

    console.log("Final Ingredients", finalIngredients);
    setIngredients(finalIngredients);

    setInput("");

    navigate("/Recipe",{
      state:{ingredients : finalIngredients},
    });
  };

  const handleNavigate = () =>{
    const finalIngredients = input.trim() !=="" //check if the input is empty
    ?[...ingredients, input.trim()] //prints a new list with updated elements
    :ingredients; //else return the original list


    navigate("/Recipe", {state:{ingredients : finalIngredients}})
  }

  return (

    <div className="min-h-screen bg-blue-200 flex items-center justify-center flex-col">
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
        snowflakeCount={200}
        color="#ffffff"
      />

      
      <img
        src={Logo}
        alt="Company Logo"
        className="pointer-events-none"
        style={{ width: "900px", transform: "translateY(-130px)" }}
      />

      <div className="relative w-[600px] -translate-y-[150px]">
        <img src={Tiffins} alt='Tiffins Decor' className="absolute left-1/2 top-1/2 -translate-x-[400px] -translate-y-[110px] w-72  pointer-events-none z-10 -rotate-12"/>
      </div>

      <div className="relative w-[600px] -translate-y-[150px]">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="e.g., half a lemon, stale bread, milk..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="
              px-6 py-2 rounded-full
              w-full h-[50px]
              font-outfit placeholder-gray-500
              pr-36
              opacity-100
              z-20
              border border-black
            "
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <MagicButton type="submit">
              <span>Work Your Magic</span>
            </MagicButton>
          </div>
        </form>
      </div>
    </div>
  )
}
