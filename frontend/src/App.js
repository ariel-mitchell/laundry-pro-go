
import './App.css';
import OrderForm from './components/OrderForm';
import ButtonAppBar from './components/Appbar';
import Footer from './components/Footer';
import DisplayOrder from './components/DisplayOrder'

function App() {
  return (
    <div className="App">
      <ButtonAppBar/>
      <OrderForm />
      <DisplayOrder />
      <Footer/>

    </div>
  );
}

export default App;
