package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Customer;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.repository.CustomerRepository;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public Customer updateCustomerStatus (Customer customer) {
        Customer existingCustomer = customerRepository.findById(customer.getId()).get();
        //if customer is marked as a regular, they will not be added to blacklist
        Boolean toBlacklist = !customer.getIsRegular() && customer.getIsBlacklisted();
        existingCustomer.setIsRegular(customer.getIsRegular());
        existingCustomer.setIsBlacklisted(toBlacklist);
        return customerRepository.save(existingCustomer);
    }

    public Customer updateCustomerName (int customerId, String name) {
        Customer customer = customerRepository.findById(customerId).orElse(new Customer());
        customer.setName(name);
        return customerRepository.save(customer);
    }

    public String deleteCustomer(int customerId) {
//        Delete all orders associated with a customer first
        Optional<Customer> optCustomer = customerRepository.findById(customerId);
        Customer toDelete;
        if (optCustomer.isEmpty()) {
            return "There is no customer with that ID";
        } else {
            toDelete = optCustomer.get();
        }
        List<Order> orders = toDelete.getOrders();
        List<Integer> orderIds = new ArrayList<>();

        for (Order o : orders) {
            orderIds.add(o.getId());
        }

        orderRepository.deleteAllById(orderIds);

        customerRepository.deleteById(customerId);
        return "Customer successfully deleted.";
    }
}
