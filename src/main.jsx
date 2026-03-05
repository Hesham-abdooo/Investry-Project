import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// any file will be linked here will reflected on your entire app (يعني اي ملف هتربطه هنا هيتطبق ع الابلكيشن كله)
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
 import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css"




import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
