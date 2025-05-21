/**
 * RSA加密密码的前端实现示例 - 不使用时间戳
 */

/**
 * 使用RSA加密登录 - 不使用时间戳
 * @param username 用户名或邮箱
 * @param password 原始密码
 */
export async function login(username: string, password: string) {
  try {
    // 发送登录请求
    const response = await fetch('http://localhost:9000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
        // 不再需要时间戳
      })
    })

    return await response.json()
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}
export async function register(
  email: string,
  name: string,
  username: string,
  password: string
) {
  try {
    const response = await fetch('http://localhost:9000/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        username,
        password
      })
    })

    return await response.json()
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}
