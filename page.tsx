'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const columns = ['todo', 'in_progress', 'done']

export default function BoardPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel('realtime-tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        fetchTasks
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at')

    setTasks(data || [])
  }

  const createTask = async () => {
    if (!title.trim()) return

    await fetch('/api/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })

    setTitle('')
  }

  return (
    <div style={{ padding: 20 }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={createTask}>Add</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {columns.map(col => (
          <div key={col} style={{ border: '1px solid #ccc', padding: 10 }}>
            <h3>{col.toUpperCase()}</h3>

            {tasks
              .filter(t => t.status === col)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function TaskCard({ task }: any) {
  const moveTask = async (status: string) => {
    await fetch('/api/tasks/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        newStatus: status,
      }),
    })
  }

  return (
    <div style={{ border: '1px solid gray', marginBottom: 8, padding: 6 }}>
      <p>{task.title}</p>

      <select value={task.status} onChange={e => moveTask(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  )
}
