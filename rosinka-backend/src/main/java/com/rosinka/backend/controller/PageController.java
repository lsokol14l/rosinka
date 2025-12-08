package com.rosinka.backend.controller;

import com.rosinka.backend.entity.Product;
import com.rosinka.backend.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Controller
public class PageController {

  private final ProductService productService;

  public PageController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/")
  public String index(Model model) {
    return "index";
  }

  @GetMapping("/about")
  public String about(Model model) {
    return "about";
  }

  @GetMapping("/catalog")
  public String catalog(Model model) {
    List<Product> products = productService.getAllActiveProducts();
    model.addAttribute("products", products);
    model.addAttribute("isCatalog", true);
    return "catalog";
  }

  @GetMapping("/catalog/{categoryId}")
  public String catalogByCategory(@PathVariable Long categoryId, Model model) {
    List<Product> products = productService.getProductsByCategoryId(categoryId);
    model.addAttribute("products", products);
    model.addAttribute("isCatalog", true);
    model.addAttribute("selectedCategoryId", categoryId);
    return "catalog";
  }

  @GetMapping("/product/{id}")
  public String product(@PathVariable Long id, Model model) {
    Optional<Product> product = productService.getProductById(id);

    if (product.isPresent()) {
      model.addAttribute("product", product.get());
      return "product";
    }

    return "redirect:/catalog";
  }

  @GetMapping("/contacts")
  public String contacts(Model model) {
    return "contacts";
  }

  @GetMapping("/privacy")
  public String privacy(Model model) {
    return "privacy";
  }
}
