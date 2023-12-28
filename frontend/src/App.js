import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import './App.css';
import AppBar from './components/Appbar';
import Footer from './components/Footer';
const NoMatch = lazy(() => import('./components/NoMatch'));
const Home = lazy(() => import('./pages/Home'));
const Orders = lazy(() => import('./pages/Orders'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Blacklist = lazy(() => import('./pages/Blacklist'));
const Calendar = lazy(() => import('./pages/Calendar'));

function App() {
  return (
    <div className="App">
      <AppBar/>
      <Suspense fallback={<div className="loadingContainer">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/blacklist" element={<Blacklist />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Suspense>
      <Footer/>
     </div>
  );
}

export default App;
