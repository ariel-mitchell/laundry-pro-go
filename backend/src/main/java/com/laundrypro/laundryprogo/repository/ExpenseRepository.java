package com.laundrypro.laundryprogo.repository;

import com.laundrypro.laundryprogo.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
}
