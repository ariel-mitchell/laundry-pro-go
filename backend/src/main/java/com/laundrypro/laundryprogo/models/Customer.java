package com.laundrypro.laundryprogo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Customer extends AbstractEntity {

    private String name;
    private Boolean isRegular;
    private Boolean isBlacklisted;

    @OneToMany
    @JoinColumn(name = "customer_id")
    List<Order> orders = new ArrayList<>();


    public Customer(String name) {
        this.name = name;
        this.isRegular = false;
        this. isBlacklisted = false;
    }

    @Override
    public String toString() {
        return name;
    }
}
