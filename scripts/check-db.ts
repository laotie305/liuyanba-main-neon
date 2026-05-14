import { prisma } from '../prisma/client'

async function main() {
  console.log('=== 数据库连接信息 ===')
  console.log('数据库类型: PostgreSQL (Neon)')
  console.log('主机地址: ep-solitary-dream-aobwne8s.c-2.ap-southeast-1.aws.neon.tech')
  console.log('数据库名: neondb')
  console.log('')
  
  console.log('=== 用户记录 ===')
  const users = await prisma.user.findMany({
    include: {
      todos: true
    }
  })
  
  console.log(`用户总数: ${users.length}`)
  console.log('')
  
  users.forEach((user, index) => {
    console.log(`用户 ${index + 1}:`)
    console.log(`  ID: ${user.id}`)
    console.log(`  邮箱: ${user.email}`)
    console.log(`  姓名: ${user.name || '未设置'}`)
    console.log(`  待办数量: ${user.todos.length}`)
    console.log(`  创建时间: ${user.createdAt}`)
    
    if (user.todos.length > 0) {
      console.log('  待办事项:')
      user.todos.forEach((todo, todoIndex) => {
        const status = todo.completed ? '✓ 已完成' : '○ 未完成'
        console.log(`    ${todoIndex + 1}. [${status}] ${todo.title}`)
      })
    }
    console.log('')
  })
  
  console.log('=== 统计信息 ===')
  const totalTodos = users.reduce((sum, user) => sum + user.todos.length, 0)
  const completedTodos = users.reduce((sum, user) => 
    sum + user.todos.filter(t => t.completed).length, 0
  )
  
  console.log(`总待办数: ${totalTodos}`)
  console.log(`已完成: ${completedTodos}`)
  console.log(`未完成: ${totalTodos - completedTodos}`)
  
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('数据库连接失败:', e)
  await prisma.$disconnect()
  process.exit(1)
})