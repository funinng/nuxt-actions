<template>
  <div>
    <video
      src="https://www.growthman.cn/uploads/upload/video/20240129/765c4d9a7f0c936df188b32b477ae812.mp4"
      autoplay
      muted
      loop
    ></video>
    <v-btn @click="login">Login</v-btn>
    <v-card height="700"> 66 </v-card>
  </div>
</template>
<script setup lang="ts">
const { $snackbar } = useNuxtApp()

function login() {
  $snackbar.show('登录成功 (来自插件)!')
  // 或者指定颜色和超时
  // $snackbar.show('警告信息!', 'warning', 5000);
}
</script>
