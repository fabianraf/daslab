import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Artikkles from './pages/Artikkles.jsx'
import Grammatik from './pages/Grammatik.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Artikkles />} />
        <Route path="/practicar" element={<App />} />
        <Route path="/grammatik" element={<Grammatik />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
