import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TaskCard from './TaskCard'
import { useAuth } from '../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../utils/socket'

export default function KanbanBoard({ boardId, boardName, onDragStart, onDrop }) {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editedName, setEditedName] = useState(boardName)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })

  const { token } = useAuth()
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks', authHeaders)
      const filtered = res.data.filter((t) =>
        typeof t.board === 'string'
          ? t.board === boardId
          : t.board?._id === boardId
      )
      setTasks(filtered)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      toast.error('Failed to load tasks')
    }
  }

  useEffect(() => {
    fetchTasks()
    socket.emit('joinBoard', boardId)

    const handleTaskCreated = (task) => {
      const taskBoardId = typeof task.board === 'string' ? task.board : task.board?._id
      if (taskBoardId === boardId) {
        setTasks((prev) => [...prev, task])
      }
    }

    const handleTaskUpdated = (task) => {
      const taskBoardId = typeof task.board === 'string' ? task.board : task.board?._id
      if (taskBoardId === boardId) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)))
      }
    }

    const handleTaskDeleted = (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
    }

    socket.on('taskCreated', handleTaskCreated)
    socket.on('taskUpdated', handleTaskUpdated)
    socket.on('taskDeleted', handleTaskDeleted)

    return () => {
      socket.emit('leaveBoard', boardId)
      socket.off('taskCreated', handleTaskCreated)
      socket.off('taskUpdated', handleTaskUpdated)
      socket.off('taskDeleted', handleTaskDeleted)
    }
  }, [boardId])

  const handleModalOpen = () => setShowModal(true)
  const handleModalClose = () => {
    setShowModal(false)
    setNewTask({ title: '', description: '', priority: 'medium' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const validStatuses = ['Todo', 'In Progress', 'Done']
    const fallbackStatus = validStatuses.includes(boardName) ? boardName : 'Todo'

    const taskToAdd = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority.charAt(0).toUpperCase() + newTask.priority.slice(1),
      status: fallbackStatus,
      board: boardId,
    }

    try {
      await axios.post('/tasks', taskToAdd, authHeaders)
      handleModalClose()
      toast.success('Task added successfully!')
    } catch (err) {
      console.error('Failed to create task:', err?.response?.data || err.message)
      toast.error('Failed to add task. Please try again.')
    }
  }

  const handleEditBoard = async () => {
    try {
      await axios.put(`/boards/${boardId}`, { name: editedName }, authHeaders)
      toast.success('Board updated!')
      setShowEditModal(false)
    } catch (err) {
      toast.error('Failed to update board')
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await axios.delete(`/boards/${boardId}`, authHeaders)
      toast.success('Board deleted!')
      setShowDeleteModal(false)
    } catch (err) {
      toast.error('Failed to delete board')
    }
  }

  return (
    <div className="space-y-4 relative">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, boardName, boardId)}
        className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow min-h-[200px] relative"
      >
        {/* Board header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{boardName}</h3>

          {/* Dots menu */}
          <div className="relative">
            <button onClick={() => setShowOptions(!showOptions)} className="text-gray-600 dark:text-white text-lg px-2">
              ⋮
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow z-10">
                <button
                  onClick={() => { setShowEditModal(true); setShowOptions(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit Board
                </button>
                <button
                  onClick={() => { setShowDeleteModal(true); setShowOptions(false); }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete Board
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task cards */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDragStart={onDragStart} />
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">No tasks available</p>
        )}

        {/* Add Task Button at Bottom */}
        <button
          onClick={handleModalOpen}
          className="mt-4 w-full text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Task
        </button>
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Task to "{boardName}"</h2>

            <input
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              placeholder="Task Title"
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Task Description"
              className="w-full mb-3 p-2 border rounded"
            />

            <select
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              <button onClick={handleSubmitTask} className="px-4 py-2 bg-blue-600 text-white rounded">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Board Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Board Name</h2>
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              <button onClick={handleEditBoard} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Are you sure you want to delete this board?</h2>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              <button onClick={handleDeleteBoard} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
