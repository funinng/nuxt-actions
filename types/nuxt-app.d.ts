import type { useSnackbar } from '~/composables/useSnackbar'

declare module '#app' {
  interface NuxtApp {
    $snackbar: ReturnType<typeof useSnackbar>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $snackbar: ReturnType<typeof useSnackbar>
  }
}

export {} // Important to make this a module
