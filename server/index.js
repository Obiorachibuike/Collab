import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import logRoutes from './routes/logRoutes.js';
import boardRoutes from './routes/boardRoutes.js'; // ✅ Task column routes
import taskRoutesFn from './routes/taskRoutes.js'; // ✅ Task route factory
import initSocket from './socket/index.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server for Socket.IO integration
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Initialize socket logic
initSocket(io);

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);          // 🔹 Task columns (not full workspace)
app.use('/api/logs', logRoutes);
app.use('/api/tasks', taskRoutesFn(io));      // 🔸 Tasks route injected with Socket.IO
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
