package com.laundrypro.laundryprogo.repository;

import com.laundrypro.laundryprogo.models.OrderDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailsRepository extends CrudRepository<OrderDetails, Integer> {
}
