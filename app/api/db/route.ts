import { prisma } from '@/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      todos: true
    }
  })

  return NextResponse.json({
    database: 'Neon PostgreSQL',
    host: 'ep-solitary-dream-aobwne8s.c-2.ap-southeast-1.aws.neon.tech',
    userCount: users.length,
    users
  })
}