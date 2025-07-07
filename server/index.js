// server/server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import logRoutes from './routes/logRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import initSocket from './socket/index.js'


import { swaggerUi, swaggerSpec } from './config/swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Load env variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Initialize Express
const app = express()

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes) // We'll handle io below
app.use('/api/logs', logRoutes)

// Create HTTP server & setup Socket.IO
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
})

// Initialize socket logic
initSocket(io)

// Attach io to taskRoutes if needed
taskRoutes(io) // if you pass io into routes

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))