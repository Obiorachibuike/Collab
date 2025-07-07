import Task from '../models/Task.js';
import { logAction } from './logController.js';
import { smartAssign } from '../utils/smartAssign.js';
import { isConflict } from '../utils/conflictHandler.js';

export const createTask = (io) => async (req, res) => {
  const assignedTo = await smartAssign();
  const task = await Task.create({ ...req.body, assignedTo, updatedBy: req.user._id });
  await logAction('create', task._id, req.user._id, task);
  io.emit('taskCreated', task);
  res.status(201).json(task);
};

export const updateTask = (io) => async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (isConflict(req.body.updatedAt, task.updatedAt)) {
    return res.status(409).json({ message: 'Conflict', serverTask: task, clientTask: req.body });
  }

  Object.assign(task, req.body, { updatedBy: req.user._id, updatedAt: Date.now() });
  await task.save();
  await logAction('update', task._id, req.user._id, task);
  io.emit('taskUpdated', task);
  res.json(task);
};

export const deleteTask = (io) => async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  await logAction('delete', task._id, req.user._id, task);
  io.emit('taskDeleted', task);
  res.json({ message: 'Deleted' });
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};