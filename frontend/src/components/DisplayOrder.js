import * as React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect, useState, useMemo, useCallback } from 'react';

export default function DisplayOrder() {

  const editCustomer = useCallback(
    (id) => () => {
      return window.alert(`This customer's id is ${id}`);
    },
    [],
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
        return `${params.row.customer.name}`;
      },
      editable: false,
      sortable: true,
      filterable: true,
      getActions: (params) => [
        <p onClick={editCustomer(params.row.customer.id)} >{`${params.row.customer.name}`}</p>,
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
  ], [editCustomer]);

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
    <Box sx={{ height: 635, width: '90%', margin:'auto', marginTop:'50px', marginBottom:'50px' }}>
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
    </Box>
  );
}



