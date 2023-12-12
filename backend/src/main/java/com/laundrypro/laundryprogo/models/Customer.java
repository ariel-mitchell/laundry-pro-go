package com.laundrypro.laundryprogo.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private Boolean isRegular = false;
    private Boolean isBlacklisted = false;

    @OneToMany
    @JoinColumn(name = "customer_id")
    @JsonManagedReference
    private List<Order> orders = new ArrayList<>();

    public Customer(String name, Boolean isRegular) {
        this.name = name;
        this.isRegular = isRegular;
    }

    @Override
    public String toString() {
        return name;
    }
}
