package com.laundrypro.laundryprogo.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd-MM-yyyy")
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
