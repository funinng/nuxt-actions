import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartList: [] as any[]
  }),
  actions: {
    clearCart() {
      this.cartList = []
    },
    setCart(list: any[]) {
      this.cartList = list
    },
    addToCart(item: any) {
      this.cartList.push(item)
    }
  },
  persist: true // 开启持久化，默认用 cookies，SSR 友好
})
