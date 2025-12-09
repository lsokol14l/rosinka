package com.rosinka.backend.controller;

import com.rosinka.backend.dto.*;
import com.rosinka.backend.entity.Customer;
import com.rosinka.backend.service.CustomerService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Регистрация нового пользователя
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            BindingResult bindingResult,
            HttpSession session) {
        
        // Проверяем ошибки валидации
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(AuthResponse.error(errors));
        }
        
        // Проверяем совпадение паролей
        if (!request.getPassword().equals(request.getConfirm())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Пароли не совпадают"));
        }
        
        try {
            Customer customer = customerService.register(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhone()
            );
            
            // Сохраняем пользователя в сессию
            session.setAttribute("customerId", customer.getId());
            session.setAttribute("customerEmail", customer.getEmail());
            
            CustomerDTO customerDTO = CustomerDTO.fromEntity(customer);
            return ResponseEntity.ok(AuthResponse.success("Регистрация успешна", customerDTO));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    /**
     * Вход в аккаунт
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult,
            HttpSession session) {
        
        // Проверяем ошибки валидации
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(AuthResponse.error(errors));
        }
        
        Optional<Customer> customerOpt = customerService.authenticate(
                request.getEmail(),
                request.getPassword()
        );
        
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            
            // Сохраняем пользователя в сессию
            session.setAttribute("customerId", customer.getId());
            session.setAttribute("customerEmail", customer.getEmail());
            
            CustomerDTO customerDTO = CustomerDTO.fromEntity(customer);
            return ResponseEntity.ok(AuthResponse.success("Вход выполнен успешно", customerDTO));
        } else {
            return ResponseEntity.badRequest().body(AuthResponse.error("Неверный email или пароль"));
        }
    }

    /**
     * Выход из аккаунта
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(AuthResponse.success("Вы вышли из аккаунта", null));
    }

    /**
     * Проверка текущей сессии
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        
        if (customerId != null) {
            Optional<Customer> customerOpt = customerService.getCustomerById(customerId);
            if (customerOpt.isPresent()) {
                CustomerDTO customerDTO = CustomerDTO.fromEntity(customerOpt.get());
                return ResponseEntity.ok(AuthResponse.success("Авторизован", customerDTO));
            }
        }
        
        return ResponseEntity.ok(AuthResponse.error("Не авторизован"));
    }
}
