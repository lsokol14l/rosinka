// Модуль для работы с модальным окном авторизации
const AuthModal = {
  modal: null,
  loginTab: null,
  registerTab: null,
  loginSection: null,
  registerSection: null,
  loginForm: null,
  registerForm: null,

  init() {
    this.modal = document.getElementById('authModal')
    this.loginTab = document.getElementById('loginTab')
    this.registerTab = document.getElementById('registerTab')
    this.loginSection = document.getElementById('loginSection')
    this.registerSection = document.getElementById('registerSection')
    this.loginForm = document.getElementById('loginForm')
    this.registerForm = document.getElementById('registerForm')
    const closeBtn = document.getElementById('closeAuthModal')

    if (!this.modal) return

    // Обработчики
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close())
    }

    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.close()
      }
    })

    // Переключение табов
    if (this.loginTab) {
      this.loginTab.addEventListener('click', () => this.showLoginTab())
    }

    if (this.registerTab) {
      this.registerTab.addEventListener('click', () => this.showRegisterTab())
    }

    // Обработка форм
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', e => this.handleLogin(e))
    }

    if (this.registerForm) {
      this.registerForm.addEventListener('submit', e => this.handleRegister(e))
    }

    // Проверяем, нужно ли открыть модальное окно
    if (localStorage.getItem('openAuthModal') === 'true') {
      localStorage.removeItem('openAuthModal')
      this.open()
    }
  },

  open() {
    if (this.modal) {
      this.modal.style.display = 'flex'
      document.body.style.overflow = 'hidden'
      this.showLoginTab()
    }
  },

  close() {
    if (this.modal) {
      this.modal.style.display = 'none'
      document.body.style.overflow = ''
      this.clearErrors()
    }
  },

  showLoginTab() {
    if (this.loginTab) this.loginTab.classList.add('active')
    if (this.registerTab) this.registerTab.classList.remove('active')
    if (this.loginSection) this.loginSection.style.display = ''
    if (this.registerSection) this.registerSection.style.display = 'none'
    this.clearErrors()
  },

  showRegisterTab() {
    if (this.registerTab) this.registerTab.classList.add('active')
    if (this.loginTab) this.loginTab.classList.remove('active')
    if (this.loginSection) this.loginSection.style.display = 'none'
    if (this.registerSection) this.registerSection.style.display = ''
    this.clearErrors()
  },

  async handleLogin(e) {
    e.preventDefault()
    this.clearErrors()

    const formData = new FormData(this.loginForm)
    const email = formData.get('email')
    const password = formData.get('password')

    const result = await AuthService.login(email, password)

    if (result.success) {
      localStorage.setItem('customer', JSON.stringify(result.customer))
      this.close()
      window.location.href = '/profile'
    } else {
      this.showError(this.loginSection, result.message)
    }
  },

  async handleRegister(e) {
    e.preventDefault()
    this.clearErrors()

    const formData = new FormData(this.registerForm)
    const password = formData.get('password')
    const confirm = formData.get('confirm')

    if (password !== confirm) {
      this.showError(this.registerSection, 'Пароли не совпадают')
      return
    }

    const result = await AuthService.register(
      formData.get('name'),
      formData.get('phone'),
      formData.get('email'),
      password,
      confirm
    )

    if (result.success) {
      localStorage.setItem('customer', JSON.stringify(result.customer))
      this.close()
      window.location.href = '/profile'
    } else {
      this.showError(this.registerSection, result.message)
    }
  },

  showError(section, message) {
    let errorDiv = section.querySelector('.auth-error')
    if (!errorDiv) {
      errorDiv = document.createElement('div')
      errorDiv.className = 'auth-error'
      errorDiv.style.cssText =
        'color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem;'
      section.insertBefore(errorDiv, section.querySelector('form'))
    }
    errorDiv.textContent = message
  },

  clearErrors() {
    document.querySelectorAll('.auth-error').forEach(el => el.remove())
  }
}
