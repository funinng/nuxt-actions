<template>
  <div>
    <h1>Hello</h1>
    <p>{{ data }}</p>
  </div>
</template>
<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>
