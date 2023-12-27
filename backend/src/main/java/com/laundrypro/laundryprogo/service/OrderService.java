package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.repository.CustomerRepository;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Order createOrder(OrderDto orderDto) {
        //TODO: logic that will stop an order with the same order number from being created

        Order order = new Order();
        order.setOrderNumber(orderDto.getOrderNumber());
        Optional<Customer> optCustomer = customerRepository.findById(orderDto.getCustomer().getId());
        Customer customer;
        if (optCustomer.isEmpty()) {
            //if customer is marked as a regular, they will not be added to blacklist
            Boolean toBlacklist = !orderDto.getCustomer().getIsRegular() && orderDto.getCustomer().getIsBlacklisted();
            customer = new Customer(orderDto.getCustomer().getName(), orderDto.getCustomer().getIsRegular(), toBlacklist);
            customerRepository.save(customer);
        } else {
            customer = optCustomer.get();
        }
        order.setCustomer(customer);
        order.setOrderDetails(orderDto.getOrderDetails());
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        List<Order> orders = orderRepository.findAll();
        int orderId = 0;
        for (Order order : orders) {
            if (order.getOrderNumber().equals(orderNumber)) {
                orderId = order.getId();
            }
        }
        Optional<Order> optOrder = orderRepository.findById(orderId);
        Order existingOrder = null;
        if (optOrder.isPresent()) {
            existingOrder = optOrder.get();
        }
        return existingOrder;
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<OrderDto> toSend = new ArrayList<>();
        for (Order o : orders) {
            OrderDto order = new OrderDto(o.getOrderNumber(), o.getCustomer(), o.getOrderDetails());
            toSend.add(order);
        }
        return toSend;
    }

    public List<String> getOrderNumbers() {
        List<String> orderNumbers = new ArrayList<>();
        List<Order> orders = orderRepository.findAll();
        for (Order o : orders) {
            orderNumbers.add(o.getOrderNumber());
        }
        return orderNumbers;
    }

    public Order updateOrder(OrderDto orderDto) {
        Order existingOrder = getOrderByOrderNumber(orderDto.getOrderNumber());
//        existingOrder.setOrderNumber(orderDto.getOrderNumber());
//        existingOrder.setCustomer(orderDto.getCustomer());
        existingOrder.getOrderDetails().setBagsAtDropoff(orderDto.getOrderDetails().getBagsAtDropoff());
        existingOrder.getOrderDetails().setBagsAtPickup(orderDto.getOrderDetails().getBagsAtPickup());
        existingOrder.getOrderDetails().setOrderPayment(orderDto.getOrderDetails().getOrderPayment());
        existingOrder.getOrderDetails().setTip(orderDto.getOrderDetails().getTip());
        existingOrder.getOrderDetails().setNotes(orderDto.getOrderDetails().getNotes());
        existingOrder.getOrderDetails().setNumberOfLoads(orderDto.getOrderDetails().getNumberOfLoads());
        existingOrder.getOrderDetails().setMileage(orderDto.getOrderDetails().getMileage());
        existingOrder.getOrderDetails().setPounds(orderDto.getOrderDetails().getPounds());
        existingOrder.getOrderDetails().setDatePlaced(orderDto.getOrderDetails().getDatePlaced());

        return orderRepository.save(existingOrder);
    }

    public String deleteSingleOrder(String orderNumber) {
        orderRepository.deleteById(getOrderByOrderNumber(orderNumber).getId());
        return "Order successfully deleted.";
    }

    public String deleteMultipleOrders(List<Integer> orderIds) {
        orderRepository.deleteAllById(orderIds);
        return "Orders successfully deleted.";
    }
}
