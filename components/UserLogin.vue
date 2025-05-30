<template>
  <div class="user-login">
    <h2>用户登录</h2>

    <form class="login-form" @submit.prevent="loginUser">
      <div class="form-group">
        <label for="username">用户名/邮箱</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          placeholder="请输入用户名或邮箱"
        />
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="请输入密码"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
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
import { useUserApi } from '@/api/auth/api'
const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const message = ref('')
const isError = ref(false)

const emit = defineEmits(['login-success'])

async function loginUser() {
  const response = await useUserApi().login(form.value)
  console.log(response)
  if (response.success) {
    emit('login-success', response.data.user)
  }
}
</script>

<style scoped>
.user-login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
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
