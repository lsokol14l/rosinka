/**
 * Модуль для работы со страницей контактов
 * Функционал копирования в буфер обмена
 */

(function() {
  'use strict';

  /**
   * Инициализация функционала копирования
   */
  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('copyNotification');

    if (!copyButtons.length || !notification) {
      return;
    }

    copyButtons.forEach(button => {
      button.addEventListener('click', async function() {
        const textToCopy = this.getAttribute('data-copy');
        
        if (!textToCopy) {
          console.warn('Нет данных для копирования');
          return;
        }

        try {
          await copyToClipboard(textToCopy);
          showSuccessFeedback(this, notification);
        } catch (error) {
          console.error('Ошибка копирования:', error);
          showErrorFeedback();
        }
      });
    });
  }

  /**
   * Копирование текста в буфер обмена
   * @param {string} text - Текст для копирования
   * @returns {Promise<void>}
   */
  async function copyToClipboard(text) {
    // Современный Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback для старых браузеров
    return fallbackCopyToClipboard(text);
  }

  /**
   * Альтернативный способ копирования для старых браузеров
   * @param {string} text - Текст для копирования
   * @returns {Promise<void>}
   */
  function fallbackCopyToClipboard(text) {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Скрываем textarea
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          resolve();
        } else {
          reject(new Error('execCommand failed'));
        }
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }

  /**
   * Показ успешной обратной связи
   * @param {HTMLElement} button - Кнопка, на которую кликнули
   * @param {HTMLElement} notification - Элемент уведомления
   */
  function showSuccessFeedback(button, notification) {
    // Визуальная обратная связь для кнопки
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 1000);

    // Показываем уведомление
    showNotification(notification);
  }

  /**
   * Показ уведомления об ошибке
   */
  function showErrorFeedback() {
    alert('Не удалось скопировать. Попробуйте выделить текст вручную.');
  }

  /**
   * Показ уведомления с анимацией
   * @param {HTMLElement} notification - Элемент уведомления
   */
  function showNotification(notification) {
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }

})();