import React from 'react'

export default function TaskCard({ task, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
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
