import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import PlantDetails from './pages/PlantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import PlantMatch from './pages/PlantMatch';
import { validateQuantity } from './utils/businessRules';
import { loadPlants } from './utils/mockLoader';
import { applyStockChanges, recordPurchase, readSavedInventory } from './utils/inventory';
import './App.css';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [cart, setCart] = useState(() => {
    try { const value = JSON.parse(localStorage.getItem('littleLeafCart') || '[]'); return Array.isArray(value) ? value : []; }
    catch { return []; }
  });
  const [order, setOrder] = useState(null);
  const [soldCounts, setSoldCounts] = useState(readSavedInventory);
  const [availabilityDemo, setAvailabilityDemo] = useState(false);
  const currentPlants = applyStockChanges(plants, soldCounts).map(plant => {
    // Demonstrate a stock change AFTER a customer has selected an item.
    const affected = availabilityDemo && cart[0]?.id === plant.id;
    return affected ? { ...plant, stock: Math.min(plant.stock, Math.max(0, cart[0].quantity - 1)) } : plant;
  });
  const resetInventory = () => {
    setSoldCounts({});
    setAvailabilityDemo(false);
    setCartMessage('Original demo inventory restored.');
  };
  const [cartMessage, setCartMessage] = useState('');
  useEffect(() => { localStorage.setItem('littleLeafCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('littleLeafInventorySold-v1', JSON.stringify(soldCounts)); }, [soldCounts]);
  const updateItem = (id, quantity) => {
    if (quantity <= 0) { setCart(old => old.filter(item => item.id !== id)); setCartMessage(''); return; }
    const plant = currentPlants.find(item => item.id === id);
    if (!plant) return;
    const valid = validateQuantity(quantity, plant.stock);
    const previous = cart.find(item => item.id === id);
    // Permit stepwise reduction of a stale saved basket even if it is still above stock.
    if (!valid.ok && !(previous && quantity < previous.quantity)) {
      setCartMessage(valid.message);
      return;
    }
    setCartMessage('');
    setCart(old => old.some(item => item.id === id) ? old.map(item => item.id === id ? { ...item, quantity } : item) : [...old, { id, quantity, pot: 'standard' }]);
  };
  const addItem = (id, count = 1) => {
    const existing = cart.find(item => item.id === id);
    updateItem(id, (existing?.quantity || 0) + count);
  };
  const setPot = (id, pot) => setCart(old => old.map(item => item.id === id ? { ...item, pot } : item));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [failDemo, setFailDemo] = useState(false);
  const [emptyDemo, setEmptyDemo] = useState(false);
  const [reload, setReload] = useState(0);
  const retry = useCallback(() => setReload(value => value + 1), []);

  useEffect(() => {
    let active = true;
    const getPlants = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await loadPlants({ fail: failDemo, empty: emptyDemo });
        if (active) setPlants(result);
      } catch (err) {
        if (active) { setPlants([]); setError(err.message); }
      } finally {
        if (active) setLoading(false);
      }
    };
    getPlants();
    return () => { active = false; };
  }, [failDemo, emptyDemo, reload]);

  return <BrowserRouter>
    <Navbar count={cart.reduce((sum, item) => sum + item.quantity, 0)} />
    <Routes>
      <Route path="/" element={<Home plants={currentPlants} onAdd={addItem} />} />
      <Route path="/match" element={<PlantMatch plants={currentPlants} onAdd={addItem} />} />
      <Route path="/shop" element={<Shop plants={currentPlants} onAdd={addItem} loading={loading} error={error} retry={retry} failDemo={failDemo} setFailDemo={setFailDemo} emptyDemo={emptyDemo} setEmptyDemo={setEmptyDemo} availabilityDemo={availabilityDemo} setAvailabilityDemo={setAvailabilityDemo} resetInventory={resetInventory}/>} />
      <Route path="/plants/:id" element={<PlantDetails plants={currentPlants} onAdd={addItem} loading={loading} error={error} retry={retry}/>} />
      <Route path="/cart" element={<Cart cart={cart} plants={currentPlants} updateItem={updateItem} setPot={setPot} message={cartMessage}/>} />
      <Route path="/checkout" element={<Checkout cart={cart} plants={currentPlants} onComplete={result => {
        setSoldCounts(previous => recordPurchase(previous, cart, plants));
        setOrder(result);
        setCart([]);
        setCartMessage('');
      }} />} />
      <Route path="/confirmation" element={<Confirmation order={order} />} />
      <Route path="*" element={<main className="feedback"><h1>Oops, nothing grows here.</h1><p>This page doesn't exist.</p><Link className="primary-button" to="/">Go home ↗</Link></main>} />
    </Routes>
    <footer className="footer"><div><div className="footer-logo">✿ little leaf.</div><p>Growing cozy corners, one plant at a time.</p></div><div><strong>Made for little spaces & big plant dreams</strong><p>Islamabad & Rawalpindi · Demo plant boutique</p></div></footer>
  </BrowserRouter>;
}
