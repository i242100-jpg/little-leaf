import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateSummary, checkPetCompatibility, getDeliveryFee, validateQuantity } from '../utils/businessRules';
import { formatPrice } from '../data/plants';
export default function Checkout({ cart, plants, onComplete }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: 'Islamabad', address: '', hasPets: false });
  const [errors, setErrors] = useState({});
  const update = (field, value) => setForm(old => ({ ...old, [field]: value }));
  const pots = useMemo(() => Object.fromEntries(cart.map(item => [item.id, item.pot])), [cart]);
  const summary = calculateSummary(cart, plants, form.city, pots);
  const petRule = checkPetCompatibility(cart, plants, form.hasPets);
  const stockIssues = cart.filter(item => { const plant = plants.find(p => p.id === item.id); return !plant || !validateQuantity(item.quantity, plant.stock).ok; });
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter at least 2 characters.';
    if (!/^03\d{9}$/.test(form.phone.trim())) next.phone = 'Use an 11-digit Pakistan mobile number starting with 03.';
    if (form.address.trim().length < 10) next.address = 'Enter at least 10 characters for the delivery address.';
    if (getDeliveryFee(form.city) === null) next.city = 'Delivery is available only in Islamabad and Rawalpindi.';
    if (stockIssues.length) next.stock = 'One or more plants are no longer available in the selected quantity.';
    if (!petRule.ok) next.pet = petRule.message;
    if (!cart.length) next.stock = 'Your basket is empty.';
    setErrors(next);
    if (Object.keys(next).length) return;
    onComplete({ number: `LL-${Date.now().toString().slice(-6)}`, count: summary.count, total: summary.total, city: form.city });
    navigate('/confirmation');
  }
  if (!cart.length) return <main className="feedback"><h1>There's nothing to check out.</h1><Link className="primary-button" to="/shop">Shop plants ↗</Link></main>;
  return <main className="section-wrap basket-page"><span className="eyebrow">ALMOST THERE</span><h1>Checkout your little greens</h1><div className="basket-layout"><form className="checkout-form" onSubmit={submit} noValidate>
    <label htmlFor="fullName">Full name</label><input id="fullName" value={form.name} onChange={e => update('name', e.target.value)} aria-invalid={!!errors.name}/>{errors.name && <p className="inline-error">{errors.name}</p>}
    <label htmlFor="phone">Mobile number</label><input id="phone" placeholder="03XXXXXXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} aria-invalid={!!errors.phone}/>{errors.phone && <p className="inline-error">{errors.phone}</p>}
    <label htmlFor="city">Delivery city</label><select id="city" value={form.city} onChange={e => update('city', e.target.value)}><option>Islamabad</option><option>Rawalpindi</option></select>{errors.city && <p className="inline-error">{errors.city}</p>}
    <label htmlFor="address">Delivery address</label><textarea id="address" rows="4" value={form.address} onChange={e => update('address', e.target.value)} aria-invalid={!!errors.address}/>{errors.address && <p className="inline-error">{errors.address}</p>}
    <label className="checkbox-row"><input type="checkbox" checked={form.hasPets} onChange={e => update('hasPets', e.target.checked)}/> I have pets at home (check plant suitability)</label>
    {!petRule.ok && <p className="inline-error" role="alert">{petRule.message}</p>}{errors.stock && <p className="inline-error" role="alert">{errors.stock}</p>}
    <p className="simulation-note"><span aria-hidden="true">✿</span> A little practice order — no real payment or delivery. Please use fictional details.</p>
    <button className="primary-button" type="submit">Confirm simulated order ↗</button>
  </form><aside className="order-panel"><h2>Review your order</h2>{cart.map(item => {const p = plants.find(plant => plant.id === item.id); return p && <p key={item.id}>{p.name} × {item.quantity}<strong>{formatPrice((p.price + (item.pot === 'ceramic' ? 350 : 0)) * item.quantity)}</strong></p>;})}
    <hr/><p>Subtotal <strong>{formatPrice(summary.subtotal)}</strong></p><p>Delivery ({form.city}) <strong>{formatPrice(summary.delivery)}</strong></p><p className="order-total">Total <strong>{formatPrice(summary.total)}</strong></p>
    <p className="order-note">Rules: max 6 per plant, stock availability, pet suitability, delivery to Islamabad / Rawalpindi only.</p></aside></div></main>;
}
