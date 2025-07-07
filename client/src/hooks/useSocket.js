import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('https://collab-icwm.onrender.com', { autoConnect: false })

export const useSocket = (boardId, handlers = {}) => {
  useEffect(() => {
    socket.connect()
    socket.emit('joinBoard', boardId)

    Object.entries(handlers).forEach(([evt, cb]) => socket.on(evt, cb))

    return () => {
      Object.entries(handlers).forEach(([evt, cb]) => socket.off(evt, cb))
      socket.emit('leaveBoard', boardId)
      socket.disconnect()
    }
  }, [boardId])
  return socket
}
