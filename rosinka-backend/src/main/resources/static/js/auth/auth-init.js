// Модуль для управления кнопкой профиля в хедере
const ProfileButton = {
  button: null,

  async init() {
    this.button = document.getElementById('authProfileLink')

    if (!this.button) return

    // Проверяем авторизацию при загрузке
    const authData = await AuthService.checkAuth()
    const isAuth = authData.success && authData.customer

    if (isAuth) {
      this.button.title = 'Личный кабинет'
    }

    // Обработчик клика
    this.button.addEventListener('click', async e => {
      e.preventDefault()

      const authData = await AuthService.checkAuth()
      const isAuth = authData.success && authData.customer

      if (isAuth) {
        window.location.href = '/profile'
      } else {
        AuthModal.open()
      }
    })
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  AuthModal.init()
  ProfileButton.init()
})
