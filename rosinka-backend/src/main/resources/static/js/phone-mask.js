// Маска для телефона в формате +7 (999) 999-99-99
function phoneMask(input) {
  let value = input.value.replace(/\D/g, '')

  // Если начинается с 8, заменяем на 7
  if (value.startsWith('8')) {
    value = '7' + value.substring(1)
  }

  // Если не начинается с 7, добавляем
  if (!value.startsWith('7') && value.length > 0) {
    value = '7' + value
  }

  let formatted = ''

  if (value.length > 0) {
    formatted = '+7'

    if (value.length > 1) {
      formatted += ' (' + value.substring(1, 4)
    }

    if (value.length >= 5) {
      formatted += ') ' + value.substring(4, 7)
    }

    if (value.length >= 8) {
      formatted += '-' + value.substring(7, 9)
    }

    if (value.length >= 10) {
      formatted += '-' + value.substring(9, 11)
    }
  }

  input.value = formatted
}

// Инициализация масок для всех полей телефона
document.addEventListener('DOMContentLoaded', function () {
  const phoneInputs = document.querySelectorAll('input[type="tel"]')

  phoneInputs.forEach(input => {
    // Применяем маску при вводе
    input.addEventListener('input', function (e) {
      phoneMask(e.target)
    })

    // Применяем маску при вставке
    input.addEventListener('paste', function (e) {
      setTimeout(() => phoneMask(e.target), 10)
    })

    // Фокус - если пусто, ставим +7
    input.addEventListener('focus', function (e) {
      if (!e.target.value) {
        e.target.value = '+7 ('
      }
    })

    // Потеря фокуса - если только +7, очищаем
    input.addEventListener('blur', function (e) {
      if (e.target.value === '+7 (' || e.target.value === '+7') {
        e.target.value = ''
      }
    })
  })
})

// Экспорт для использования в других модулях
window.phoneMask = phoneMask
