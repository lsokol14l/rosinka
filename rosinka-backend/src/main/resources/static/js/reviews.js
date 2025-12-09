document.addEventListener('DOMContentLoaded', function () {
  const reviewForm = document.getElementById('reviewForm')
  const reviewsList = document.getElementById('reviewsList')
  const reviewFormContainer = document.getElementById('reviewFormContainer')
  const ratingInput = document.getElementById('ratingInput')
  const ratingValue = document.getElementById('ratingValue')
  const commentField = document.getElementById('comment')
  const charCount = document.getElementById('charCount')

  // Инициализация
  loadReviews()
  checkUserReview()
  initRatingInput()

  // Счётчик символов
  if (commentField && charCount) {
    commentField.addEventListener('input', function () {
      charCount.textContent = this.value.length
    })
  }

  // Обработка формы отзыва
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewSubmit)
  }

  // Инициализация выбора рейтинга
  function initRatingInput() {
    if (!ratingInput) return

    const stars = ratingInput.querySelectorAll('.star')
    stars.forEach((star, index) => {
      star.addEventListener('click', function () {
        const rating = this.getAttribute('data-rating')
        ratingValue.value = rating

        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('active')
          } else {
            s.classList.remove('active')
          }
        })
      })

      star.addEventListener('mouseenter', function () {
        const rating = this.getAttribute('data-rating')
        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('hover')
          } else {
            s.classList.remove('hover')
          }
        })
      })
    })

    ratingInput.addEventListener('mouseleave', function () {
      stars.forEach(s => s.classList.remove('hover'))
    })
  }

  // Загрузка отзывов
  async function loadReviews() {
    try {
      const response = await fetch(`/api/reviews/product/${PRODUCT_ID}`)
      const data = await response.json()

      updateSummary(data.averageRating, data.reviewCount)
      displayReviews(data.reviews)
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error)
      reviewsList.innerHTML =
        '<p class="error-message">Ошибка загрузки отзывов</p>'
    }
  }

  // Обновление статистики
  function updateSummary(avgRating, count) {
    const avgRatingEl = document.getElementById('avgRating')
    const starsDisplay = document.getElementById('starsDisplay')
    const reviewCount = document.getElementById('reviewCount')

    if (avgRatingEl) avgRatingEl.textContent = avgRating.toFixed(1)
    if (starsDisplay) starsDisplay.innerHTML = generateStars(avgRating)
    if (reviewCount) {
      reviewCount.textContent =
        count === 0
          ? 'Нет отзывов'
          : count === 1
          ? '1 отзыв'
          : count < 5
          ? `${count} отзыва`
          : `${count} отзывов`
    }
  }

  // Генерация звёзд для отображения
  function generateStars(rating) {
    let html = ''
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<span class="star filled">★</span>'
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        html += '<span class="star half">★</span>'
      } else {
        html += '<span class="star empty">★</span>'
      }
    }
    return html
  }

  // Отображение списка отзывов
  function displayReviews(reviews) {
    if (!reviewsList) return

    if (reviews.length === 0) {
      reviewsList.innerHTML =
        '<p class="no-reviews">Будьте первым, кто оставит отзыв!</p>'
      return
    }

    reviewsList.innerHTML = reviews
      .map(
        review => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-author">
            <div class="author-avatar">${review.customerName
              .charAt(0)
              .toUpperCase()}</div>
            <div class="author-info">
              <div class="author-name">${escapeHtml(review.customerName)}</div>
              <div class="review-date">${formatDate(review.createdAt)}</div>
            </div>
          </div>
          <div class="review-rating">${generateStars(review.rating)}</div>
        </div>
        <div class="review-comment">${escapeHtml(review.reviewText)}</div>
      </div>
    `
      )
      .join('')
  }

  // Проверка, оставлял ли пользователь отзыв
  async function checkUserReview() {
    try {
      const response = await fetch(`/api/reviews/check/${PRODUCT_ID}`)
      const data = await response.json()

      if (reviewFormContainer) {
        if (!data.isAuthenticated) {
          reviewFormContainer.innerHTML = `
            <div class="auth-required">
              <p>Чтобы оставить отзыв, необходимо <a href="#" id="openAuthLink">войти в систему</a></p>
            </div>
          `
          document
            .getElementById('openAuthLink')
            ?.addEventListener('click', e => {
              e.preventDefault()
              localStorage.setItem('openAuthModal', 'true')
              window.location.href = '/'
            })
        } else if (data.hasReviewed) {
          reviewFormContainer.innerHTML = `
            <div class="already-reviewed">
              <p>✓ Вы уже оставили отзыв на этот товар</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error('Ошибка проверки отзыва:', error)
    }
  }

  // Обработка отправки отзыва
  async function handleReviewSubmit(e) {
    e.preventDefault()

    const rating = ratingValue.value
    const comment = commentField.value

    if (!rating) {
      showFormMessage('Пожалуйста, выберите оценку', 'error')
      return
    }

    if (comment.length < 10) {
      showFormMessage('Отзыв должен содержать минимум 10 символов', 'error')
      return
    }

    const formData = new FormData()
    formData.append('productId', PRODUCT_ID)
    formData.append('rating', rating)
    formData.append('reviewText', comment)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        showFormMessage('Отзыв успешно добавлен!', 'success')
        reviewForm.reset()
        ratingValue.value = ''
        document
          .querySelectorAll('.star')
          .forEach(s => s.classList.remove('active'))
        setTimeout(() => {
          loadReviews()
          checkUserReview()
        }, 1000)
      } else {
        showFormMessage(data.message, 'error')
      }
    } catch (error) {
      console.error('Ошибка отправки отзыва:', error)
      showFormMessage('Ошибка при отправке отзыва', 'error')
    }
  }

  // Показать сообщение формы
  function showFormMessage(message, type) {
    const messageEl = document.getElementById('reviewFormMessage')
    if (messageEl) {
      messageEl.textContent = message
      messageEl.className = 'form-message ' + type
      messageEl.style.display = 'block'

      setTimeout(() => {
        messageEl.style.display = 'none'
      }, 5000)
    }
  }

  // Форматирование даты
  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  // Экранирование HTML
  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
})
