import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function FreeSoloCreateOption() {
  const [customer, setCustomer] = React.useState({
    id: 0,
    name: ''
  });

  const [customers, setCustomers] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:8080/customers").then(res=>res.json()).then(result=>setCustomers(result)).catch(e=>console.log(e));
  })

  return (
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
          console.log(newValue);
          console.log(customer);
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
      handleHomeEndKeys
      id="customer"
      name="customer"
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
        <TextField {...params} label="Customer" />
      )}
    />
  );
}