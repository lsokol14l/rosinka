document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('authModal')
  const openBtn = document.getElementById('authProfileLink')
  const closeBtn = document.getElementById('closeAuthModal')
  const loginTab = document.getElementById('loginTab')
  const registerTab = document.getElementById('registerTab')
  const loginSection = document.getElementById('loginSection')
  const registerSection = document.getElementById('registerSection')
  const loginForm = document.getElementById('loginForm')
  const registerForm = document.getElementById('registerForm')

  console.log('Auth modal script loaded')
  console.log('Modal element:', modal)
  console.log('Open button:', openBtn)

  // Проверяем, нужно ли открыть модальное окно (переход со страницы профиля)
  if (localStorage.getItem('openAuthModal') === 'true') {
    localStorage.removeItem('openAuthModal')
    openModal()
  }

  // Проверяем авторизацию при загрузке
  checkAuthAndUpdateUI()

  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('Profile icon clicked')
      // Проверяем, авторизован ли пользователь
      checkAuth()
        .then(isAuth => {
          console.log('Is authenticated:', isAuth)
          if (isAuth) {
            window.location.href = '/profile'
          } else {
            console.log('Opening modal...')
            openModal()
          }
        })
        .catch(err => {
          console.error('Auth check error:', err)
          openModal()
        })
    })
  } else {
    console.error('Open button not found!')
  }

  function openModal() {
    console.log('openModal called, modal:', modal)
    if (!modal) {
      console.error('Modal element not found!')
      return
    }
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    loginTab.classList.add('active')
    registerTab.classList.remove('active')
    loginSection.style.display = ''
    registerSection.style.display = 'none'
  }

  function closeModal() {
    modal.style.display = 'none'
    document.body.style.overflow = ''
    clearErrors()
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal)
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Переключение табов
  loginTab.addEventListener('click', function () {
    loginTab.classList.add('active')
    registerTab.classList.remove('active')
    loginSection.style.display = ''
    registerSection.style.display = 'none'
    clearErrors()
  })

  registerTab.addEventListener('click', function () {
    registerTab.classList.add('active')
    loginTab.classList.remove('active')
    loginSection.style.display = 'none'
    registerSection.style.display = ''
    clearErrors()
  })

  // Обработка формы входа
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault()
      clearErrors()

      const formData = new FormData(loginForm)
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (result.success) {
          localStorage.setItem('customer', JSON.stringify(result.customer))
          closeModal()
          window.location.href = '/profile'
        } else {
          showError(loginSection, result.message)
        }
      } catch (error) {
        showError(loginSection, 'Ошибка соединения с сервером')
      }
    })
  }

  // Обработка формы регистрации
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault()
      clearErrors()

      const formData = new FormData(registerForm)
      const password = formData.get('password')
      const confirm = formData.get('confirm')

      // Проверка совпадения паролей
      if (password !== confirm) {
        showError(registerSection, 'Пароли не совпадают')
        return
      }

      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: password,
        confirm: confirm
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (result.success) {
          localStorage.setItem('customer', JSON.stringify(result.customer))
          closeModal()
          window.location.href = '/profile'
        } else {
          showError(registerSection, result.message)
        }
      } catch (error) {
        showError(registerSection, 'Ошибка соединения с сервером')
      }
    })
  }

  function showError(section, message) {
    let errorDiv = section.querySelector('.auth-error')
    if (!errorDiv) {
      errorDiv = document.createElement('div')
      errorDiv.className = 'auth-error'
      errorDiv.style.cssText =
        'color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem;'
      section.insertBefore(errorDiv, section.querySelector('form'))
    }
    errorDiv.textContent = message
  }

  function clearErrors() {
    document.querySelectorAll('.auth-error').forEach(el => el.remove())
  }

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      return data.success && data.customer
    } catch {
      return false
    }
  }

  async function checkAuthAndUpdateUI() {
    const isAuth = await checkAuth()
    if (isAuth && openBtn) {
      openBtn.title = 'Личный кабинет'
    }
  }
})
