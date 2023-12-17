package com.laundrypro.laundryprogo.models.dto;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.OrderDetails;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor @NoArgsConstructor
public class OrderDto {

    @NotNull
    @NotBlank
    private String orderNumber;

    @NotNull
    @NotBlank
    private Customer customer;

    @NotNull
    private OrderDetails orderDetails;

}
