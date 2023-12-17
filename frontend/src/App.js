
import './App.css';
import OrderForm from './components/OrderForm';
import ButtonAppBar from './components/Appbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <ButtonAppBar/>
      <OrderForm />
      <Footer/>

    </div>
  );
}

export default App;
