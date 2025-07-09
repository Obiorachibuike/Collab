import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me')
        setUser(res.data)
      } catch (err) {
        console.warn('❌ Failed to fetch user:', err.message || err)
        setUser(null)

        // Optional fallback (only if you store user in localStorage)
        // const stored = localStorage.getItem('user')
        // if (stored) {
        //   setUser(JSON.parse(stored))
        // }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (err) {
      console.warn('Logout failed:', err.message)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
