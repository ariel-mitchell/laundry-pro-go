import * as React from 'react';
import { Autocomplete, Box, Button, Dialog, Alert, Snackbar, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel, Checkbox, Popover, TextField, Typography } from '@mui/material/';
import { DataGrid, GridActionsCellItem, GridEditInputCell, GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import { useEffect, useState, useMemo, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


import styles from "./DisplayOrder.module.css";

export default function DisplayOrder() {

  //State and fetch handlers for order(s) & customers
  const [ orders, setOrders ] = useState([]);

  const [ customers, setCustomers ] = useState([]);

  const [ customer, setCustomer ] = useState({
    id: null,
    name: '',
    isRegular: false,
    isBlacklisted: false
  });

  const [ searchByCustomer, setSearchByCustomer ] = useState(false);

  useEffect(() => {
      if (searchByCustomer) {
        let url = `http://localhost:8080/search/byCustomer/${customer.id}`;
        fetch(url)
        .then(res=>res.json())
        .then(result=>setOrders(result))
        .catch(e=>console.log(e));
        return;
      }

      fetch("http://localhost:8080/orders")
      .then(res=>res.json())
      .then(result=>setOrders(result))
      .catch(e=>console.log(e));
  }, [orders, searchByCustomer, customer.id]);

  useEffect(() => {
    fetch("http://localhost:8080/customers").then(res=>res.json()).then(result=>setCustomers(result)).catch(e=>console.log(e));
  })

  // const searchByOrderNumber = (e) => {
  //   let filteredOrders = [];
  //   if (e.target.value.trim() === "" || e.target.value === null) {
  //     setSearchOrderNumber(false);
  //     return;
  //   }

    
  //   for (let order of orders) {
  //     if (order.orderNumber === e.target.value) {
  //       console.log(order.orderNumber);
  //       console.log(e.target.value);
  //       filteredOrders.push(order);
  //     }
  //   }
  //   setSearchOrderNumber(true);
  //   setOrders(filteredOrders);
  // }

  //Handlers and fields for updating customer in a dialogue box
  const [ open, toggleOpen ] = useState(false);

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
      setSnackbar({ children: 'Customer status successfully saved', severity: 'success' });
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

  //Handlers and state for updating rows of orders
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);
 
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
      setRowModesModel({
        ...rowModesModel,
        [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    }
  };

  const handleEditClick = useCallback(
    (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  }, [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  }, [rowModesModel]
  );

  const handleDeleteClick = useCallback(
    (id) => () => {
    if (!window.confirm("Delete Order?")) {
      return;
    }
    
    let url = `http://localhost:8080/orders/delete/${id}`;

    fetch(url, {
      method:"DELETE",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify()
    })
    .then(sus=> {
      console.log(sus);
      window.alert("Order Successfully Deleted");
    })
    .catch(e=>console.log(e));
  }, []
  );

  const handleCancelClick = useCallback(
    (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  }, [rowModesModel]
  );

  const buildDto = (newRow) => {
    let orderNumber = newRow.orderNumber;

    let customer = newRow.customer;

    let orderDetails = {
      datePlaced: newRow.datePlaced.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}),
      bagsAtPickup: newRow.bagsAtPickup,
      bagsAtDropoff: newRow.bagsAtDropoff,
      numberOfLoads: newRow.numberOfLoads,
      mileage: newRow.mileage,
      pounds: newRow.pounds,
      orderPayment: newRow.orderPayment,
      tip: newRow.tip,
      notes: newRow.notes,
      id: newRow.orderDetails.id,
    };

    let orderObject = {orderNumber, customer, orderDetails};

      submitUpdates(orderObject);
  }

  const submitUpdates = (orderObject) => {

    fetch("http://localhost:8080/orders/update", {
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(orderObject)
    })
    .then(sus=> {
      console.log(sus);
      setSnackbar({ children: 'Order successfully updated', severity: 'success' });
    })
    .catch(e=>console.log(e));

    setRowModesModel({
      ...rowModesModel,
      [orderObject.orderNumber]: { mode: GridRowModes.View, ignoreModifications: true },
    });

  };

  //TODO: figure out error with save button not being able to find orderNumber
  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //Column definitions
  const columns = useMemo (
    () => {
      //currency column formatters
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      const usdPrice = {
        type: 'number',
        width: 80,
        valueFormatter: ({ value }) => currencyFormatter.format(value),
        cellClassName: 'font-tabular-nums',
      };

     return [
    { field: 'orderNumber', headerName: 'Order Number', width: 130, editable:false, },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      type: 'text',
      width: 130,
      valueGetter: (params) => {
        return `${params.row.customer}`;
      },
      editable: false,
      sortable: false,
      filterable: false,
      //TODO: fix 'touchRippleRef' error
      renderCell: (params) => (
      <p onClick={() => {
          setCustomer(params.row.customer);
          toggleOpen(true);
          }
        }
        onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>{params.row.customer.name}</p>
      ),
    //   getActions: (params) => [
        // <GridActionsCellItem label={params.row.customer.name}>
        //   <Typography 
        //   label={params.row.customer.name}
        //   onClick={() => {
        //     setCustomer(params.row.customer);
        //     toggleOpen(true);
        //         }
        //       }
        //   onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} >{`${params.row.customer.name}`}</Typography>
        // </GridActionsCellItem>,
    //   ],
    },
    {
      field: 'datePlaced',
      headerName: 'Date Placed',
      type: "date",
      width: 100,
      valueGetter: (params) => new Date(params.row.orderDetails.datePlaced),
      editable: true,
      sortable: true,
      filterable: true,
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
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
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
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
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
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
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
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
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
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
    },
    {
      field: 'orderPayment',
      headerName: 'Pay',
      type: 'usdPrice',
      valueGetter: (params) => {
        return `${params.row.orderDetails.orderPayment}`;
      },
      ...usdPrice,
      editable: true,
      sortable: true,
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
    },
    {
      field: 'tip',
      headerName: 'Tip',
      type: 'usdPrice',
      valueGetter: (params) => {
        return `${params.row.orderDetails.tip}`;
      },
      editable: true,
      ...usdPrice,
      sortable: true,
      filterable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
          }}
        />
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 280,
      valueGetter: (params) => {
        return `${params.row.orderDetails.notes}`;
      },
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]}, [toggleOpen, handlePopoverOpen, handlePopoverClose, handleCancelClick, handleEditClick, handleSaveClick, handleDeleteClick, rowModesModel]);

    function getRowId(row) {
        return row.orderNumber;
    }

  return (
    <Box sx={{ height: 650, width: '90%', margin:'auto', marginTop:'50px', marginBottom:'200px' }}>
        <h1>Order Details</h1>
        <div className={styles.searchForm}>
          <h2>Search By:</h2>
          <Autocomplete
            onChange={(event, newValue) => {
              if (newValue === null) {
                setSearchByCustomer(false);
                return;
              } else {
                setCustomer(newValue);
                setSearchByCustomer(true);
              }}}
            selectOnFocus
            clearOnBlur
            disablePortal
            isOptionEqualToValue={(option, value) => option.name === value.name}
            id="search-by-customer"
            options={customers}
            sx={{ width: 300 }}
            getOptionLabel={(option) => {
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInput={(params) => <TextField {...params} label="Customer" />}
          />
        </div>
      <DataGrid
        editMode='row'
        rows={orders}
        columns={columns}
        getRowId={getRowId}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={(newRow, originalRow) => {buildDto(newRow)}
        }
        onProcessRowUpdateError={handleProcessRowUpdateError}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
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
          <DialogTitle>Update {customer.name}'s Status</DialogTitle>
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
    </Box>
  );
}



