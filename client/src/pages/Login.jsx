import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const nav = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (data) => {
    try {
      await axios.post('/auth/login', data)
      const res = await axios.get('/auth/me')
      setUser(res.data)
      nav('/')
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}
