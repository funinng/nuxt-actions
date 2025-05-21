<template>
  <div class="user-list-container">
    <!-- 用户列表部分 -->
    <div class="user-list">
      <h2>用户列表</h2>
      <button @click="fetchUsers" :disabled="loading">刷新列表</button>

      <div v-if="loading && !selectedUser" class="loading">加载中...</div>

      <table v-if="users.length && !loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="getUserDetails(2)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!users.length && !loading">暂无用户数据</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- 用户详情部分 -->
    <div v-if="selectedUser" class="user-details">
      <h2>用户详情</h2>
      <button class="back-button" @click="selectedUser = null">返回列表</button>

      <div v-if="detailsLoading" class="loading">加载详情中...</div>

      <div v-else class="details-card">
        <p><strong>ID:</strong> {{ selectedUser.id }}</p>
        <p><strong>姓名:</strong> {{ selectedUser.name }}</p>
        <p><strong>邮箱:</strong> {{ selectedUser.email }}</p>
        <p>
          <strong>创建时间:</strong> {{ formatDate(selectedUser.createdAt) }}
        </p>
        <p>
          <strong>更新时间:</strong> {{ formatDate(selectedUser.updatedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const users = ref([])
const loading = ref(false)
const error = ref('')
const selectedUser = ref(null)
const detailsLoading = ref(false)

// 获取所有用户
async function fetchUsers() {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('http://localhost:9000/getUsers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('获取用户列表失败')
    }

    const result = await response.json()

    // 检查接口返回的状态
    if (!result.success) {
      throw new Error(result.message || '获取用户列表失败')
    }

    // 从data字段获取用户列表
    users.value = result.data || []
  } catch (err) {
    error.value = err.message || '获取用户数据失败'
    console.error(error.value)
  } finally {
    loading.value = false
  }
}

// 获取特定用户详情
async function getUserDetails(userId) {
  try {
    detailsLoading.value = true
    error.value = ''

    const response = await fetch(`http://localhost:9000/getUser/${userId}`)

    if (!response.ok) {
      throw new Error('获取用户详情失败')
    }

    const result = await response.json()

    // 检查接口返回的状态
    if (!result.success) {
      throw new Error(result.message || '获取用户详情失败')
    }

    // 从data字段获取用户详情
    selectedUser.value =
      Array.isArray(result.data) && result.data.length > 0
        ? result.data[0] // 如果data是数组，取第一个元素
        : result.data // 如果data是对象，直接使用
  } catch (err) {
    error.value = err.message || '获取用户详情失败'
    console.error(error.value)
  } finally {
    detailsLoading.value = false
  }
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '无'
  return new Date(dateString).toLocaleString()
}

// 组件挂载时加载用户列表
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px 0;
}

button:disabled {
  background-color: #95a5a6;
}

.loading {
  margin: 20px 0;
  font-style: italic;
}

.error {
  color: #e74c3c;
}

.user-details {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.details-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}

.back-button {
  background-color: #7f8c8d;
}
</style>
