package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order, Customer customer) {
        order.setCustomer(customer);
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return (List<Order>) orderRepository.findAll(Sort.by(Sort.Direction.DESC));
    }

    public Order updateOrder(Order order) {
        Order existingOrder = orderRepository.findById(order.getId()).get();
        existingOrder.setOrderNumber(order.getOrderNumber());
        existingOrder.setCustomer(order.getCustomer());
        existingOrder.setOrderDetails(order.getOrderDetails());
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(int orderId) {
        orderRepository.deleteById(orderId);
    }
}
