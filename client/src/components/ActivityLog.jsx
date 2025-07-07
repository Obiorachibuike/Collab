import React from 'react'

export default function ActivityLog({ logs }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6 max-w-md mx-auto">
      <h4 className="text-lg font-semibold dark:text-white mb-3">Activity Log</h4>
      <ul className="space-y-2 text-sm dark:text-gray-300 max-h-64 overflow-y-auto">
        {logs.map((l, i) => (
          <li key={i} className="border-b border-gray-200 dark:border-gray-600 pb-1">
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}
