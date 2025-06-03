<template>
  <div>
    <div
      :class="[
        'header w-full z-50 top-0 left-0 position-fixed transition-all duration-300',
        showHeader ? '' : 'opacity-0 pointer-events-none'
      ]"
      :style="{
        height: '64px',
        background: `rgba(255,255,255,${headerBgOpacity})`,
        boxShadow:
          headerBgOpacity > 0.1 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.5s'
      }"
    >
      <div class="flex justify-space-between">
        <div>65</div>
        <div>
          <v-btn>登录</v-btn>
          <v-btn>注册</v-btn>
        </div>
      </div>
    </div>
    <div class="banner">
      <video
        src="https://www.growthman.cn/uploads/upload/video/20240129/765c4d9a7f0c936df188b32b477ae812.mp4"
        autoplay
        muted
        loop
      ></video>
      <v-btn @click="login">Login</v-btn>
      <v-card height="700px" width="500px" class="bg-red-500"> 66 </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
const scrollY = ref(0)
const lastScrollY = ref(0)
const showHeader = ref(true)

const handleScroll = () => {
  scrollY.value = window.scrollY
  if (window.scrollY > lastScrollY.value && window.scrollY > 64) {
    showHeader.value = false
  } else {
    showHeader.value = true
  }
  lastScrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const headerBgOpacity = computed(() => {
  return Math.min(scrollY.value / 100, 1)
})

const { $snackbar } = useNuxtApp()
function login() {
  $snackbar.show('登录成功 (来自插件)!')
}
</script>
