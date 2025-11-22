const express = require("express");
const router = express.Router();
const products = require("../data/products");

const categoryNames = {
  "juice-drinks": "Сокосодержащие напитки",
  "cold-tea": "Холодный чай",
  "mineral-water": "Минеральная вода",
};

// Каталог всех товаров
router.get("/catalog", (req, res) => {
  const productsWithCategories = products.map((p) => ({
    ...p,
    categoryName: categoryNames[p.category],
  }));
  res.render("catalog", { layout: "layouts/main", isCatalog: true, products: productsWithCategories });
});

// Страница "Подробнее" для товара
router.get("/product/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).render("404", { layout: "layouts/main" });
  }
  const categoryName = categoryNames[product.category];
  res.render("product", { layout: "layouts/main", product, categoryName });
});

module.exports = router;
