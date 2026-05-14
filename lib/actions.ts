'use server'

import { prisma } from '@/prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { revalidatePath } from 'next/cache'

export async function register(
  email: string,
  password: string,
  name?: string
) {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })
}

export async function createTodo(title: string, description?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      userId: session.user.id,
    },
  })

  revalidatePath('/')
  return todo
}

export async function getTodos() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return todos
}

export async function toggleTodo(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  })

  if (!todo || todo.userId !== session.user.id) {
    throw new Error('Todo not found')
  }

  await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  })

  revalidatePath('/')
}

export async function deleteTodo(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  })

  if (!todo || todo.userId !== session.user.id) {
    throw new Error('Todo not found')
  }

  await prisma.todo.delete({
    where: { id },
  })

  revalidatePath('/')
}