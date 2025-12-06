(function () {
  "use strict";

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".search-button");
  const productCards = document.querySelectorAll(".product-card");
  const productCount = document.getElementById("productCount");

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    productCards.forEach((card) => {
      const productName = card.getAttribute("data-product-name");
      if (productName.includes(searchTerm)) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });
    productCount.textContent = visibleCount;
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", filterProducts);
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        filterProducts();
      }
    });
    searchInput.addEventListener("input", filterProducts);
  }
})();
