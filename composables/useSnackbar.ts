import { ref } from 'vue'

const show = ref(false)
const text = ref('')
const color = ref('success') // Default color, can be 'success', 'info', 'warning', 'error'
const timeout = ref(3000) // Default timeout in milliseconds

export function useSnackbar() {
  const showSnackbar = (
    message: string,
    snackbarColor: string = 'success',
    snackbarTimeout: number = 3000
  ) => {
    text.value = message
    color.value = snackbarColor
    timeout.value = snackbarTimeout
    show.value = true
  }

  // Optional: a way to hide the snackbar programmatically if needed
  const hideSnackbar = () => {
    show.value = false
  }

  return {
    show,
    text,
    color,
    timeout,
    showSnackbar,
    hideSnackbar
  }
}
