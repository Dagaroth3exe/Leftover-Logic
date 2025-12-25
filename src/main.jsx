import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "@cloudscape-design/global-styles/index.css"
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/checkbox/checkbox.js'
import "@material/web/progress/circular-progress.js";


const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
