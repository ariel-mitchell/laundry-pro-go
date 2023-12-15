import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import CustomerAutoComplete from './CustomerAutoComplete';
import styles from './OrderForm.module.css';
import { useState } from 'react';

export default function OrderForm() {
  const [orderNumber, setOrderNumber] = useState('');

  const [customerName, setCustomerName] = useState('');

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

const orderObject = {orderNumber, customerName, orderDetails};

const handleChange = (e) => {
  
  if (e.target.name === "orderNumber") {
    setOrderNumber(e.target.value);
  } else if (e.target.name === "customerName") {
    setCustomerName(e.target.value);
  } else {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  }
};

function submitData(e) {
  e.preventDefault();
  fetch("http://localhost:8080/orders/add", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(orderObject)
  }).then(sus=>console.log(sus)).catch(e=>console.log(e));
}

  return (
    <div>
      <h1>Add An Order</h1>
      <h4>Required Order Details</h4>
      <Box
      className={styles.container}
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch', padding:"10px" },
        }}
      >
        <TextField required={true} name="orderNumber" label="Order Number" variant="outlined" onChange={handleChange} />
        <TextField required={true} name="customerName" label="Customer Name" variant="outlined" onChange={handleChange} />
        {/* <CustomerAutoComplete required={true} onChange={handleChange}/>

        {/* TODO: update field to be date input */}
        <TextField required={true} label="Date Placed" name="datePlaced" variant="outlined" onChange={handleChange} />
      <h4 style={{textAlign:"center"}}>Optional Order Details</h4>
        <TextField label="Bags at Pickup" name="bagsAtPickup" variant="outlined" defaultValue="0" onChange={handleChange} />
        <TextField label="Bags at Dropoff" name="bagsAtDropoff" variant="outlined" defaultValue="0" onChange={handleChange} />
        <TextField label="Number of Loads" name="numberOfLoads" variant="outlined" defaultValue="0" onChange={handleChange} />
        <TextField label="Total Mileage" name="mileage" variant="outlined" defaultValue="0.0" onChange={handleChange} /><br></br>
        <TextField label="Total Pounds" name="pounds" variant="outlined" defaultValue="0.0"onChange={handleChange} />
        <TextField label="Order Payment" name="orderPayment" variant="outlined" defaultValue="0.00"onChange={handleChange} />
        <TextField label="Tip" name="tip" variant="outlined" defaultValue="0.00"onChange={handleChange} />
        <TextField label="Notes" name="notes" variant="outlined" onChange={handleChange}/>
      </Box>
      <Box>
        <Button onClick={submitData} variant="contained">Sumbit</Button>
      </Box>
    </div>
  );
}
