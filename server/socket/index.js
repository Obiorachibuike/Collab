const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`)

    // Join a specific board room
    socket.on('joinBoard', (boardId) => {
      socket.join(boardId)
      console.log(`🔗 Socket ${socket.id} joined board ${boardId}`)
    })

    // Leave a specific board room
    socket.on('leaveBoard', (boardId) => {
      socket.leave(boardId)
      console.log(`🚪 Socket ${socket.id} left board ${boardId}`)
    })

    // Example: Task created
    socket.on('taskCreated', ({ boardId, task }) => {
      if (boardId) {
        io.to(boardId).emit('taskCreated', task)
        console.log(`📦 Task broadcast to board ${boardId}:`, task.title)
      }
    })

    // Example: Task updated
    socket.on('taskUpdated', ({ boardId, task }) => {
      if (boardId) {
        io.to(boardId).emit('taskUpdated', task)
        console.log(`✏️ Task updated on board ${boardId}:`, task.title)
      }
    })

    // Example: Task deleted
    socket.on('taskDeleted', ({ boardId, taskId }) => {
      if (boardId) {
        io.to(boardId).emit('taskDeleted', taskId)
        console.log(`🗑️ Task deleted from board ${boardId}:`, taskId)
      }
    })

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`)
    })
  })
}

export default initSocket