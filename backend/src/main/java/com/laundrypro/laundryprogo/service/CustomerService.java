package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.repository.CustomerRepository;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerById(int customerId) {
        return customerRepository.findById(customerId);
    }

    public List<Customer> getAllCustomers() { return customerRepository.findAll(Sort.by(Sort.Direction.ASC, "name")); }

    public Customer blacklistCustomer(int customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(new Customer());
        customer.setIsBlacklisted(customer.getIsBlacklisted().equals(false));
        return customerRepository.save(customer);
    }

    public Customer makeRegular (int customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(new Customer());
        customer.setIsRegular(customer.getIsRegular().equals(false));
        return customerRepository.save(customer);
    }

    public Customer updateCustomerName (int customerId, String name) {
        Customer customer = customerRepository.findById(customerId).orElse(new Customer());
        customer.setName(name);
        return customerRepository.save(customer);
    }

    public String deleteCustomer(int customerId) {
        //TODO: Delete orders associated with the customer?
        customerRepository.deleteById(customerId);
        return "Customer successfully deleted.";
    }
}
