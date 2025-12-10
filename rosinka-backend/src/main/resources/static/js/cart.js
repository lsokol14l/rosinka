// Управление корзиной через localStorage
const Cart = {
  STORAGE_KEY: 'rosinka_cart',

  // Получить корзину
  getCart() {
    const cart = localStorage.getItem(this.STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  },

  // Сохранить корзину
  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
    this.updateBadge()
    this.updateModal()
  },

  // Добавить товар
  addItem(product) {
    const cart = this.getCart()
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        volume: product.volume,
        quantity: 1
      })
    }

    this.saveCart(cart)
    this.showNotification(`${product.name} добавлен в корзину`)
  },

  // Удалить товар
  removeItem(productId) {
    let cart = this.getCart()
    cart = cart.filter(item => item.id !== productId)
    this.saveCart(cart)
  },

  // Обновить количество
  updateQuantity(productId, quantity) {
    const cart = this.getCart()
    const item = cart.find(item => item.id === productId)

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
        this.saveCart(cart)
      }
    }
  },

  // Очистить корзину
  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY)
    this.updateBadge()
  },

  // Получить количество товаров
  getItemCount() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
  },

  // Получить общую сумму
  getTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  // Обновить бадж корзины
  updateBadge() {
    const badge = document.getElementById('cartBadge')
    if (!badge) return

    const count = this.getItemCount()
    if (count > 0) {
      badge.textContent = count
      badge.style.display = 'flex'
    } else {
      badge.style.display = 'none'
    }
  },

  // Показать уведомление
  showNotification(message) {
    // Удаляем старое уведомление если есть
    const oldNotification = document.querySelector('.cart-notification')
    if (oldNotification) {
      oldNotification.remove()
    }

    const notification = document.createElement('div')
    notification.className = 'cart-notification'
    notification.innerHTML = `
      <span class="notification-icon">✓</span>
      <span class="notification-text">${message}</span>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add('show')
    }, 10)

    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  },

  // Открыть модальное окно корзины
  openModal() {
    const modal = document.getElementById('cartModal')
    if (modal) {
      this.updateModal()
      modal.style.display = 'flex'
      document.body.style.overflow = 'hidden'
    }
  },

  // Закрыть модальное окно корзины
  closeModal() {
    const modal = document.getElementById('cartModal')
    if (modal) {
      modal.style.display = 'none'
      document.body.style.overflow = ''
    }
  },

  // Обновить содержимое модального окна
  updateModal() {
    const cart = this.getCart()
    const cartEmpty = document.getElementById('cartEmpty')
    const cartItems = document.getElementById('cartItems')
    const cartModalFooter = document.getElementById('cartModalFooter')
    const cartItemsCount = document.getElementById('cartItemsCount')
    const cartTotalPrice = document.getElementById('cartTotalPrice')
    const cartTotalItems = document.getElementById('cartTotalItems')

    if (!cartItems) return

    if (cart.length === 0) {
      cartEmpty.style.display = 'block'
      cartItems.style.display = 'none'
      cartModalFooter.style.display = 'none'
      cartItemsCount.textContent = '(0 товаров)'
    } else {
      cartEmpty.style.display = 'none'
      cartItems.style.display = 'block'
      cartModalFooter.style.display = 'block'

      // Рендерим товары
      cartItems.innerHTML = cart
        .map(
          item => `
        <div class="cart-item" data-product-id="${item.id}">
          <img src="${item.imageUrl}" alt="${
            item.name
          }" class="cart-item-image" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-volume">${item.volume} л</p>
            <p class="cart-item-price">${item.price} ₽</p>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn quantity-minus" data-product-id="${
                item.id
              }">−</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn quantity-plus" data-product-id="${
                item.id
              }">+</button>
            </div>
            <div class="cart-item-total">${(item.price * item.quantity).toFixed(
              2
            )} ₽</div>
            <button class="cart-item-remove" data-product-id="${
              item.id
            }" title="Удалить">
              <img src="/assets/trash.png" alt="Удалить" class="trash-icon" />
            </button>
          </div>
        </div>
      `
        )
        .join('')

      // Обновляем итоги
      const itemCount = this.getItemCount()
      const total = this.getTotal()
      const itemWord = this.getItemWord(itemCount)

      cartItemsCount.textContent = `(${itemCount} ${itemWord})`
      cartTotalPrice.textContent = `${total.toFixed(2)} ₽`
      cartTotalItems.textContent = `${itemCount} ${itemWord}`
    }
  },

  // Склонение слова "товар"
  getItemWord(count) {
    const lastDigit = count % 10
    const lastTwoDigits = count % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'товаров'
    }
    if (lastDigit === 1) {
      return 'товар'
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'товара'
    }
    return 'товаров'
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge()

  // Открытие корзины по клику на иконку
  const cartLink = document.querySelector('.cart-icon-link')
  if (cartLink) {
    cartLink.addEventListener('click', e => {
      e.preventDefault()
      Cart.openModal()
    })
  }

  // Закрытие корзины
  const closeCartBtn = document.getElementById('closeCartModal')
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => Cart.closeModal())
  }

  // Закрытие по клику вне модального окна
  const cartModal = document.getElementById('cartModal')
  if (cartModal) {
    cartModal.addEventListener('click', e => {
      if (e.target === cartModal) {
        Cart.closeModal()
      }
    })
  }

  // Обработчик для кнопок "Добавить в корзину"
  document.addEventListener('click', e => {
    const addToCartBtn = e.target.closest('.add-to-cart-btn')
    if (addToCartBtn) {
      e.preventDefault()

      const productData = {
        id: parseInt(addToCartBtn.dataset.productId),
        name: addToCartBtn.dataset.productName,
        price: parseFloat(addToCartBtn.dataset.productPrice),
        imageUrl: addToCartBtn.dataset.productImage,
        volume: parseFloat(addToCartBtn.dataset.productVolume)
      }

      Cart.addItem(productData)
    }

    // Увеличение количества
    const plusBtn = e.target.closest('.quantity-plus')
    if (plusBtn) {
      const productId = parseInt(plusBtn.dataset.productId)
      const cart = Cart.getCart()
      const item = cart.find(i => i.id === productId)
      if (item) {
        Cart.updateQuantity(productId, item.quantity + 1)
      }
    }

    // Уменьшение количества
    const minusBtn = e.target.closest('.quantity-minus')
    if (minusBtn) {
      const productId = parseInt(minusBtn.dataset.productId)
      const cart = Cart.getCart()
      const item = cart.find(i => i.id === productId)
      if (item) {
        Cart.updateQuantity(productId, item.quantity - 1)
      }
    }

    // Удаление товара
    const removeBtn = e.target.closest('.cart-item-remove')
    if (removeBtn) {
      const productId = parseInt(removeBtn.dataset.productId)
      if (confirm('Удалить товар из корзины?')) {
        Cart.removeItem(productId)
      }
    }
  })
})
