import { defineEventHandler, sendNoContent } from 'h3'

export default defineEventHandler(async (event) => {
  // 返回 204 No Content 响应
  return sendNoContent(event)
})
