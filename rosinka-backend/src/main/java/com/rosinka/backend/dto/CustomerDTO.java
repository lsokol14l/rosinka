package com.rosinka.backend.dto;

import com.rosinka.backend.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    
    private Long id;
    private String firstname;
    private String email;
    private String phone;
    
    public static CustomerDTO fromEntity(Customer customer) {
        return new CustomerDTO(
            customer.getId(),
            customer.getFirstname(),
            customer.getEmail(),
            customer.getPhone()
        );
    }
}
