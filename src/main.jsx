import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Artikkles from './pages/Artikkles.jsx'
import Grammatik from './pages/Grammatik.jsx'
import Verben from './pages/Verben.jsx'
import Home from './pages/Home.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artikel" element={<Artikkles />} />
        <Route path="/ueben" element={<App />} />
        <Route path="/grammatik" element={<Grammatik />} />
        <Route path="/verben" element={<Verben />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
