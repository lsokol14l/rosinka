// Slider для страницы каталога
document.addEventListener('DOMContentLoaded', function () {
  initCatalogSlider()
})

function initCatalogSlider() {
  const slider = document.querySelector('.catalog-slider')
  if (!slider) return

  const track = slider.querySelector('.slider-track')
  const slides = Array.from(slider.querySelectorAll('.slider-card'))
  const prevBtn = slider.querySelector('.slider-btn-prev')
  const nextBtn = slider.querySelector('.slider-btn-next')
  const container = slider.querySelector('.slider-container')

  if (!slides.length) return

  let currentIndex = 0
  const cardWidth = 280 // фиксированная ширина карточки
  const gap = 20 // gap между карточками

  function getVisibleCards() {
    const containerWidth = container.offsetWidth
    return Math.floor(containerWidth / (cardWidth + gap))
  }

  function getMaxIndex() {
    const visibleCards = getVisibleCards()
    return Math.max(0, slides.length - visibleCards)
  }

  function updateSliderPosition(instant = false) {
    const maxIndex = getMaxIndex()
    // Ограничиваем currentIndex максимальным значением
    currentIndex = Math.min(currentIndex, maxIndex)

    const offset = -(currentIndex * (cardWidth + gap))
    if (instant) {
      track.style.transition = 'none'
    }
    track.style.transform = `translateX(${offset}px)`
    if (instant) {
      // Принудительный reflow
      track.offsetHeight
      track.style.transition = ''
    }
    updateButtons()
  }

  function updateButtons() {
    const maxIndex = getMaxIndex()

    // Если все карточки помещаются, отключаем кнопки
    if (maxIndex === 0) {
      prevBtn.disabled = true
      nextBtn.disabled = true
      prevBtn.style.opacity = '0.3'
      nextBtn.style.opacity = '0.3'
      return
    }

    // Иначе - круговая навигация, кнопки всегда активны
    prevBtn.disabled = false
    nextBtn.disabled = false
    prevBtn.style.opacity = '1'
    nextBtn.style.opacity = '1'
  }

  function goToSlide(index) {
    currentIndex = index
    updateSliderPosition()
  }

  function nextSlide() {
    const maxIndex = getMaxIndex()
    if (maxIndex === 0) return // Нет прокрутки

    currentIndex++
    if (currentIndex > maxIndex) {
      currentIndex = 0
    }
    goToSlide(currentIndex)
  }

  function prevSlide() {
    const maxIndex = getMaxIndex()
    if (maxIndex === 0) return // Нет прокрутки

    currentIndex--
    if (currentIndex < 0) {
      currentIndex = maxIndex
    }
    goToSlide(currentIndex)
  }

  // Event listeners
  prevBtn.addEventListener('click', prevSlide)
  nextBtn.addEventListener('click', nextSlide)

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
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide()
    if (e.key === 'ArrowRight') nextSlide()
  })

  // Initialize
  updateSliderPosition()

  // Window resize handler
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      updateSliderPosition()
    }, 150)
  })
}
