

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/speener.css'
import "leaflet/dist/leaflet.css";
import { ToastContainer } from 'react-toastify'
// import 'leaflet/dist/leaflet.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
)
