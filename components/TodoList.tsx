'use client'

import type { Todo } from '@prisma/client'

interface TodoListProps {
  todos: Todo[]
  onToggle?: () => void
  onDelete?: () => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const handleToggle = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'PATCH',
      })
      if (response.ok) {
        onToggle?.()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        onDelete?.()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600">No todos yet</h3>
        <p className="text-gray-400 mt-2">Add your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`group flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 animate-slide-up ${
            todo.completed ? 'opacity-70' : ''
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <button
            onClick={() => handleToggle(todo.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {todo.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-gray-800 truncate ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {todo.description}
              </p>
            )}
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>

          <button
            onClick={() => handleDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
