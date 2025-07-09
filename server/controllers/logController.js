// controllers/logController.js
import Log from '../models/Log.js'

export const logAction = async (action, taskId, userId, details) => {
  await Log.create({ action, taskId, userId, details })
}

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 }) // Most recent first
      .limit(20) // Return last 20 logs
      .lean()    // Return plain JS objects
    res.json(logs)
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err)
    res.status(500).json({ message: 'Failed to fetch logs' })
  }
}
