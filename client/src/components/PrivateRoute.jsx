import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center mt-20 text-lg text-gray-600 dark:text-gray-300">Loading...</div>

  return user ? children : <Navigate to="/login" />
}
