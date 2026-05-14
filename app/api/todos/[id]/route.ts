import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todo = await prisma.todo.findUnique({
    where: { id: params.id },
  })

  if (!todo || todo.userId !== session.user.id) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  await prisma.todo.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
