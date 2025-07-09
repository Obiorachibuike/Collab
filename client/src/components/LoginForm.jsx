import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ email, password })
      }}
      className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-500"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
        Sign in to your account
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300 ease-in-out shadow-md"
      >
        Login
      </button>

      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
