import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import LevelDashboard from './pages/LevelDashboard/LevelDashboard'
import Layout from './components/Layout/Layout'
import LevelMap from './pages/LevelMap/LevelMap'
import LevelPlay from './pages/LevelPlay/LevelPlay'
import Rewards from './pages/Rewards/Rewards'
import Ranks from './pages/Ranks/Ranks'
import Profile from './pages/Profile/Profile'
import { ProgressProvider } from './hooks/useProgress'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProgressProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/Lvl-Dashboard" element={<LevelDashboard />} />
          <Route path="/Lvl-Dashboard/levels" element={<LevelMap />} />
          <Route path="/Lvl-Dashboard/play/:n" element={<LevelPlay />} />
          <Route path="/Lvl-Dashboard/rewards" element={<Rewards />} />
          <Route path="/Lvl-Dashboard/ranks" element={<Ranks />} />
          <Route path="/Lvl-Dashboard/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/Lvl-Dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </ProgressProvider>
)