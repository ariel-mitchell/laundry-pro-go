package com.laundrypro.laundryprogo.controllers;

import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController @CrossOrigin
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<Order> addNewOrder(@RequestBody OrderDto orderDto) {
        return new ResponseEntity<>(orderService.createOrder(orderDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() { return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK); }

    @GetMapping("/numbers")
    public ResponseEntity<List<String>> getAllOrderNumbers() {return new ResponseEntity<>(orderService.getOrderNumbers(), HttpStatus.OK); }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Order>> getSingleOrder (@PathVariable("id") int orderId) {
        return new ResponseEntity<>(orderService.getOrderById(orderId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder (@PathVariable("id") int orderId) {
        return new ResponseEntity<>(orderService.deleteSingleOrder(orderId), HttpStatus.OK);
    }

}
