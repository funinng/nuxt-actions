// api/auth/api.ts
export function useUserApi() {
  const config = useRuntimeConfig()

  return {
    login: (data: any) => {
      return http.post(`${config.public.apiBase}/auth/login`, data)
    },
    register: (data: any) => {
      return http.post(`${config.public.apiBase}/users/createUser`, data)
    }
  }
}
