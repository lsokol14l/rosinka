package com.rosinka.backend.controller;

import com.rosinka.backend.dto.*;
import com.rosinka.backend.entity.Customer;
import com.rosinka.backend.service.CustomerService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;
    
    @Value("${app.upload.dir:uploads/avatars}")
    private String uploadDir;

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

    /**
     * Загрузка аватара
     */
    @PostMapping("/avatar")
    public ResponseEntity<AuthResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            HttpSession session) {
        
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Не авторизован"));
        }

        // Проверяем тип файла
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Файл должен быть изображением"));
        }

        // Проверяем размер (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Размер файла не должен превышать 5 МБ"));
        }

        try {
            // Создаём директорию если не существует
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Генерируем уникальное имя файла
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".jpg";
            String filename = customerId + "_" + UUID.randomUUID().toString() + extension;

            // Сохраняем файл
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            // Обновляем URL в базе данных
            String avatarUrl = "/uploads/avatars/" + filename;
            Customer customer = customerService.updateAvatar(customerId, avatarUrl);

            CustomerDTO customerDTO = CustomerDTO.fromEntity(customer);
            return ResponseEntity.ok(AuthResponse.success("Аватар успешно загружен", customerDTO));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Ошибка при сохранении файла"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    /**
     * Смена email
     */
    @PostMapping("/change-email")
    public ResponseEntity<AuthResponse> changeEmail(
            @RequestBody ChangeEmailRequest request,
            HttpSession session) {
        
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Не авторизован"));
        }

        try {
            Customer customer = customerService.changeEmail(
                    customerId, 
                    request.getNewEmail(), 
                    request.getCurrentPassword()
            );

            // Обновляем email в сессии
            session.setAttribute("customerEmail", customer.getEmail());

            CustomerDTO customerDTO = CustomerDTO.fromEntity(customer);
            return ResponseEntity.ok(AuthResponse.success("Email успешно изменён", customerDTO));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    /**
     * Смена пароля
     */
    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpSession session) {
        
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Не авторизован"));
        }

        try {
            Customer customer = customerService.changePassword(
                    customerId, 
                    request.getOldPassword(), 
                    request.getNewPassword()
            );

            CustomerDTO customerDTO = CustomerDTO.fromEntity(customer);
            return ResponseEntity.ok(AuthResponse.success("Пароль успешно изменён", customerDTO));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }
}
