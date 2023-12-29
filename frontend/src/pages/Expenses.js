import * as React from 'react';

import ExpenseForm from '../components/ExpenseForm';
import DisplayExpenses from '../components/DisplayExpenses';

export default function Expenses() {
    return (
        <div>
            <ExpenseForm />
            <DisplayExpenses />
        </div>
    )
}