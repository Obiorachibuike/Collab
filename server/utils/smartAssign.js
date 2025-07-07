import Task from '../models/Task.js';
import User from '../models/User.js';

export const smartAssign = async () => {
  const users = await User.find();
  const tasks = await Task.find({ status: { $ne: 'Done' } });

  const load = {};
  users.forEach(u => load[u._id] = 0);
  tasks.forEach(t => {
    if (t.assignedTo) load[t.assignedTo]++;
  });

  const [userId] = Object.entries(load).sort((a, b) => a[1] - b[1])[0];
  return userId;
};