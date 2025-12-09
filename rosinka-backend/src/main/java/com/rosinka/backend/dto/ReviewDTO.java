package com.rosinka.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long productId;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String reviewText;
    private Boolean isApproved;
    private LocalDateTime createdAt;
}
