package com.laundrypro.laundryprogo.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.OrderDetails;
import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<Order> addNewOrder(@RequestBody OrderDto orderDto) {
        return new ResponseEntity<>(orderService.createOrder(orderDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() { return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK); }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Order>> getSingleOrder (@PathVariable("id") int orderId) {
        return new ResponseEntity<>(orderService.getOrderById(orderId), HttpStatus.OK);
    }

}
