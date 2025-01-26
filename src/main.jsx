import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import './index.css'
import './App.css'
import ROUTER from "./router/Router"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={ROUTER} />
  </StrictMode>,
)
