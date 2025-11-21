document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("authModal");
  const openBtn = document.querySelector('.icon-link[title*="Войти"]');
  const closeBtn = document.getElementById("closeAuthModal");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");

  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginSection.style.display = "";
      registerSection.style.display = "none";
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
      document.body.style.overflow = "";
    });
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Переключение табов
  loginTab.addEventListener("click", function () {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginSection.style.display = "";
    registerSection.style.display = "none";
  });
  registerTab.addEventListener("click", function () {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    loginSection.style.display = "none";
    registerSection.style.display = "";
  });
});
