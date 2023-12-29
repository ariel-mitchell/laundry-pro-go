package com.laundrypro.laundryprogo.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor @NoArgsConstructor
public class Expense extends AbstractEntity {

    @NotNull
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="MM/dd/yyyy")
    private Date dateOfExpense;

    @NotNull
    private double amount;

    @NotNull
    private ExpenseCategory expenseCategory;

    @NotNull
    private Boolean haveReceipt;
    private String details;

}
