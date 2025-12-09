document.addEventListener('DOMContentLoaded', function () {
  const profileContent = document.getElementById('profileContent')
  const notAuthContent = document.getElementById('notAuthContent')

  // Проверяем авторизацию
  checkAuth()

  // Инициализация обработчиков
  initEventHandlers()

  function initEventHandlers() {
    // Выход
    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout)
    }

    // Кнопка входа для неавторизованных
    const goLoginBtn = document.getElementById('goLoginBtn')
    if (goLoginBtn) {
      goLoginBtn.addEventListener('click', e => {
        e.preventDefault()
        window.location.href = '/'
        localStorage.setItem('openAuthModal', 'true')
      })
    }

    // Загрузка аватара
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn')
    const avatarInput = document.getElementById('avatarInput')

    if (uploadAvatarBtn && avatarInput) {
      uploadAvatarBtn.addEventListener('click', () => avatarInput.click())
      avatarInput.addEventListener('change', handleAvatarUpload)
    }

    // Форма смены email
    const changeEmailForm = document.getElementById('changeEmailForm')
    if (changeEmailForm) {
      changeEmailForm.addEventListener('submit', handleChangeEmail)
    }

    // Форма смены пароля
    const changePasswordForm = document.getElementById('changePasswordForm')
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', handleChangePassword)
    }
  }

  async function checkAuth() {
    const data = await AuthService.checkAuth()

    if (data.success && data.customer) {
      showProfile(data.customer)
    } else {
      showNotAuth()
    }
  }

  async function handleLogout() {
    const result = await AuthService.logout()
    if (result.success) {
      window.location.href = '/'
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ')
      return
    }

    const result = await AuthService.uploadAvatar(file)

    if (result.success) {
      updateAvatar(result.customer.avatarUrl)
      showFormMessage('avatarMessage', 'Аватар успешно загружен', 'success')
    } else {
      showFormMessage('avatarMessage', result.message, 'error')
    }
  }

  async function handleChangeEmail(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const result = await AuthService.changeEmail(
      formData.get('newEmail'),
      formData.get('currentPassword')
    )

    if (result.success) {
      document.getElementById('profileEmail').textContent =
        result.customer.email
      showFormMessage('emailFormMessage', 'Email успешно изменён', 'success')
      e.target.reset()
    } else {
      showFormMessage('emailFormMessage', result.message, 'error')
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const newPassword = formData.get('newPassword')

    if (newPassword.length < 8) {
      showFormMessage(
        'passwordFormMessage',
        'Пароль должен быть не менее 8 символов',
        'error'
      )
      return
    }

    const result = await AuthService.changePassword(
      formData.get('oldPassword'),
      newPassword
    )

    if (result.success) {
      showFormMessage(
        'passwordFormMessage',
        'Пароль успешно изменён',
        'success'
      )
      e.target.reset()
    } else {
      showFormMessage('passwordFormMessage', result.message, 'error')
    }
  }

  function showProfile(customer) {
    profileContent.style.display = 'flex'
    notAuthContent.style.display = 'none'

    // Основные данные
    document.getElementById('profileName').textContent =
      customer.firstname || 'Пользователь'
    document.getElementById('profileEmail').textContent = customer.email || '-'

    // Аватар
    if (customer.avatarUrl) {
      updateAvatar(customer.avatarUrl)
    } else {
      const initial = customer.firstname
        ? customer.firstname.charAt(0).toUpperCase()
        : '?'
      document.getElementById('avatarInitial').textContent = initial
    }

    // Информационные карточки
    const infoId = document.getElementById('infoId')
    const infoPhone = document.getElementById('infoPhone')
    const infoDate = document.getElementById('infoDate')
    const infoLastLogin = document.getElementById('infoLastLogin')

    if (infoId) infoId.textContent = generateUserId(customer.email)
    if (infoPhone) infoPhone.textContent = customer.phone || '-'
    if (infoDate) infoDate.textContent = formatDate(new Date())
    if (infoLastLogin) infoLastLogin.textContent = formatDate(new Date())
  }

  function showNotAuth() {
    profileContent.style.display = 'none'
    notAuthContent.style.display = 'block'
  }

  function updateAvatar(avatarUrl) {
    const avatarImage = document.getElementById('avatarImage')
    const avatarInitial = document.getElementById('avatarInitial')

    if (avatarUrl && avatarImage) {
      avatarImage.src = avatarUrl
      avatarImage.style.display = 'block'
      if (avatarInitial) avatarInitial.style.display = 'none'
    }
  }

  function showFormMessage(elementId, message, type) {
    const el = document.getElementById(elementId)
    if (el) {
      el.textContent = message
      el.className = 'form-message ' + type
      el.style.display = 'block'

      setTimeout(() => {
        el.style.display = 'none'
      }, 5000)
    }
  }

  function generateUserId(email) {
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(12, '0')
  }

  function formatDate(date) {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`
  }
})
