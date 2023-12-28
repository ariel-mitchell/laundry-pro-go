import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material/';


export default function Blacklist() {

    const [ customers, setCustomers ] = useState([]);

    const [ customer, setCustomer ] = useState({});

    useEffect(() => {
    fetch("http://localhost:8080/customers").then(res=>res.json()).then(result=>setCustomers(result)).catch(e=>console.log(e));
    })

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
    //   setSnackbar({ children: 'Customer status successfully saved', severity: 'success' });
    })
    .catch(e=>console.log(e));

    handleClose();
  }

  const handleClose = () => {
    toggleOpen(false);
  };


  return (
    <div>
        <TableContainer component={Paper} sx={{ width:"40%", margin:"auto", marginTop:"40px" }}>
            <h1>Blacklist (Do Not Take)</h1>
            
            <Table  aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Remove From List?</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {customers.map((row) => {
                    return row.isBlacklisted ? (
                    <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell 
                        align="center" 
                        onClick={() => {
                            setCustomer({
                                id: row.id,
                                name: row.name,
                                isBlacklisted: false,
                                isRegular: false
                            });
                            toggleOpen(true);
                        }}
                    >
                        <RemoveOutlinedIcon />
                    </TableCell>
                    </TableRow>
                ) : null })}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
            <form onSubmit={updateCustomer}>
            <DialogTitle>Remove {customer.name} From Blacklist?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button name="updateCustomer" type="submit">Yes</Button>
                </DialogActions>
            </form>
        </Dialog>
    </div>
  );
}