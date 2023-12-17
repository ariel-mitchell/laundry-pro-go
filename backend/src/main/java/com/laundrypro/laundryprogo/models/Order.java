package com.laundrypro.laundryprogo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.UniqueElements;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="bookings")
public class Order extends AbstractEntity {

    @NotNull
    @NotBlank
    private String orderNumber;

    @ManyToOne
    @NotNull
    @JsonBackReference
    private Customer customer;

    @Valid
    @OneToOne(cascade = CascadeType.ALL)
    private OrderDetails orderDetails;
}
