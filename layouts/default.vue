<template>
  <v-app theme="light">
    <v-main class="">
      <slot />
    </v-main>
    <GlobalSnackbar />
  </v-app>
</template>
<script setup lang="ts">
import GlobalSnackbar from '~/components/GlobalSnackbar.vue'
</script>
