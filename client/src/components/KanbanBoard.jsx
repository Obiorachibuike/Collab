import React from 'react'
import TaskCard from './TaskCard'

export default function KanbanBoard({ tasks, onDragStart, onDrop }) {
  const columns = ['Todo', 'In Progress', 'Done']
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((status) => (
        <div
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, status)}
          className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow"
        >
          <h3 className="text-lg font-bold mb-2 dark:text-white">{status}</h3>
          {tasks.filter((t) => t.status === status).map((t) =>
            <TaskCard key={t._id} task={t} onDragStart={onDragStart} />
          )}
        </div>
      ))}
    </div>
  )
}
