package com.laundrypro.laundryprogo.controllers;

import com.laundrypro.laundryprogo.models.dto.OrderDto;
import com.laundrypro.laundryprogo.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/search")
public class SearchController {

    @Autowired
    SearchService searchService;

    @GetMapping("/byCustomer/{id}")
    public ResponseEntity<List<OrderDto>> getAllOrdersByCustomer(@PathVariable("id") int customerId) {
        return new ResponseEntity<>(searchService.getOrdersByCustomer(customerId), HttpStatus.OK);
    }

}
