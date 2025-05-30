<template>
  <div class="register-page">
    <UserRegister @login-success="handleLoginSuccess" />
    <div class="login-link">
      <p>已有账号？<NuxtLink to="/login">立即登录</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
import UserRegister from '~/components/UserRegister.vue'

function handleLoginSuccess(user) {
  console.log(user)
}
// 您可以在此添加注册成功后的逻辑
</script>

<style scoped>
.register-page {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
