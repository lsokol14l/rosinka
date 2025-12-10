// Slider для страницы товара (переключение между товарами категории)
document.addEventListener('DOMContentLoaded', function () {
  initProductSlider()
})

function initProductSlider() {
  const slider = document.querySelector('.product-slider')
  if (!slider) return

  const track = slider.querySelector('.product-slider-track')
  const slides = Array.from(slider.querySelectorAll('.product-slider-slide'))
  const prevBtn = slider.querySelector('.product-slider-btn-prev')
  const nextBtn = slider.querySelector('.product-slider-btn-next')
  const dotsContainer = slider.querySelector('.product-slider-dots')

  if (!slides.length) return

  let currentIndex = 0

  // Создание точек навигации
  function createDots() {
    if (!dotsContainer) return
    dotsContainer.innerHTML = ''

    if (slides.length <= 1) {
      dotsContainer.style.display = 'none'
      return
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button')
      dot.className = 'slider-dot'
      dot.setAttribute('aria-label', `Перейти к товару ${index + 1}`)
      if (index === 0) dot.classList.add('active')
      dot.addEventListener('click', () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  }

  function updateDots() {
    if (!dotsContainer) return
    const dots = dotsContainer.querySelectorAll('.slider-dot')
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex)
    })
  }

  function updateSliderPosition() {
    const offset = -(currentIndex * 100)
    track.style.transform = `translateX(${offset}%)`
    updateButtons()
    updateDots()
  }

  function updateButtons() {
    if (slides.length <= 1) {
      prevBtn.style.display = 'none'
      nextBtn.style.display = 'none'
      return
    }

    prevBtn.disabled = currentIndex === 0
    nextBtn.disabled = currentIndex === slides.length - 1
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1'
    nextBtn.style.opacity = currentIndex === slides.length - 1 ? '0.3' : '1'
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1))
    updateSliderPosition()

    // Обновление информации о товаре если доступны данные
    if (window.CATEGORY_PRODUCTS && window.CATEGORY_PRODUCTS[currentIndex]) {
      updateProductInfo(window.CATEGORY_PRODUCTS[currentIndex])
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1)
  }

  function prevSlide() {
    goToSlide(currentIndex - 1)
  }

  function updateProductInfo(product) {
    // Обновление названия
    const nameElement = document.querySelector('.product-name')
    if (nameElement) nameElement.textContent = product.name

    // Обновление объёма
    const volumeElement = document.querySelector('.product-volume span')
    if (volumeElement) volumeElement.textContent = `${product.volume} л`

    // Обновление цены
    const priceElement = document.querySelector('.product-price-large span')
    if (priceElement) priceElement.textContent = `${product.price} ₽`

    // Обновление описания
    const descElement = document.querySelector('.product-description-full p')
    if (descElement) descElement.textContent = product.description

    // Обновление URL без перезагрузки
    const newUrl = `/product/${product.id}`
    window.history.replaceState({ productId: product.id }, '', newUrl)

    // Обновление ID для отзывов
    const productIdInput = document.getElementById('productId')
    if (productIdInput) productIdInput.value = product.id

    if (typeof window.PRODUCT_ID !== 'undefined') {
      window.PRODUCT_ID = product.id
    }

    // Перезагрузка отзывов
    if (typeof loadReviews === 'function') {
      loadReviews(product.id)
    }
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide)
  if (nextBtn) nextBtn.addEventListener('click', nextSlide)

  // Touch support
  let touchStartX = 0
  let touchEndX = 0

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX
  })

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide()
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide()
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide()
    if (e.key === 'ArrowRight') nextSlide()
  })

  // Initialize
  createDots()
  updateSliderPosition()
}
