'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TodoList from '@/components/TodoList'
import TodoForm from '@/components/TodoForm'
import Header from '@/components/Header'
import type { Todo } from '@prisma/client'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchTodos()
    }
  }, [session, status, router])

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTodoAdded = () => {
    fetchTodos()
  }

  const handleTodoToggled = () => {
    fetchTodos()
  }

  const handleTodoDeleted = () => {
    fetchTodos()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header userName={session?.user?.name} userEmail={session?.user?.email} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">My Todos</h1>
            <p className="text-blue-100 mt-2">Organize your tasks and stay productive</p>
          </div>

          <div className="p-6">
            <TodoForm onAdd={handleTodoAdded} />
            <TodoList todos={todos} onToggle={handleTodoToggled} onDelete={handleTodoDeleted} />
          </div>
        </div>
      </main>
    </div>
  )
}
