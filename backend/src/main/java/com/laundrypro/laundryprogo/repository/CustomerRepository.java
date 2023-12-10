package com.laundrypro.laundryprogo.repository;

import com.laundrypro.laundryprogo.models.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Integer> {
}
