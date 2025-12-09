document.addEventListener('DOMContentLoaded', function () {
  const profileContent = document.getElementById('profileContent')
  const notAuthContent = document.getElementById('notAuthContent')

  // Проверяем авторизацию
  checkAuth()

  // Обработчик выхода
  const logoutBtn = document.getElementById('logoutBtn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
  }

  // Обработчик кнопки входа
  const goLoginBtn = document.getElementById('goLoginBtn')
  if (goLoginBtn) {
    goLoginBtn.addEventListener('click', function (e) {
      e.preventDefault()
      window.location.href = '/'
      // После перехода нужно открыть модальное окно
      localStorage.setItem('openAuthModal', 'true')
    })
  }

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      console.log('Profile auth check response:', data)

      if (data.success && data.customer) {
        showProfile(data.customer)
      } else {
        console.log('Not authenticated, showing not auth content')
        showNotAuth()
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      showNotAuth()
    }
  }

  function showProfile(customer) {
    profileContent.style.display = 'block'
    notAuthContent.style.display = 'none'

    // Заполняем данные
    document.getElementById('profileName').textContent = customer.firstname
    document.getElementById('profileEmail').textContent = customer.email
    document.getElementById('profilePhone').textContent = customer.phone

    document.getElementById('infoName').textContent = customer.firstname
    document.getElementById('infoEmail').textContent = customer.email
    document.getElementById('infoPhone').textContent = customer.phone

    // Инициал для аватара
    const initial = customer.firstname
      ? customer.firstname.charAt(0).toUpperCase()
      : '?'
    document.getElementById('avatarInitial').textContent = initial
  }

  function showNotAuth() {
    profileContent.style.display = 'none'
    notAuthContent.style.display = 'block'
  }

  async function logout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        // Очищаем localStorage
        localStorage.removeItem('customer')
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }
})
