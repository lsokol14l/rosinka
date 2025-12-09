package com.rosinka.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Имя обязательно для заполнения")
    @Size(min = 2, max = 100, message = "Имя должно быть от 2 до 100 символов")
    private String name;
    
    @NotBlank(message = "Email обязателен для заполнения")
    @Email(message = "Некорректный формат email")
    private String email;
    
    @NotBlank(message = "Пароль обязателен для заполнения")
    @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
    private String password;
    
    @NotBlank(message = "Подтверждение пароля обязательно")
    private String confirm;
    
    @NotBlank(message = "Телефон обязателен для заполнения")
    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{10,20}$", message = "Некорректный формат телефона")
    private String phone;
}
