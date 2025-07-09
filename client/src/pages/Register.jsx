import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const nav = useNavigate()
  const { setUser } = useAuth()

  const handleRegister = async (data) => {
    try {
      await axios.post('/auth/register', data)
      const res = await axios.get('/auth/me')
      setUser(res.data)
      nav('/')
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-6">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  )
}
