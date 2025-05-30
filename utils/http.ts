interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
}

interface ResponseData<T = any> {
  success: boolean
  code: number
  message: string
  data: T
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'HttpError'
  }
}
export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ResponseData<T>> {
  const { method = 'GET', headers, body, params } = options

  // 处理 URL 参数
  let fullUrl = `${url}`
  if (params) {
    const queryString = new URLSearchParams(params).toString()
    fullUrl += `?${queryString}`
  }

  const isFormData = body instanceof FormData
  const defaultHeaders = isFormData
    ? {}
    : { 'Content-Type': 'application/json' }
  const mergedHeaders = { ...defaultHeaders, ...headers }
  const response = await fetch(fullUrl, {
    method,
    headers: mergedHeaders as HeadersInit,
    body: isFormData ? body : JSON.stringify(body)
  })

  // 获取响应的内容类型
  const contentType = response.headers.get('content-type')

  try {
    // 首先尝试解析为JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      // 处理业务状态码
      if (data && data.code !== 200 && data.code !== 201) {
        throw new Error(data.message || '请求失败')
      }

      return data
    } else {
      // 不是JSON格式，返回文本
      const textResponse = await response.text()

      // 尝试解析为JSON (有时服务器会返回JSON但没有正确设置Content-Type)
      try {
        const jsonData = JSON.parse(textResponse)
        return jsonData
      } catch {
        // 如果无法解析为JSON，返回文本格式
        return {
          success: true,
          code: 200,
          message: '请求成功',
          data: textResponse as unknown as T
        }
      }
    }
  } catch (parseError) {
    const { $snackbar } = useNuxtApp()
    $snackbar.show(parseError, 'error')
    throw parseError
  }

  //如果开启会阻塞页面进程 在接口调用处可以自定义错误捕获
  //throw error
}

// 封装常用的请求方法
export const http = {
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return request<ResponseData<T>>(url, { method: 'GET', params, headers })
  },

  post<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return request<ResponseData<T>>(url, {
      method: 'POST',
      body: data,
      headers
    })
  },

  put<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return request<ResponseData<T>>(url, { method: 'PUT', body: data, headers })
  },

  delete<T = any>(url: string, headers?: Record<string, string>) {
    return request<ResponseData<T>>(url, { method: 'DELETE', headers })
  }
}
