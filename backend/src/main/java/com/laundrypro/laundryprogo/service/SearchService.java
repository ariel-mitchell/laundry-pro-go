package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.repository.CustomerRepository;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    //TODO: add a method to search by orderNumber
    //TODO: add a method to search by customer name (autocomplete with existing customers?)
    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    OrderRepository orderRepository;

    public List<OrderDto> getOrdersByCustomer (int customerId) {
        List<OrderDto> toSend = new ArrayList<>();
        List<Order> allOrders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        for (Order o : allOrders) {
            if (o.getCustomer().getId() == (customerId)) {
                OrderDto order = new OrderDto(o.getOrderNumber(), o.getCustomer(), o.getOrderDetails());
                toSend.add(order);
            }
        }
        return toSend;
    }

}
