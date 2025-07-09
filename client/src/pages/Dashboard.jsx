import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ActivityLog from '../components/ActivityLog'
import KanbanBoard from '../components/KanbanBoard'

const Dashboard = () => {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()

  const [boards, setBoards] = useState([])
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const fetchBoards = async () => {
    console.log('📡 GET /boards - Fetching boards...')
    try {
      const res = await axios.get('/boards', authHeaders)
      setBoards(res.data)
      console.log('✅ Boards fetched:', res.data)
    } catch (err) {
      console.error('❌ Error fetching boards:', err)
    }
  }

  const fetchTasks = async () => {
    console.log('📡 GET /tasks - Fetching tasks...')
    try {
      const res = await axios.get('/tasks', authHeaders)
      setTasks(res.data)
      console.log('✅ Tasks fetched:', res.data)
    } catch (err) {
      console.error('❌ Error fetching tasks:', err)
    }
  }

  const fetchLogs = async () => {
    console.log('📡 GET /logs - Fetching logs...')
    try {
      const res = await axios.get('/logs', authHeaders)
      setLogs(res.data)
      console.log('✅ Logs fetched:', res.data)
    } catch (err) {
      console.error('❌ Error fetching logs:', err)
    }
  }

  const handleDrop = async (e, newStatus, boardId) => {
    const taskId = e.dataTransfer.getData('taskId')
    const task = tasks.find(t => t._id === taskId)
    if (!task) return

    const updated = { ...task, status: newStatus, board: boardId }
    console.log(`📡 PUT /tasks/${taskId} - Updating task:`, updated)

    try {
      const res = await axios.put(`/tasks/${taskId}`, updated, authHeaders)
      const updatedTasks = tasks.map(t => (t._id === taskId ? res.data : t))
      setTasks(updatedTasks)
      console.log('✅ Task updated:', res.data)
    } catch (err) {
      console.error('❌ Failed to update task:', err)
    }
  }

  const createBoard = async () => {
    const name = prompt('Enter board name:')
    if (!name) return

    console.log('📡 POST /boards - Creating board:', { name })
    try {
      const res = await axios.post('/boards', { name }, authHeaders)
      setBoards(prev => [...prev, res.data])
      console.log('✅ Board created:', res.data)
    } catch (err) {
      console.error('❌ Failed to create board:', err)
    }
  }

  // ✅ define this before any JSX render
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId)
    console.log('Dragging task with ID:', taskId)
  }




  useEffect(() => {
    if (user) {
      fetchBoards()
      fetchTasks()
      fetchLogs()
    }
  }, [user, token])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="p-4 overflow-auto flex-1">
        <h2 className="text-xl font-semibold mb-4">Boards</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => {
            const boardTasks = tasks.filter(task => task.board === board._id)

            return (
              <div
                key={board._id}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded p-4 shadow transition"
              >
             
                <KanbanBoard
                  boardId={board._id}
                  boardName={board.name}
                  tasks={boardTasks}
                  onDragStart={handleDragStart}
                  onDrop={(e, status) => handleDrop(e, status, board._id)}
                />

              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={createBoard}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            + Create New Board
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <ActivityLog  />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
