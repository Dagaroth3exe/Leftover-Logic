import { useState } from 'react'
import Logo from '../assets/Logo.png'
import MagicButton from '../Components/MagicButton'

export default function Landing() {
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])

  const addIngredients = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      setIngredients((prev) => [...prev, input.trim()])
      setInput("")
    }
  }

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center flex-col">
      <img
        src={Logo}
        alt="Company Logo"
        className="pointer-events-none"
        style={{ width: "900px", transform: "translateY(-130px)" }}
      />

      <div className="relative w-[600px] -translate-y-[150px]">
        <input
          type="text"
          placeholder="e.g., half a lemon, stale bread, milk..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addIngredients}
          className="
            px-6 py-2 rounded-full
            w-full h-[50px]
            font-outfit placeholder-gray-500
            pr-36
          "
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
          <MagicButton
            onClick={() => {
              if (input.trim() !== '') {
                setIngredients((prev) => [...prev, input.trim()])
                setInput('')
              }
            }}
          >
            <span>Work Your Magic</span>
          </MagicButton>
        </div>
        
      </div>
    </div>
  )
}
