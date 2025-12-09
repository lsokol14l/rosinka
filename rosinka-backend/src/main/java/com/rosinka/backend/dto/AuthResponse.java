package com.rosinka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private boolean success;
    private String message;
    private CustomerDTO customer;
    
    public static AuthResponse success(String message, CustomerDTO customer) {
        return new AuthResponse(true, message, customer);
    }
    
    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }
}
