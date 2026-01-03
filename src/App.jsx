import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import RecipePage from './Pages/RecipePage'

import CardRecipe from './Pages/CardRecipe'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Recipe" element={<RecipePage/>}/>
        <Route path="/RecipeCard" element={<CardRecipe/>}/>
      </Routes>
    </>
  )
}

export default App