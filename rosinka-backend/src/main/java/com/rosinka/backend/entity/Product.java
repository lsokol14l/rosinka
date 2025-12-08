package com.rosinka.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Long id;

  @Column(name = "category_id", nullable = false)
  private Long categoryId;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "image_url", nullable = false)
  private String imageUrl;

  @Column(name = "alt_text", nullable = false)
  private String altText;

  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(name = "short_description", nullable = false, length = 500)
  private String shortDescription;

  @Column(name = "price", nullable = false)
  private BigDecimal price;

  @Column(name = "volume", nullable = false)
  private BigDecimal volume;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;
}
