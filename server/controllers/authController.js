import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Helper: Send cookie
const sendTokenResponse = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  })
}

export const register = async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'User already exists' })

  const user = await User.create({ name, email, password })
  sendTokenResponse(user, res)
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    sendTokenResponse(user, res)
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  })
  res.status(200).json({ message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: 'Not authenticated' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json(user)
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}