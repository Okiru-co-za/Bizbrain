import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  status: string
}

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  WAITING: 'Waiting',
  NEEDS_INFORMATION: 'Needs information',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-200 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  WAITING: 'bg-amber-100 text-amber-700',
  NEEDS_INFORMATION: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600'
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((d) => setTasks(d.tasks || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-gray-600">
                {task.description}
                {task.dueDate && ` • due ${new Date(task.dueDate).toLocaleDateString('en-ZA')}`}
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[task.status] || 'bg-gray-100 text-gray-600'}`}>
              {STATUS_LABELS[task.status] || task.status}
            </span>
          </div>
        ))}
        {!loading && tasks.length === 0 && <div className="text-sm text-gray-600">No tasks yet.</div>}
      </div>
    </Layout>
  )
}
