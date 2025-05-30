<template>
  <div class="login-page">
    <UserLogin @login-success="onLoginSuccess" />
  </div>
</template>

<script setup>
const router = useRouter()

function onLoginSuccess(user) {
  // 登录成功后可以存储用户信息，然后跳转到首页
  console.log('登录成功:', user)

  // 这里可以使用你喜欢的状态管理方式存储用户信息
  // 例如：localStorage, pinia, nuxt的useState等

  // 跳转到首页
  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>

<style scoped>
.login-page {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
