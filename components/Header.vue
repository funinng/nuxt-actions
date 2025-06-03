<template>
  <header
    :class="[
      'header w-full z-50 top-0 left-0 position-fixed transition-all duration-300',
      showHeader ? '' : 'header-hide'
    ]"
    :style="{
      height: '64px',
      background: `rgba(255,255,255,${headerBgOpacity})`,
      boxShadow: headerBgOpacity > 0.1 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.5s, transform 0.3s'
    }"
  >
    <div class="flex justify-space-between">
      <div>65</div>
      <div>
        <v-btn>登录</v-btn>
        <v-btn>注册</v-btn>
      </div>
    </div>
  </header>
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
</script>

<style scoped>
.header-hide {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}
.header {
  transform: translateY(0);
  opacity: 1;
}
</style>
