import React, { useState } from 'react'

export default function RegisterForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ name, email, password }) }} className="bg-white dark:bg-gray-900 p-6 rounded shadow-md max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center dark:text-white">Register</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required className="w-full rounded border dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 dark:text-white" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full rounded border dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 dark:text-white" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full rounded border dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 dark:text-white" />
      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Register</button>
    </form>
  )
}
