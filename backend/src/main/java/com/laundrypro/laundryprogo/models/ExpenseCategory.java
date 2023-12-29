package com.laundrypro.laundryprogo.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExpenseCategory {
    BILLS("Bills"),
    CUSTOMER_APPRECIATION("Customer Appreciation"),
    EQUIPMENT("Equipment"),
    MARKETING_MATERIALS("Marketing Materials"),
    OTHER_MISC("Other/Misc"),
    PACKING_SUPPLIES("Packing Supplies"),
    WASHING_SUPPLIES("Washing Supplies");

    private final String displayName;


}
