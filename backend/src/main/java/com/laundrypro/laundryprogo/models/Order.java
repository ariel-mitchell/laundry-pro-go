package com.laundrypro.laundryprogo.models;

import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.EAGER)
    private Customer customer;

    @OneToOne(cascade = CascadeType.ALL)
    private OrderDetails orderDetails;
}
