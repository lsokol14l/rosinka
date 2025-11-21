const express = require("express");
const router = express.Router();
const products = require("../data/products");

// Каталог всех товаров
router.get("/catalog", (req, res) => {
  res.render("catalog", { layout: "layouts/main", isCatalog: true, products });
});

// Страница "Подробнее" для товара
router.get("/product/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).render("404", { layout: "layouts/main" });
  }
  res.render("product-detail", { layout: "layouts/main", product });
});

module.exports = router;
