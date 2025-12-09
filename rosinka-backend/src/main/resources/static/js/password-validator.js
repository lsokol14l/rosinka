// Валидация пароля по требованиям ТЗ
const PasswordValidator = {
  /**
   * Проверка пароля на соответствие всем требованиям
   */
  validate(password) {
    const errors = []

    if (!password || password.length < 8) {
      errors.push('Пароль должен содержать не менее 8 символов')
    }

    if (password && password.length > 128) {
      errors.push('Пароль должен содержать не более 128 символов')
    }

    if (password && password.includes(' ')) {
      errors.push('Пароль не должен содержать пробелы')
    }

    if (password && !/[A-ZА-ЯЁ]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну заглавную букву')
    }

    if (password && !/[a-zа-яё]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну строчную букву')
    }

    if (password && !/[0-9]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну цифру')
    }

    if (password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы один специальный символ')
    }

    if (
      password &&
      !/^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/.test(password)
    ) {
      errors.push('Пароль содержит недопустимые символы')
    }

    return {
      valid: errors.length === 0,
      errors: errors
    }
  },

  /**
   * Показать индикаторы требований к паролю
   */
  showRequirements(password, containerElement) {
    if (!containerElement) return

    const requirements = [
      {
        id: 'length',
        text: 'От 8 до 128 символов',
        check: password.length >= 8 && password.length <= 128
      },
      {
        id: 'uppercase',
        text: 'Хотя бы одна заглавная буква',
        check: /[A-ZА-ЯЁ]/.test(password)
      },
      {
        id: 'lowercase',
        text: 'Хотя бы одна строчная буква',
        check: /[a-zа-яё]/.test(password)
      },
      {
        id: 'digit',
        text: 'Хотя бы одна цифра',
        check: /[0-9]/.test(password)
      },
      {
        id: 'special',
        text: 'Хотя бы один специальный символ',
        check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
      },
      { id: 'nospace', text: 'Без пробелов', check: !password.includes(' ') }
    ]

    containerElement.innerHTML = requirements
      .map(req => {
        const status = password ? (req.check ? '✓' : '✗') : '○'
        const statusClass = password
          ? req.check
            ? 'valid'
            : 'invalid'
          : 'neutral'
        return `<div class="password-requirement ${statusClass}">
          <span class="requirement-status">${status}</span>
          <span class="requirement-text">${req.text}</span>
        </div>`
      })
      .join('')
  }
}

// Экспорт для использования в других модулях
window.PasswordValidator = PasswordValidator
