import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: String,
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  details: Object,
});

export default mongoose.model('Log', logSchema);