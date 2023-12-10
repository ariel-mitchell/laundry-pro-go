package com.laundrypro.laundryprogo.repository;

import com.laundrypro.laundryprogo.models.Order;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, Integer> {
}
