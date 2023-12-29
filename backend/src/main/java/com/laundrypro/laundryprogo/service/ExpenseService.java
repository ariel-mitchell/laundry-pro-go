package com.laundrypro.laundryprogo.service;

import com.laundrypro.laundryprogo.models.Expense;
import com.laundrypro.laundryprogo.models.ExpenseCategory;
import com.laundrypro.laundryprogo.models.Order;
import com.laundrypro.laundryprogo.models.dto.MileageDto;
import com.laundrypro.laundryprogo.repository.ExpenseRepository;
import com.laundrypro.laundryprogo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    OrderRepository orderRepository;

    public Expense createExpense(Expense expense) { return expenseRepository.save(expense); }

    public List<Expense> getAllExpenses() {return expenseRepository.findAll(Sort.by(Sort.Direction.ASC, "dateOfExpense")); }

    public Expense updateExpense(Expense expense) {
        Expense existingExpense = expenseRepository.findById(expense.getId()).get();
        existingExpense.setDateOfExpense(expense.getDateOfExpense());
        existingExpense.setExpenseCategory(expense.getExpenseCategory());
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setHaveReceipt(expense.getHaveReceipt());
        existingExpense.setDetails(expense.getDetails());
        return expenseRepository.save(existingExpense);
    }

    public String deleteSingleExpense(int expenseId) {
        Optional<Expense> optExpense = expenseRepository.findById(expenseId);
        if (optExpense.isEmpty()) {
            return "There is no such expense.";
        }
        expenseRepository.deleteById(expenseId);
        return "Expense successfully deleted";
    }

    public Map<String, String> expenseCategories() {
        Map<String, String> categories = new HashMap<>();
        ExpenseCategory[] categoryEnum = ExpenseCategory.values();
        for (ExpenseCategory e : categoryEnum) {
            categories.put(e.name(), e.getDisplayName());
        }
        return categories;

    }

    public List<MileageDto> allMileage() {
        List<MileageDto> allMileage = new ArrayList<>();
        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            MileageDto toAdd = new MileageDto(order.getOrderDetails().getDatePlaced(), order.getOrderDetails().getMileage());
            allMileage.add(toAdd);
        }

        return allMileage;
    }
}
