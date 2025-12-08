package com.rosinka.backend.service;

import com.rosinka.backend.entity.Product;
import com.rosinka.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<Product> getAllActiveProducts() {
    return productRepository.findByIsActiveTrue();
  }

  public List<Product> getProductsByCategoryId(Long categoryId) {
    return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
  }

  public Optional<Product> getProductById(Long id) {
    return productRepository.findById(id);
  }

  public List<Product> getProductsByNameCategoryId(String name, Long categoryId) {
    return productRepository.findByNameContainingIgnoreCaseAndCategoryIdAndIsActiveTrue(name, categoryId);
  }

  public List<Product> getProductsByName(String name) {
    return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
  }
}
