import React from 'react'

export default function TaskCard({ task, onDragStart }) {
  const handleDragStart = (e) => {
    // Set task data into drag event for drop target to retrieve
    e.dataTransfer.setData('application/json', JSON.stringify(task))

    // Optionally: customize drag image or effect
    e.dataTransfer.effectAllowed = 'move'

    if (onDragStart) onDragStart(e, task)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-4 mb-2 shadow hover:shadow-lg transition"
    >
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Priority: {task.priority}
      </div>
    </div>
  )
}
