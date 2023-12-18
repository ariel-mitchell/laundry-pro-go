import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Collapse from '@mui/material/Collapse';
// import Alert from '@mui/material/Alert'
// import Stack from '@mui/material/Stack'

import styles from './OrderForm.module.css';

const filter = createFilterOptions();

export default function OrderForm() {
  const [orderNumber, setOrderNumber] = useState('');

  const [customer, setCustomer] = useState({
    id: null,
    name: ''
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

  const orderObject = {orderNumber, customer, orderDetails};

  React.useEffect(() => {
    fetch("http://localhost:8080/customers").then(res=>res.json()).then(result=>setCustomers(result)).catch(e=>console.log(e));
  })

  function submitData(e) {
    e.preventDefault();
    if (orderNumber === "" || (customer.id === 0 && customer.name === "") || (customer.id === null && customer.name === "") || orderDetails.datePlaced === "") {
      window.alert("Please enter all required fields.")
      return ;
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
        {/* <Alert sx={{ width: '50%', margin:'auto', marginTop:'60px', textAlign:'center' }} variant="filled" severity="error">Order Number is Required!</Alert> */}
        <Box
        className={styles.container}
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch', padding:"10px" },
          }}
          noValidate={false}
        >
          <TextField error={orderNumber ? false : true} name="orderNumber" label="Order Number" variant="outlined" id="outlined-error-helper-text" helperText="Order number required." value={orderNumber} onChange={handleChange} />
          <Autocomplete
            value={customer}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setCustomer({
                  id: 0,
                  name: newValue
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setCustomer({
                  id: 0,
                  name: newValue.inputValue
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
              <TextField {...params} label="Customer" error={customer.name ? false : true } id="outlined-error-helper-text" helperText="Customer required." />
            )}
          />
          {/* TODO: update field to be date input */}
          <TextField error={orderDetails.datePlaced ? false : true} label="Date Placed" name="datePlaced" variant="outlined" id="outlined-error-helper-text" helperText="Date required." value={orderDetails.datePlaced} onChange={handleChange} />
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
          {/* TODO: make these fields currency */}
          <TextField label="Order Payment" name="orderPayment" variant="outlined" value={orderDetails.orderPayment} onChange={handleChange} />
          <TextField label="Tip" name="tip" variant="outlined" value={orderDetails.tip} onChange={handleChange} />
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
