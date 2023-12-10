package com.laundrypro.laundryprogo.models;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDetails extends AbstractEntity{

    private Date datePlaced;
    private int bagsAtPickup;
    private int bagsAtDropoff;
    private int numberOfLoads;
    private double mileage;
    private double pounds;
    private double orderPayment;
    private double tip;
    private String notes;

    public OrderDetails(Date datePlaced) {
        this.datePlaced = datePlaced;
    }
}
