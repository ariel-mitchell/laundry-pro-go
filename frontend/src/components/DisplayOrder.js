import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, useCallback } from 'react';

const columns = [
  { field: 'orderNumber', headerName: 'Order Number', width: 130 },
  {
    field: 'customer.name',
    headerName: 'Customer',
    width: 150,
    sortable: true,
    filterable: true
  },
  {
    //TODO: not rendering and sorting by DATE
    field: 'orderDetails.datePlaced',
    headerName: 'Date Placed',
    width: 100,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.bagsAtPickup',
    headerName: 'Bags at Pickup',
    type: 'number',
    width: 110,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.numberOfLoads',
    headerName: '# Loads',
    type: 'number',
    width: 80,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.pounds',
    headerName: 'Total Pounds',
    type: 'number',
    width: 100,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.bagsAtDropoff',
    headerName: 'Bags at Dropoff',
    type: 'number',
    width: 110,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.mileage',
    headerName: 'Total Mileage',
    type: 'number',
    width: 100,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.orderPayment',
    headerName: 'Pay',
    type: 'amount',
    width: 60,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    field: 'orderDetails.tip',
    headerName: 'Tip',
    type: 'number',
    width: 60,
    editable: true,
    sortable: true,
    filterable: true
  },
  {
    field: 'orderDetails.notes',
    headerName: 'Notes',
    width: 300,
    editable: true,
    sortable: true,
    filterable: true
  },
];


export default function DisplayOrder() {
    const [ orders, setOrders ] = useState([]);

    const [ flattenedOrders, setFlattenedOrders ] = useState([]);

    const flattenObj = useCallback((obj, roots = [], sep = '.') => Object
  // find props of given object
  .keys(obj)
  // return an object by iterating props
  .reduce((memo, prop) => Object.assign(
    // create a new object
    {},
    // include previously returned object
    memo,
    Object.prototype.toString.call(obj[prop]) === '[object Object]'
      // keep working if value is an object
      ? flattenObj(obj[prop], roots.concat([prop]), sep)
      // include current prop and value and prefix prop with the roots
      : {[roots.concat([prop]).join(sep)]: obj[prop]},
    ), {}), [])

  //TODO: use same to flatten objs?
  const flattenArr = useCallback((into, node) => {
    if(node == null) {
      return into;
    }
    if(Array.isArray(node)) {
      let newArr = [];
      for (let i of node) {
        newArr.push(flattenObj(i));
      }
    return newArr.reduce(flattenArr, into);
    }
    into.push(node);
    return flattenArr(into, node.children);
  }, [flattenObj])

    useEffect(() => {
        fetch("http://localhost:8080/orders")
        .then(res=>res.json())
        .then(result=>setOrders(result))
        .then(setFlattenedOrders(flattenArr([], orders)))
        .catch(e=>console.log(e));
    }, [orders, flattenArr]);

    function getRowId(row) {
        return row.orderNumber;
    }

  return (
    <Box sx={{ height: 635, width: '90%', margin:'auto', marginTop:'50px', marginBottom:'50px' }}>
        <h2>Order Details</h2>
      <DataGrid
        rows={flattenedOrders}
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



