package com.rosinka.backend.service;

import com.rosinka.backend.dto.ReviewDTO;
import com.rosinka.backend.entity.Customer;
import com.rosinka.backend.entity.Review;
import com.rosinka.backend.repository.CustomerRepository;
import com.rosinka.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;

    public ReviewService(ReviewRepository reviewRepository, CustomerRepository customerRepository) {
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Получить все одобренные отзывы для товара
     */
    public List<ReviewDTO> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId);
        
        return reviews.stream().map(review -> {
            ReviewDTO dto = new ReviewDTO();
            dto.setId(review.getId());
            dto.setProductId(review.getProductId());
            dto.setCustomerId(review.getCustomerId());
            dto.setRating(review.getRating());
            dto.setReviewText(review.getReviewText());
            dto.setIsApproved(review.getIsApproved());
            dto.setCreatedAt(review.getCreatedAt());
            
            // Получаем имя пользователя
            customerRepository.findById(review.getCustomerId())
                .ifPresent(customer -> dto.setCustomerName(customer.getFirstname()));
            
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Добавить отзыв
     */
    @Transactional
    public Review addReview(Long productId, Long customerId, Integer rating, String reviewText) {
        // Проверяем, не оставлял ли пользователь уже отзыв на этот товар
        if (reviewRepository.existsByProductIdAndCustomerId(productId, customerId)) {
            throw new IllegalArgumentException("Вы уже оставили отзыв на этот товар");
        }

        Review review = new Review();
        review.setProductId(productId);
        review.setCustomerId(customerId);
        review.setRating(rating);
        review.setReviewText(reviewText);
        review.setIsApproved(true); // По умолчанию одобрен

        return reviewRepository.save(review);
    }

    /**
     * Получить средний рейтинг товара
     */
    public Double getAverageRating(Long productId) {
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    /**
     * Получить количество отзывов
     */
    public Long getReviewCount(Long productId) {
        return reviewRepository.getReviewCountByProductId(productId);
    }

    /**
     * Проверить, оставлял ли пользователь отзыв
     */
    public boolean hasUserReviewed(Long productId, Long customerId) {
        return reviewRepository.existsByProductIdAndCustomerId(productId, customerId);
    }
}
