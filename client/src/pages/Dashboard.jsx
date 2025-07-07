import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import KanbanBoard from '../components/KanbanBoard'
import ActivityLog from '../components/ActivityLog'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])

  const fetchTasks = async () => {
    const res = await axios.get('/tasks')
    setTasks(res.data)
  }
  const fetchLogs = async () => {
    const res = await axios.get('/logs')
    setLogs(res.data)
  }

  useEffect(() => {
    if (!loading && !user) return navigate('/login')
    if (user) {
      fetchTasks()
      fetchLogs()
    }
  }, [user, loading])

  useSocket('board-1', {
    taskCreated: fetchTasks,
    taskUpdated: fetchTasks,
    taskDeleted: fetchTasks,
  })

  const onDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task))
  }

  const onDrop = async (e, status) => {
    const task = JSON.parse(e.dataTransfer.getData('task'))
    await axios.put(`/tasks/${task._id}`, { ...task, status })
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-1 rounded">
          Logout
        </button>
      </div>
      <KanbanBoard tasks={tasks} onDragStart={onDragStart} onDrop={onDrop} />
      <ActivityLog logs={logs} />
    </div>
  )
}
