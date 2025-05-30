<template>
  <v-app theme="light">
    <TheHeader />
    <v-main class="">
      <slot />
    </v-main>
    <GlobalSnackbar />
  </v-app>
</template>
<script setup lang="ts">
import TheHeader from '~/components/TheHedaer.vue'
import GlobalSnackbar from '~/components/GlobalSnackbar.vue'
</script>
