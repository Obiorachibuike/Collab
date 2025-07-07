import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded shadow"
    >
      {darkMode ? 'Light' : 'Dark'}
    </button>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ThemeToggle />
      </AuthProvider>
    </ThemeProvider>
  )
}
