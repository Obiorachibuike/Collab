import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from '../controllers/taskController.js';

const taskRoutes = (io) => {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Tasks
   *   description: Task management endpoints
   */

  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     summary: Get all tasks for the authenticated user
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of tasks
   *       401:
   *         description: Unauthorized
   */
  router.get('/', protect, getTasks);

  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - status
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [Todo, In Progress, Done]
   *               priority:
   *                 type: string
   *                 enum: [Low, Medium, High]
   *     responses:
   *       201:
   *         description: Task created
   *       400:
   *         description: Validation error
   */
  router.post('/', protect, createTask(io));

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update an existing task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: string
   *               priority:
   *                 type: string
   *     responses:
   *       200:
   *         description: Task updated
   *       404:
   *         description: Task not found
   */
  router.put('/:id', protect, updateTask(io));

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task by ID
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *     responses:
   *       200:
   *         description: Task deleted
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', protect, deleteTask(io));

  return router;
};

export default taskRoutes;