<template>
  <div class="min-h-screen flex flex-col">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/">Nuxt Actions</NuxtLink>
        </div>
        <nav class="nav">
          <ul>
            <li><NuxtLink to="/">首页</NuxtLink></li>
            <li><NuxtLink to="/login">登录</NuxtLink></li>
            <li><NuxtLink to="/register">注册</NuxtLink></li>
          </ul>
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav a {
  color: #333;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav a:hover {
  background-color: #f0f0f0;
}

.nav a.router-link-active {
  color: #3498db;
  font-weight: bold;
}
</style>
