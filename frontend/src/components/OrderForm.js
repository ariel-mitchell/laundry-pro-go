import * as React from 'react';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import Alert from '@mui/material/Alert'
// import Stack from '@mui/material/Stack'

import styles from './OrderForm.module.css';

const filter = createFilterOptions();

//TODO: refactor using react hooks, create custom hooks and store in separate file, general cleanup, etc
export default function OrderForm() {
  const [orderNumber, setOrderNumber] = useState('');

  const [orderNumbers, setOrderNumbers] = useState([]);

  const [customer, setCustomer] = useState({
    id: null,
    name: '',
    isRegular: false,
    isBlacklisted: false
  });

  const [customers, setCustomers] = useState([]);

  const [orderDetails, setOrderDetails] = useState({
    datePlaced: '',
    bagsAtPickup: 0,
    bagsAtDropoff: 0,
    numberOfLoads: 0,
    mileage: 0,
    pounds: 0,
    orderPayment: 0,
    tip: 0,
    notes: ''
  });

  const [visible, setVisible] = useState(true);

  const handleVisibility = (e) => {
    setVisible((prev) => !prev)
  };

  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    setDialogValue({
      id: null,
      name: '',
      isRegular: false,
      isBlacklisted: false
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    id: null,
    name: '',
    isRegular: false,
    isBlacklisted: false
  });

  const handleChange = (e) => {
    if (e.target.name === "orderNumber") {
      setOrderNumber(e.target.value);
    } else {
      setOrderDetails({
        ...orderDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDateChange = (value) => {
    setOrderDetails({
      ...orderDetails,
      datePlaced: value.$M+1 +'/'+ value.$D +'/'+ value.$y,
    })
}

  const reset = () => {
    setOrderNumber('');
    setCustomer({id: null, name: ''});
    setOrderDetails({
      datePlaced: '',
      bagsAtPickup: 0,
      bagsAtDropoff: 0,
      numberOfLoads: 0,
      mileage: 0,
      pounds: 0,
      orderPayment: 0,
      tip: 0,
      notes: ''
    });
  };

  const checkExistingCustomerName = () => {
    for (let customer of customers) {
      if (customer.name === dialogValue.name) {
        return true;
      }
    }
    return false;
  }

  const orderObject = {orderNumber, customer, orderDetails};

  useEffect(() => {
    fetch("http://localhost:8080/customers").then(res=>res.json()).then(result=>setCustomers(result)).catch(e=>console.log(e));
  })

  useEffect(() => {
    fetch("http://localhost:8080/orders/numbers")
    .then(res=>res.json())
    .then(result=>setOrderNumbers(result))
    .catch(e=>console.log(e));
}, []);

  const handleSubmitNewCustomerData = (event) => {
    event.preventDefault();

    if (checkExistingCustomerName()) {
      window.alert("That customer name already exists. Make your new customer name more unique to tell them apart!");
      return;
    }

    setCustomer({
      id: dialogValue.id,
      name: dialogValue.name,
      isRegular: dialogValue.isRegular,
      isBlacklisted: dialogValue.isBlacklisted,
    });
    handleClose();
  };

  function submitData(e) {
    e.preventDefault();
    //TODO: refactor to use timeout to validate BEFORE form submission is attempted
    if (orderNumbers.includes(orderNumber)) {
      window.alert("There is already an order with that number. Please update that order or create a new one.");
      setOrderNumber('');
      return;
    }

    if (orderNumber.trim() === "" || (customer.id === 0 && customer.name === "") || (customer.id === null && customer.name === "") || orderDetails.datePlaced === "") {
      window.alert("Please enter all required fields.")
      return;
    }

    fetch("http://localhost:8080/orders/add", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(orderObject)
    })
    .then(sus=> {
      console.log(sus);
      window.alert("Order successfully submitted!");
      reset();})
    .catch(e=>console.log(e));
  };

  return (
    <div>
      <Collapse in={visible}>
        <h1>Add An Order</h1>
        {/* TODO: add alert HTML elements instead of window alert? */}
        {/* <Alert open={!!orderNumber} sx={{ width: '50%', margin:'auto', marginTop:'30px', marginBottom:'30px' }} variant="filled" severity="error">Order Number is Required!</Alert> */}
        <Box
        className={styles.container}
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch', padding:"10px" },
          }}
          noValidate={false}
        >
          <TextField error={!orderNumber} name="orderNumber" label="Order Number" variant="outlined" id="outlined-error-helper-text" helperText={!orderNumber ? "Order number required" : ""} value={orderNumber} onChange={handleChange} />
          <><Autocomplete
            value={customer}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setTimeout(() => {
                  toggleOpen(true);
                  setDialogValue({
                    id: 0,
                    name: newValue,
                    isRegular: false,
                    isBlacklisted: false,
                  });
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                toggleOpen(true);
                setDialogValue({
                  id: 0,
                  name: newValue.inputValue,
                  isRegular: false,
                  isBlacklisted: false,
                });
              } else {
                setCustomer(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.name);
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            id="customer"
            disableClearable={true}
            handleHomeEndKeys
            options={customers}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Customer" error={!customer.name} id="outlined-error-helper-text" helperText={!customer.name ? "Customer required" : ""} />
            )}
          />
          <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmitNewCustomerData}>
          <DialogTitle>Add a New Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If adding a different customer with the same name, make it unique somehow! (i.e. add town or other identifier)
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Customer Name"
              type="text"
              variant="standard"
            />
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox color="success" 
                checked={dialogValue.isRegular}
                onChange={(e) => 
                  setDialogValue({
                    ...dialogValue,
                    isRegular: e.target.checked,
                  })
                }
                />} 
                label="Customer is a Regular" 
              />
              <FormControlLabel 
                control={<Checkbox color="default"
                  checked={dialogValue.isBlacklisted}
                  onChange={(e) =>
                    setDialogValue({
                      ...dialogValue,
                      isBlacklisted: e.target.checked,
                    })
                  }
                  />} 
                label="Blacklist Customer (do not take again)" 
              />
              {dialogValue.isRegular && dialogValue.isBlacklisted ? <Alert severity='error'>A customer cannot be a regular AND blacklisted</Alert> : <></>}
            </FormGroup>
          </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={dialogValue.isRegular && dialogValue.isBlacklisted ? true : false} name="submitNewCustomer" type="submit">Add</Button>
              </DialogActions>
            </form>
          </Dialog></>
          <DatePicker 
            error={!orderDetails.datePlaced} 
            label="Date Placed" 
            variant="outlined" 
            id="outlined-error-helper-text" 
            slotProps={!orderDetails.datePlaced ? {
              textField: {
                helperText: "Date Required",
              },
            } : false}
            value={dayjs(orderDetails.datePlaced)} 
            onChange={(value) => handleDateChange(value)} format="MM-DD-YYYY"/>
        </Box>
        <h4>Optional Order Details</h4>
        <Box
          sx={{
            '& > :not(style)': { m: 1, width: '25ch', padding:"10px" },
          }}
          noValidate={true}
        >
          <TextField label="Bags at Pickup" name="bagsAtPickup" variant="outlined" value={orderDetails.bagsAtPickup} onChange={handleChange} />
          <TextField label="Bags at Dropoff" name="bagsAtDropoff" variant="outlined" value={orderDetails.bagsAtDropoff} onChange={handleChange} />
          <TextField label="Number of Loads" name="numberOfLoads" variant="outlined" value={orderDetails.numberOfLoads} onChange={handleChange} />
          <TextField label="Total Mileage" name="mileage" variant="outlined" value={orderDetails.mileage} onChange={handleChange} /><br></br>
          <TextField label="Total Pounds" name="pounds" variant="outlined" value={orderDetails.pounds}onChange={handleChange} />
          <FormControl>
          <InputLabel htmlFor="orderPayment">Order Payment</InputLabel>
            <OutlinedInput
              id="orderPayment"
              name="orderPayment"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Order Payment"
              value={orderDetails.orderPayment} 
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="tip">Tip</InputLabel>
            <OutlinedInput
              id="tip"
              name="tip"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Tip"
              value={orderDetails.tip} 
              onChange={handleChange}
            />
          </FormControl>
          <TextField label="Notes" name="notes" variant="outlined" value={orderDetails.notes} onChange={handleChange}/>
        </Box>
        <Box>
          <Button onClick={submitData} variant="contained">Sumbit</Button>
        </Box>
      </Collapse><br></br>
      <Box>
        <Button onClick={handleVisibility} variant={visible ? "text" : "contained"}>{visible ? "Hide Order Form" : "Enter a New Order"}</Button>
      </Box>
    </div>
  );
}
