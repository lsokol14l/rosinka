package com.rosinka.backend.controller;

import com.rosinka.backend.dto.ReviewDTO;
import com.rosinka.backend.entity.Review;
import com.rosinka.backend.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Получить все отзывы для товара
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId);
        Double avgRating = reviewService.getAverageRating(productId);
        Long count = reviewService.getReviewCount(productId);

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviews);
        response.put("averageRating", avgRating);
        response.put("reviewCount", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Добавить отзыв
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addReview(
            @RequestParam Long productId,
            @RequestParam Integer rating,
            @RequestParam String reviewText,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        // Проверяем авторизацию
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            response.put("success", false);
            response.put("message", "Необходимо войти в систему");
            return ResponseEntity.ok(response);
        }

        try {
            Review review = reviewService.addReview(productId, customerId, rating, reviewText);
            response.put("success", true);
            response.put("message", "Отзыв успешно добавлен");
            response.put("review", review);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ошибка при добавлении отзыва");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Проверить, оставлял ли пользователь отзыв
     */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> checkReview(
            @PathVariable Long productId,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Long customerId = (Long) session.getAttribute("customerId");

        if (customerId == null) {
            response.put("hasReviewed", false);
            response.put("isAuthenticated", false);
        } else {
            boolean hasReviewed = reviewService.hasUserReviewed(productId, customerId);
            response.put("hasReviewed", hasReviewed);
            response.put("isAuthenticated", true);
        }

        return ResponseEntity.ok(response);
    }
}
