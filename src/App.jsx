import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import RecipePage from './Pages/RecipePage'
import RecipeRed from './Components/RecipeRed'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Recipe" element={<RecipePage/>}/>
        <Route path="/Red" element={<RecipeRed/>}/>
      </Routes>
    </>
  )
}

export default App