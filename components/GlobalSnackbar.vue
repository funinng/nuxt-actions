<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    location="top right"
    multi-line
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="closeSnackbar"> 关闭 </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbar } from '~/composables/useSnackbar'

const { show, text, color, timeout, hideSnackbar } = useSnackbar()

const closeSnackbar = () => {
  hideSnackbar() // Use the hideSnackbar from the composable
}
</script>

<style scoped>
/* You can add any specific styles for the snackbar here if needed */
</style>
