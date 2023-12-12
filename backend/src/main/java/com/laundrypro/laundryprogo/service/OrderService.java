package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.OrderDetails;
import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.repository.CustomerRepository;
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

    @Autowired
    private CustomerRepository customerRepository;

    public Order createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setOrderNumber(orderDto.getOrderNumber());
        Customer customer = customerRepository.findById(orderDto.getCustomerId()).orElse(new Customer());
        order.setCustomer(customer);
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() { return orderRepository.findAll(Sort.by(Sort.Direction.DESC)); }

    public Order updateOrder(Order order) {
        Order existingOrder = orderRepository.findById(order.getId()).get();
        existingOrder.setOrderNumber(order.getOrderNumber());
//        existingOrder.setCustomer(order.getCustomer());
//        existingOrder.setOrderDetails(order.getOrderDetails());
        return orderRepository.save(existingOrder);
    }

    public String deleteSingleOrder(int orderId) {
        orderRepository.deleteById(orderId);
        return "Order successfully deleted.";
    }

    public String deleteMultipleOrders(List<Integer> orderIds) {
        orderRepository.deleteAllById(orderIds);
        return "Orders successfully deleted.";
    }
}
