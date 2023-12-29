package com.laundrypro.laundryprogo.controllers;

import com.laundrypro.laundryprogo.models.Expense;
import com.laundrypro.laundryprogo.models.dto.MileageDto;
import com.laundrypro.laundryprogo.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController @CrossOrigin
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    ExpenseService expenseService;

    @GetMapping("/mileage")
    public ResponseEntity<List<MileageDto>> getAllMileage() {return new ResponseEntity<>(expenseService.allMileage(), HttpStatus.OK); }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, String>> getExpenseCategories() {return new ResponseEntity<>(expenseService.expenseCategories(), HttpStatus.OK); }

    @PostMapping("/add")
    public ResponseEntity<Expense> addNewExpense(@RequestBody Expense expense) {
        return new ResponseEntity<>(expenseService.createExpense(expense), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() { return new ResponseEntity<>(expenseService.getAllExpenses(), HttpStatus.OK); }

    @PatchMapping("/update")
    public ResponseEntity<Expense> updateExpense (@RequestBody Expense expense) {
        return new ResponseEntity<>(expenseService.updateExpense(expense), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteExpense (@PathVariable("id") int expenseId) {
        return new ResponseEntity<>(expenseService.deleteSingleExpense(expenseId), HttpStatus.OK);
    }
}
