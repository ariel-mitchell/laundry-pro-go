import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './App.css';
import OrderForm from './components/OrderForm';
import ButtonAppBar from './components/Appbar';
import Footer from './components/Footer';
import DisplayOrder from './components/DisplayOrder'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
      <ButtonAppBar/>
      <OrderForm />
      <DisplayOrder />
      <Footer/>

     </div>
    </LocalizationProvider>

  );
}

export default App;
