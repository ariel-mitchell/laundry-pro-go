import * as React from 'react';
import { Box, Button, Dialog, Alert, Snackbar, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel, Checkbox, Popover, Typography } from '@mui/material/';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, useMemo, useCallback } from 'react';

import styles from "./DisplayOrder.module.css";

export default function DisplayOrder() {

  const [ susAlert, setSusAlert ] = useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSusAlert(false);
  };

  const SuccessAlert = useCallback( 
    (props) => {
    return (
      <Snackbar anchorOrigin={{vertical:'bottom', horizontal:'center'}} open={susAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert onClose={handleCloseAlert} severity="success" varient="filled" sx={{ width: '80%' }}>
        {props.message}
      </Alert>
      </Snackbar>
    );
  }, [susAlert]
);

  //Handlers and fields for updating customer in a dialogue box
  const [ open, toggleOpen ] = useState(false);

  const [ customer, setCustomer ] = useState({
    id: null,
    name: '',
    isRegular: false,
    isBlacklisted: false
  });

  const updateCustomer = (e) => {
    e.preventDefault();

    let url = `http://localhost:8080/customers/${customer.id}/status`;

    fetch(url, {
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(customer)
    })
    .then(sus=> {
      console.log(sus);
      setSusAlert(true);
    })
    .catch(e=>console.log(e));

    handleClose();
  }

  const handleClose = () => {
    toggleOpen(false);
  };

  //Handlers and fields for popovers
  const [ anchorEl, setAnchorEl ] = useState(null);

  const popoverOpen = Boolean(anchorEl);
  
  const handlePopoverClose = useCallback(
    () => {
   setAnchorEl(null);
 }, [],
 );

  const handlePopoverOpen = useCallback(
    (event) => {
    setAnchorEl(event.currentTarget);
  }, [],
  );

  const columns = useMemo (
    () => [
    { field: 'orderNumber', headerName: 'Order Number', width: 130, editable:false },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      type: 'actions',
      width: 150,
      valueGetter: (params) => {
        return `${params.row.customer}`;
      },
      editable: false,
      sortable: true,
      filterable: true,
      //TODO: fix 'touchRippleRef' error
      getActions: (params) => [
        <p className={styles.clickableCustomer} 
        onClick={(event) => {
          setCustomer(params.row.customer);
          toggleOpen(true);
              }
            }
        onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} >{`${params.row.customer.name}`}</p>,
      ],
    },
    {
      field: 'datePlaced',
      headerName: 'Date Placed',
      type: "date",
      width: 100,
      valueGetter: (params) => new Date(params.row.orderDetails.datePlaced),
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'bagsAtPickup',
      headerName: 'Bags at Pickup',
      type: 'number',
      width: 110,
      valueGetter: (params) => {
        return `${params.row.orderDetails.bagsAtPickup}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'numberOfLoads',
      headerName: '# Loads',
      type: 'number',
      width: 80,
      valueGetter: (params) => {
        return `${params.row.orderDetails.numberOfLoads}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'pounds',
      headerName: 'Total Pounds',
      type: 'number',
      width: 100,
      valueGetter: (params) => {
        return `${params.row.orderDetails.pounds}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'bagsAtDropoff',
      headerName: 'Bags at Dropoff',
      type: 'number',
      width: 110,
      valueGetter: (params) => {
        return `${params.row.orderDetails.bagsAtDropoff}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'mileage',
      headerName: 'Total Mileage',
      type: 'number',
      width: 100,
      valueGetter: (params) => {
        return `${params.row.orderDetails.mileage}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'orderPayment',
      headerName: 'Pay',
      type: 'amount',
      width: 60,
      valueGetter: (params) => {
        return `${params.row.orderDetails.orderPayment}`;
      },
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      field: 'tip',
      headerName: 'Tip',
      type: 'number',
      width: 60,
      valueGetter: (params) => {
        return `${params.row.orderDetails.tip}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 300,
      valueGetter: (params) => {
        return `${params.row.orderDetails.notes}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
  ], [toggleOpen, handlePopoverOpen, handlePopoverClose]);

    const [ orders, setOrders ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/orders")
        .then(res=>res.json())
        .then(result=>setOrders(result))
        .catch(e=>console.log(e));
    }, [orders]);

    function getRowId(row) {
        return row.orderNumber;
    }

  return (
    <Box sx={{ height: 635, width: '90%', margin:'auto', marginTop:'50px', marginBottom:'100px' }}>
        <h2>Order Details</h2>
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={getRowId}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>Click to edit</Typography>
      </Popover>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
          <form onSubmit={updateCustomer}>
          <DialogTitle>Update Customer Status</DialogTitle>
          <DialogContent>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox color="success" 
                checked={customer.isRegular}
                onChange={(e) => 
                  setCustomer({
                    ...customer,
                    isRegular: e.target.checked,
                  })
                }
                />} 
                label="Customer is a Regular" 
              />
              <FormControlLabel 
                control={<Checkbox color="default"
                  checked={customer.isBlacklisted}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      isBlacklisted: e.target.checked,
                    })
                  }
                  />} 
                label="Blacklist Customer (do not take again)" 
              />
              {customer.isRegular && customer.isBlacklisted ? <Alert severity='error'>A customer cannot be a regular AND blacklisted</Alert> : <></>}
            </FormGroup>
          </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={customer.isRegular && customer.isBlacklisted ? true : false} name="updateCustomer" type="submit">Update Status</Button>
              </DialogActions>
            </form>
          </Dialog>
          {<SuccessAlert message="Customer status successfully updated!" />}
    </Box>
  );
}



