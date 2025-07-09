const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // 🏢 Join a specific workspace room
    socket.on('joinWorkspace', (workspaceId) => {
      if (!workspaceId) return;
      socket.join(workspaceId);
      console.log(`🔗 Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    // 🚪 Leave a specific workspace room
    socket.on('leaveWorkspace', (workspaceId) => {
      if (!workspaceId) return;
      socket.leave(workspaceId);
      console.log(`🚪 Socket ${socket.id} left workspace ${workspaceId}`);
    });

    // 📦 Task created in a board (column) inside a workspace
    socket.on('taskCreated', ({ workspaceId, task }) => {
      if (workspaceId && task) {
        io.to(workspaceId).emit('taskCreated', task);
        console.log(`📦 Task created in workspace ${workspaceId}: ${task.title}`);
      }
    });

    // ✏️ Task updated
    socket.on('taskUpdated', ({ workspaceId, task }) => {
      if (workspaceId && task) {
        io.to(workspaceId).emit('taskUpdated', task);
        console.log(`✏️ Task updated in workspace ${workspaceId}: ${task.title}`);
      }
    });

    // 🗑️ Task deleted
    socket.on('taskDeleted', ({ workspaceId, taskId }) => {
      if (workspaceId && taskId) {
        io.to(workspaceId).emit('taskDeleted', taskId);
        console.log(`🗑️ Task deleted in workspace ${workspaceId}: ${taskId}`);
      }
    });

    // 📁 Board (column) created in workspace
    socket.on('boardCreated', ({ workspaceId, board }) => {
      if (workspaceId && board) {
        io.to(workspaceId).emit('boardCreated', board);
        console.log(`📁 Board created in workspace ${workspaceId}: ${board.name}`);
      }
    });

    // 🛠️ Board updated
    socket.on('boardUpdated', ({ workspaceId, board }) => {
      if (workspaceId && board) {
        io.to(workspaceId).emit('boardUpdated', board);
        console.log(`🛠️ Board updated in workspace ${workspaceId}: ${board.name}`);
      }
    });

    // 💥 Board deleted
    socket.on('boardDeleted', ({ workspaceId, boardId }) => {
      if (workspaceId && boardId) {
        io.to(workspaceId).emit('boardDeleted', boardId);
        console.log(`💥 Board deleted in workspace ${workspaceId}: ${boardId}`);
      }
    });

    // ❌ Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export default initSocket;
