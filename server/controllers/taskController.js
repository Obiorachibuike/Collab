import Task from '../models/Task.js'
import { logAction } from './logController.js'
import { smartAssign } from '../utils/smartAssign.js'
import { isConflict } from '../utils/conflictHandler.js'

// ✅ Create Task
// controllers/taskController.js
export const createTask = (io) => async (req, res) => {
  try {
    const { board } = req.body;
    if (!board) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    const assignedTo = await smartAssign();

    const task = await Task.create({
      ...req.body,
      assignedTo,
      updatedBy: req.user._id,
    });

    await logAction('create', task._id, req.user._id, task);

    // ✅ Emit using socket.io if workspaceId was sent
    const { workspaceId } = req.body;
    if (workspaceId) {
      io.to(workspaceId).emit('taskCreated', task);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};


// ✅ Update Task
export const updateTask = (io) => async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })

    if (isConflict(req.body.updatedAt, task.updatedAt)) {
      return res.status(409).json({ message: 'Conflict', serverTask: task, clientTask: req.body })
    }

    const { title, description, status, priority, board } = req.body

    task.title = title ?? task.title
    task.description = description ?? task.description
    task.status = status ?? task.status
    task.priority = priority ?? task.priority
    task.board = board ?? task.board
    task.updatedBy = req.user._id
    task.updatedAt = new Date()

    await task.save()
    await logAction('update', task._id, req.user._id, task)

    io.to(task.board.toString()).emit('taskUpdated', task)
    res.json(task)
  } catch (err) {
    console.error('Error updating task:', err)
    res.status(500).json({ message: 'Failed to update task' })
  }
}

// ✅ Move Task
export const moveTask = (io) => async (req, res) => {
  try {
    const { board, status, updatedAt } = req.body

    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })

    if (isConflict(updatedAt, task.updatedAt)) {
      return res.status(409).json({
        message: 'Conflict during drag-and-drop move',
        serverTask: task,
        clientTask: req.body
      })
    }

    task.board = board ?? task.board
    task.status = status ?? task.status
    task.updatedBy = req.user._id
    task.updatedAt = new Date()

    await task.save()
    await logAction('move', task._id, req.user._id, task)

    io.to(task.board.toString()).emit('taskMoved', task)
    res.json(task)
  } catch (err) {
    console.error('Error moving task:', err)
    res.status(500).json({ message: 'Failed to move task' })
  }
}

// ✅ Delete Task
export const deleteTask = (io) => async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })

    await logAction('delete', task._id, req.user._id, task)
    io.to(task.board.toString()).emit('taskDeleted', task._id)

    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error('Error deleting task:', err)
    res.status(500).json({ message: 'Failed to delete task' })
  }
}

// ✅ Get All Tasks
export const getTasks = (io) => async (req, res) => {
  try {
    const tasks = await Task.find().populate('board')
    res.json(tasks)
    io.emit('tasksFetched', tasks)
  } catch (err) {
    console.error('Error fetching tasks:', err)
    res.status(500).json({ message: 'Failed to fetch tasks' })
  }
}
