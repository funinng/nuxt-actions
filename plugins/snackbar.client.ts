import { defineNuxtPlugin } from '#app'
import { useSnackbar } from '~/composables/useSnackbar'

export default defineNuxtPlugin((nuxtApp) => {
  const { showSnackbar, hideSnackbar } = useSnackbar()

  // 将 snackbar 的方法注入到 Nuxt 应用实例中
  nuxtApp.provide('snackbar', {
    show: showSnackbar,
    hide: hideSnackbar
  })
})
