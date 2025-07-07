import Log from '../models/Log.js';

export const logAction = async (action, taskId, userId, details) => {
  await Log.create({ action, taskId, userId, details });
};

export const getLogs = async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(20);
  res.json(logs);
};