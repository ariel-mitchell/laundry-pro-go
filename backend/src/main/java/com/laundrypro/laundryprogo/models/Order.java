package com.laundrypro.laundryprogo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="bookings")
public class Order extends AbstractEntity {

    private String orderNumber;

    @ManyToOne
    @JsonBackReference
    private Customer customer;

    @Valid
    @OneToOne(cascade = CascadeType.ALL)
    private OrderDetails orderDetails;
}
