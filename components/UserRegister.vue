<template>
  <div class="user-register">
    <h2>注册新用户</h2>

    <form class="register-form" @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="请输入邮箱"
        >
      </div>

      <div class="form-group">
        <label for="name">姓名</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="请输入姓名"
        >
      </div>
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          placeholder="请输入用户名"
        >
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="请输入密码"
        >
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <p
        v-if="message"
        :class="{ 'error-message': isError, 'success-message': !isError }"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '@/api/auth/api'

const form = ref({
  email: '',
  name: '',
  username: '',
  password: ''
})

const loading = ref(false)
const message = ref('')
const isError = ref(false)

async function registerUser() {
  try {
    loading.value = true
    message.value = ''
    isError.value = false

    const response = await register(
      form.value.email,
      form.value.username,
      form.value.password,
      form.value.name
    )

    if (response.success) {
      message.value = '注册成功，请登录'
      isError.value = false
      form.value = {
        email: '',
        name: '',
        username: '',
        password: ''
      }
    } else {
      throw new Error(response.message || '注册失败')
    }
  } catch (error) {
    isError.value = true
    message.value = error.message || '注册失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
}

.success-message {
  color: #2ecc71;
}
</style>
