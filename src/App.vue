<template>
  <div class="container">
    <h1 class="title">留言墙</h1>

    <div class="message-form">
      <input v-model="newMessage.name" placeholder="你的名字" class="input-name" />
      <textarea v-model="newMessage.content" placeholder="写下你的留言..." class="input-content"></textarea>
      <button @click="addMessage" class="btn-submit">发布留言</button>
    </div>

    <div class="admin-bar">
      <button v-if="!isAdmin" @click="showLogin = true" class="btn-admin">管理员登录</button>
      <div v-else class="admin-panel">
        <span>管理员模式</span>
        <button @click="logout" class="btn-logout">退出</button>
      </div>
    </div>

    <div v-if="showLogin" class="modal">
      <div class="modal-content">
        <h3>管理员登录</h3>
        <input v-model="password" type="password" placeholder="输入密码" class="input-password" />
        <div class="modal-buttons">
          <button @click="login" class="btn-login">登录</button>
          <button @click="showLogin = false" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>

    <div class="messages-grid">
      <div
        v-for="(msg, index) in messages"
        :key="msg.id"
        class="message-card"
      >
        <div class="message-header">
          <span class="message-name">{{ msg.name }}</span>
          <span class="message-time">{{ formatTime(msg.time) }}</span>
        </div>
        <p class="message-content">{{ msg.content }}</p>
        <button
          v-if="isAdmin"
          @click="deleteMessage(msg.id)"
          class="btn-delete"
        >删除</button>
      </div>
    </div>

    <div v-if="messages.length === 0" class="empty-state">
      <p>还没有留言，来做第一个留言的人吧~</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const messages = ref([])
const newMessage = ref({ name: '', content: '' })
const isAdmin = ref(false)
const showLogin = ref(false)
const password = ref('')
const ADMIN_PASSWORD = 'admin123'
const API_BASE = import.meta.env.VITE_API_URL || '/api'

onMounted(async () => {
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
  console.log('API Base:', API_BASE)
  await loadMessages()
})

async function loadMessages() {
  try {
    console.log('开始加载留言...')
    const response = await fetch(`${API_BASE}/messages`)

    if (!response.ok) {
      const error = await response.json()
      console.error('加载留言失败:', error)
      alert('加载失败：' + error.error)
      return
    }

    const data = await response.json()
    console.log('留言加载成功:', data?.length || 0, '条')
    messages.value = data || []
  } catch (err) {
    console.error('加载留言异常:', err)
    alert('加载异常：' + err.message)
  }
}

async function addMessage() {
  if (!newMessage.value.name.trim() || !newMessage.value.content.trim()) {
    alert('请填写名字和留言内容')
    return
  }

  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMessage.value.name.trim(),
        content: newMessage.value.content.trim(),
        time: Date.now()
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('添加留言失败:', error)
      alert('添加留言失败')
      return
    }

    const data = await response.json()
    if (data) {
      messages.value.unshift(data)
    }

    newMessage.value = { name: '', content: '' }
  } catch (err) {
    console.error('添加留言异常:', err)
    alert('添加留言异常')
  }
}

async function deleteMessage(id) {
  if (confirm('确定要删除这条留言吗？')) {
    try {
      const response = await fetch(`${API_BASE}/messages/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('删除留言失败:', error)
        alert('删除留言失败')
        return
      }

      messages.value = messages.value.filter(msg => msg.id !== id)
    } catch (err) {
      console.error('删除留言异常:', err)
      alert('删除留言异常')
    }
  }
}

function login() {
  if (password.value === ADMIN_PASSWORD) {
    isAdmin.value = true
    localStorage.setItem('isAdmin', 'true')
    showLogin.value = false
    password.value = ''
  } else {
    alert('密码错误')
  }
}

function logout() {
  isAdmin.value = false
  localStorage.removeItem('isAdmin')
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.title {
  text-align: center;
  color: white;
  font-size: 48px;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.message-form {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.input-name {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
  transition: border-color 0.3s;
}

.input-name:focus {
  outline: none;
  border-color: #667eea;
}

.input-content {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 15px;
  transition: border-color 0.3s;
}

.input-content:focus {
  outline: none;
  border-color: #667eea;
}

.btn-submit {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.admin-bar {
  margin-bottom: 30px;
  text-align: center;
}

.btn-admin {
  padding: 10px 25px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-admin:hover {
  background: rgba(255,255,255,0.3);
}

.admin-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: white;
  font-size: 16px;
}

.btn-logout {
  padding: 8px 20px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid white;
  border-radius: 6px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.input-password {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.btn-login {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.message-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  position: relative;
}

.message-card:hover {
  transform: translateY(-5px);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-name {
  font-weight: bold;
  color: #667eea;
  font-size: 18px;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-content {
  color: #333;
  line-height: 1.6;
  word-break: break-word;
}

.btn-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.message-card:hover .btn-delete {
  opacity: 1;
}

.empty-state {
  text-align: center;
  color: white;
  font-size: 18px;
  margin-top: 60px;
  opacity: 0.9;
}

@media (max-width: 600px) {
  .title {
    font-size: 32px;
  }

  .messages-grid {
    grid-template-columns: 1fr;
  }

  .message-form {
    padding: 20px;
  }
}
</style>