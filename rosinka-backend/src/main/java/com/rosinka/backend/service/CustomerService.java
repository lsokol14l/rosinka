package com.rosinka.backend.service;

import com.rosinka.backend.entity.Customer;
import com.rosinka.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    /**
     * Регистрация нового пользователя
     */
    public Customer register(String firstname, String email, String password, String phone) {
        // Проверяем, не занят ли email
        if (customerRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }
        
        // Проверяем, не занят ли телефон
        if (customerRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Пользователь с таким телефоном уже существует");
        }
        
        // Создаём нового пользователя
        Customer customer = new Customer();
        customer.setFirstname(firstname);
        customer.setEmail(email.toLowerCase());
        customer.setPasswordHash(hashPassword(password));
        customer.setPhone(phone);
        
        return customerRepository.save(customer);
    }
    
    /**
     * Аутентификация пользователя
     */
    public Optional<Customer> authenticate(String email, String password) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(email.toLowerCase());
        
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (verifyPassword(password, customer.getPasswordHash())) {
                return Optional.of(customer);
            }
        }
        
        return Optional.empty();
    }
    
    /**
     * Получить пользователя по ID
     */
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    /**
     * Получить пользователя по email
     */
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email.toLowerCase());
    }

    /**
     * Обновить аватар пользователя
     */
    public Customer updateAvatar(Long customerId, String avatarUrl) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        customer.setAvatarUrl(avatarUrl);
        return customerRepository.save(customer);
    }

    /**
     * Сменить email пользователя
     */
    public Customer changeEmail(Long customerId, String newEmail, String currentPassword) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        // Проверяем текущий пароль
        if (!verifyPassword(currentPassword, customer.getPasswordHash())) {
            throw new IllegalArgumentException("Неверный текущий пароль");
        }

        // Проверяем, не занят ли новый email
        String normalizedEmail = newEmail.toLowerCase();
        if (customerRepository.existsByEmail(normalizedEmail) && 
            !normalizedEmail.equals(customer.getEmail())) {
            throw new IllegalArgumentException("Этот email уже используется");
        }

        customer.setEmail(normalizedEmail);
        return customerRepository.save(customer);
    }

    /**
     * Сменить пароль пользователя
     */
    public Customer changePassword(Long customerId, String oldPassword, String newPassword) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        // Проверяем старый пароль
        if (!verifyPassword(oldPassword, customer.getPasswordHash())) {
            throw new IllegalArgumentException("Неверный старый пароль");
        }

        // Устанавливаем новый пароль
        customer.setPasswordHash(hashPassword(newPassword));
        return customerRepository.save(customer);
    }
    
    /**
     * Хеширование пароля с солью (SHA-256)
     * Формат: salt$hash
     */
    private String hashPassword(String password) {
        try {
            // Генерируем соль
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);
            String saltBase64 = Base64.getEncoder().encodeToString(salt);
            
            // Хешируем пароль с солью
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
            String hashBase64 = Base64.getEncoder().encodeToString(hashedPassword);
            
            return saltBase64 + "$" + hashBase64;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Ошибка хеширования пароля", e);
        }
    }
    
    /**
     * Проверка пароля
     */
    private boolean verifyPassword(String password, String storedHash) {
        try {
            String[] parts = storedHash.split("\\$");
            if (parts.length != 2) {
                return false;
            }
            
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            String expectedHash = parts[1];
            
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
            String actualHash = Base64.getEncoder().encodeToString(hashedPassword);
            
            return expectedHash.equals(actualHash);
        } catch (Exception e) {
            return false;
        }
    }
}
