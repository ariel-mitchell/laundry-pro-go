import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Snackbar, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function ExpenseForm() {
    const [expense, setExpense] = useState({
        dateOfExpense: '',
        amount: 0,
        expenseCategory: '',
        haveReceipt: false,
        details: ''
    });

    const [categories, setCategories] = useState({});

    const [snackbar, setSnackbar] = useState(null);

    const handleCloseSnackbar = () => setSnackbar(null);

    useEffect(() => {
        fetch("http://localhost:8080/expenses/categories").then(res=>res.json()).then(result=>setCategories(result)).catch(e=>console.log(e));
      }) 

      const handleDateChange = (value) => {
        setExpense({
          ...expense,
          dateOfExpense: value.$M+1 +'/'+ value.$D +'/'+ value.$y,
        })
    }

    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value,
        })
    }

    const reset = () => {
        setExpense({
            dateOfExpense: '',
            amount: 0,
            expenseCategory: '',
            haveReceipt: false,
            details: ''
        });
      };

      const validateForm = () => {
        //TODO: refactor to use timeout to validate BEFORE form submission is attempted
    
        if (expense.dateOfExpense === "" || expense.amount === "" || expense.amount === 0 || expense.expenseCategory === "") {
          window.alert("Please enter all required fields.")
          return false;
        }
    
        if (isNaN(Number(expense.amount))) {
          window.alert("Amount must be a number");
          return false;
        }
    
        return true;
      }

    function submitData(e) {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
          return;
        }
    
        fetch("http://localhost:8080/expenses/add", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(expense)
        })
        .then(sus=> {
          console.log(sus);
          console.log(expense);
          setSnackbar({ children: 'Order successfully updated', severity: 'success' });
          reset();})
        .catch(e=>console.log(e));
      };

    return (
        <div>
            <h1>Add an Expense</h1>
            <Box
                // className={styles.container}
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch', padding:"10px" },
                }}
                noValidate={false}
            >
            <DatePicker 
                error={!expense.dateOfExpense} 
                label="Date" 
                variant="outlined" 
                // slotProps={!expense.dateOfExpense ? {
                // textField: {
                //     helperText: "Date Required",
                // },
                // } : {}}
                value={dayjs(expense.dateOfExpense)} 
                onChange={(value) => handleDateChange(value)} format="MM-DD-YYYY"/>    
            {/* <TextField error={!expense.amount} name="amount" label="Amount" variant="outlined" helperText={!expense.amount ? "Amount Required" : ""} value={expense.amount} onChange={handleChange} /> */}
            <FormControl>
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <OutlinedInput
              error={isNaN(Number(expense.amount)) || !expense.amount}
              id="amount"
              name="amount"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Amount"
              value={expense.amount} 
              onChange={handleChange}
            />
            <FormHelperText error>{isNaN(Number(expense.amount)) ? "Must be a number" : ""}</FormHelperText>
          </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    name="expenseCategory"
                    error={!expense.expenseCategory}
                    value={expense.expenseCategory}
                    label="Category"
                    onChange={handleChange}
                >

                    {Object.entries(categories).sort().map(([key, value]) => (  
                        <MenuItem key={key} value={key}>{value}</MenuItem>
                    ))}

                </Select>
                {/* <FormHelperText error={!expense.expenseCategory}>{!expense.expenseCategory ? "Category Required" : ""}</FormHelperText> */}
            </FormControl>
            <TextField name="details" label="Details" variant="outlined" value={expense.details} onChange={handleChange} />
            <FormControlLabel 
                label="Have Receipt?" 
                control={<Checkbox color="success" 
                checked={expense.haveReceipt}
                onChange={(e) => 
                  setExpense({
                    ...expense,
                    haveReceipt: e.target.checked,
                  })
                }
                />} 
              />
            </Box>
            <Box>
                <Button onClick={submitData} variant="contained">Sumbit</Button>
            </Box>
            {!!snackbar && (
                <Snackbar
                open
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
                >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </div>
    )
}