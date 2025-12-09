// Сервис для работы с API авторизации
const AuthService = {
  /**
   * Проверка авторизации
   */
  async checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      return await response.json()
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      return { success: false, message: 'Ошибка соединения' }
    }
  },

  /**
   * Вход
   */
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      return await response.json()
    } catch (error) {
      console.error('Ошибка входа:', error)
      return { success: false, message: 'Ошибка соединения с сервером' }
    }
  },

  /**
   * Регистрация
   */
  async register(name, phone, email, password, confirm) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, confirm })
      })
      return await response.json()
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      return { success: false, message: 'Ошибка соединения с сервером' }
    }
  },

  /**
   * Выход
   */
  async logout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (response.ok) {
        localStorage.removeItem('customer')
        return { success: true }
      }
      return { success: false }
    } catch (error) {
      console.error('Ошибка выхода:', error)
      return { success: false }
    }
  },

  /**
   * Загрузка аватара
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData
      })
      return await response.json()
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
      return { success: false, message: 'Ошибка загрузки' }
    }
  },

  /**
   * Смена email
   */
  async changeEmail(newEmail, currentPassword) {
    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, currentPassword })
      })
      return await response.json()
    } catch (error) {
      console.error('Ошибка смены email:', error)
      return { success: false, message: 'Ошибка соединения' }
    }
  },

  /**
   * Смена пароля
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      })
      return await response.json()
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      return { success: false, message: 'Ошибка соединения' }
    }
  }
}
