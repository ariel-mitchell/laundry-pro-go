package com.laundrypro.laundryprogo.controllers;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers") @CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/add")
    public ResponseEntity<Customer> addNewCustomer (@RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.createCustomer(customer), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<Customer>> getAllCustomers () {
        return new ResponseEntity<>(customerService.getAllCustomers(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Customer>> getSingleCustomer (@PathVariable("id") int customerId) {
        return new ResponseEntity<>(customerService.getCustomerById(customerId), HttpStatus.OK);
    }

    @PatchMapping("{id}/blacklist")
    public ResponseEntity<Customer> blacklistCustomer (@PathVariable("id") int customerId) {
        return new ResponseEntity<>(customerService.blacklistCustomer(customerId), HttpStatus.OK);
    }

    @PatchMapping("{id}/regular")
    public ResponseEntity<Customer> makeRegular (@PathVariable("id") int customerId) {
        return new ResponseEntity<>(customerService.makeRegular(customerId), HttpStatus.OK);
    }

    @PatchMapping("{id}/update-name")
    public ResponseEntity<Customer> updateCustomerName (@PathVariable("id") int customerId, @RequestBody String name) {
        return new ResponseEntity<>(customerService.updateCustomerName(customerId, name), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteCustomer (@PathVariable("id") int customerId) {
        return new ResponseEntity<>(customerService.deleteCustomer(customerId), HttpStatus.OK);
    }
}
