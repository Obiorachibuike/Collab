import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { useAuth } from '../context/AuthContext'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { token } = useAuth()
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/logs', authHeaders)
        setLogs(res.data)
      } catch (err) {
        console.error('Failed to fetch logs:', err)
        setError('Could not load logs')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading || error || !Array.isArray(logs)) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6 max-w-2xl mx-auto">
        <h4 className="text-lg font-semibold dark:text-white mb-3">Activity Log</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? 'Loading logs...' : error || 'No activity logs available.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mt-6 max-w-2xl mx-auto">
      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Activity Log</h4>
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {logs.map((log, i) => (
          <li
            key={i}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                {log.action} task
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {moment(log.timestamp).fromNow()}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              <p className="mb-1">
                <span className="font-medium">Title:</span>{' '}
                <span className="italic">{log.details?.title || 'N/A'}</span>
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                {log.details?.status || 'N/A'} &nbsp;|&nbsp;
                <span className="font-medium">Priority:</span>{' '}
                {log.details?.priority || 'N/A'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
