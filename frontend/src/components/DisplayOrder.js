import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

const columns = [
  { field: 'orderNumber', headerName: 'Order Number', width: 130 },
  {
    field: 'name',
    headerName: 'Customer',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.customer.name}</div>
  },
  {
    field: 'datePlaced',
    headerName: 'Date Placed',
    type: 'date',
    width: 100,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.datePlaced}</div>
  },
  {
    field: 'bagsAtPickup',
    headerName: 'Bags at Pickup',
    type: 'number',
    width: 110,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.bagsAtPickup}</div>
  },
  {
    field: 'numberOfLoads',
    headerName: '# Loads',
    type: 'number',
    width: 80,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.numberOfLoads}</div>
  },
  {
    field: 'pounds',
    headerName: 'Total Pounds',
    type: 'number',
    width: 100,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.pounds}</div>
  },
  {
    field: 'bagsAtDropoff',
    headerName: 'Bags at Dropoff',
    type: 'number',
    width: 110,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.bagsAtDropoff}</div>
  },
  {
    field: 'mileage',
    headerName: 'Total Mileage',
    type: 'number',
    width: 100,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.mileage}</div>
  },
  {
    field: 'orderPayment',
    headerName: 'Pay',
    type: 'number',
    width: 80,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.orderPayment}</div>
  },
  {
    field: 'tip',
    headerName: 'Tip',
    type: 'number',
    width: 80,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.tip}</div>
  },
  {
    field: 'notes',
    headerName: 'Notes',
    width: 300,
    editable: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => <div className="rowitem">{params.row.orderDetails.notes}</div>
  },
];


export default function DisplayOrder() {
    const [ orders, setOrders ] = useState([]);

    
// TODO: React.useCallback to stop infinite loops?
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



