package com.rosinka.backend.repository;

import com.rosinka.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(Long productId);
    
    Optional<Review> findByProductIdAndCustomerId(Long productId, Long customerId);
    
    boolean existsByProductIdAndCustomerId(Long productId, Long customerId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId")
    Long getReviewCountByProductId(@Param("productId") Long productId);
}
