# CollabBoard Logic Document

This document explains the internal logic behind two core features of the CollabBoard backend:

1. 🧠 **Smart Assign**
2. ⚔️ **Conflict Detection & Resolution**

---

## 1. 🧠 Smart Assign

**Purpose:**  
Automatically assigns a new task to the user with the **fewest number of active (non-completed)** tasks when the "Smart Assign" button is clicked.

### 🔍 How It Works

1. Fetch all users from the database.
2. For each user, count how many tasks they have that are not marked as `"Done"`.
3. Sort users by their count of active tasks.
4. Return the user with the fewest active tasks.

### 📦 Code Example

```javascript
// utils/smartAssign.js

import Task from '../models/Task.js';
import User from '../models/User.js';

export const smartAssign = async () => {
  const users = await User.find();
  const userTaskCounts = await Promise.all(
    users.map(async (user) => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' },
      });
      return { user, count };
    })
  );

  userTaskCounts.sort((a, b) => a.count - b.count);
  return userTaskCounts[0]?.user || null;
};
```

### ✅ Benefits

- Promotes workload balance
- Reduces task hoarding by a single user
- Enhances team collaboration

---

## 2. ⚔️ Conflict Detection & Resolution

**Purpose:**  
Prevent data loss or overwriting when two or more users edit the same task simultaneously.

### 🔍 Problem Scenario

1. User A opens Task X.
2. User B also opens Task X.
3. User A updates Task X and saves.
4. User B modifies Task X based on stale data and tries to save — creating a conflict.

### ⚙️ Solution Strategy

Each task includes a `lastModified` timestamp.

When an update request is received:

- The system compares the client's `lastModified` value with the current one in the database.
- If they differ, a conflict is detected.

On conflict:

- The server responds with both versions:
  - Client's attempted version
  - Server's latest version

The frontend then shows both versions with an option to:

- Merge manually
- Overwrite
- Cancel

### 📦 Code Example

```javascript
// utils/conflictHandler.js

export const detectConflict = (incomingTask, existingTask) => {
  return new Date(incomingTask.lastModified).getTime() !== new Date(existingTask.lastModified).getTime();
};

// Server Response on Conflict
{
  "conflict": true,
  "message": "Task was updated by another user.",
  "yourVersion": { ... },
  "latestVersion": { ... }
}
```

### ✅ Benefits

- Prevents silent overwrites
- Preserves all user input
- Encourages informed resolution by the user

---

## 🧩 Summary

| Logic Feature          | Purpose                                      | File                     |
|-----------------------|----------------------------------------------|--------------------------|
| 🧠 Smart Assign       | Assign tasks to the least busy user         | utils/smartAssign.js     |
| ⚔️ Conflict Handling   | Prevent and resolve editing collisions       | utils/conflictHandler.js |

---

## 🔗 References

- [MongoDB Aggregation Docs](https://docs.mongodb.com/manual/aggregation/)
- [Real-time Design Patterns with Socket.IO](https://socket.io/docs/v4/)
- [OpenAPI (Swagger) Specification](https://swagger.io/specification/)

---
