import { useState } from 'react'
import Logo from '../assets/Logo.png'

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
      <img src={Logo} alt="Company Logo" 
      style={{width :"900px", transform : "translateY(-130px)", }}
      />

      <input
        type="text"
        placeholder="e.g., half a lemon, stale bread, milk..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addIngredients}
        className="p-2 rounded-full w-[600px] h-[50px] -translate-y-[150px]"
      />

      <div className="mt-4 space-y-2">
        {ingredients.map((item, index) => (
          <div key={index} className="px-3 py-1 bg-white rounded shadow-sm">{item}</div>
        ))}
      </div>
    </div>
  )
}