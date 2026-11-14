import { Link } from 'react-router-dom';
import { calculateSummary, validateQuantity } from '../utils/businessRules';
import { formatPrice } from '../data/plants';
export default function Cart({ cart, plants, updateItem, setPot, message }) {
  const present = cart.map(i => ({ ...i, plant: plants.find(p => p.id === i.id) })).filter(i => i.plant);
  const conflicts = present.filter(i => !validateQuantity(i.quantity, i.plant.stock).ok);
  const missing = cart.filter(i => !plants.some(p => p.id === i.id));
  const summary = calculateSummary(cart, plants, 'Islamabad', Object.fromEntries(cart.map(i => [i.id, i.pot])));
  return <main className="section-wrap basket-page"><span className="eyebrow">YOUR LITTLE GREEN BASKET</span><h1>A basket full of little joys <span aria-hidden="true">✿</span></h1><p className="basket-subtitle">Your new leafy friends are almost home. Pick their pots, adjust their numbers, and make it yours.</p>
    {message && <p className="inline-error" role="alert">{message}</p>}
    {cart.length === 0 ? <div className="feedback"><h2>Your basket is waiting for a little green.</h2><Link className="primary-button" to="/shop">Find plants ↗</Link></div> : <div className="basket-layout"><div>
      {missing.map(i => <div className="basket-item" key={i.id}><p>Saved item {i.id} is no longer available.</p><button onClick={() => updateItem(i.id, 0)}>Remove unavailable item</button></div>)}
      {present.map(({ id, quantity, pot, plant }) => { const valid = validateQuantity(quantity, plant.stock); return <article className="basket-item" key={id}>
        <div className="basket-image"><img src={plant.image} alt={plant.name} onError={e => { e.currentTarget.style.display = 'none'; }}/><span aria-hidden="true">✿</span></div><div className="basket-details"><span className="basket-kicker">A LITTLE GREEN FRIEND ♡</span><h2>{plant.name}</h2><p>{formatPrice(plant.price)} · {plant.size} · {plant.light} light</p>
        <label>Pot <select value={pot || 'standard'} onChange={e => setPot(id, e.target.value)}><option value="standard">Standard nursery pot (included)</option><option value="ceramic">Ceramic pot (+ Rs. 350)</option></select></label>
        <div className="quantity-row"><button aria-label={`Remove one ${plant.name}`} onClick={() => updateItem(id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`Add one ${plant.name}`} onClick={() => updateItem(id, quantity + 1)}>+</button><button className="link-button" onClick={() => updateItem(id, 0)}>Remove</button></div>
        {!valid.ok && <p className="inline-error">{valid.message}</p>}</div></article>; })}
      </div><aside className="order-panel"><span className="basket-kicker">MADE WITH A LITTLE LOVE</span><h2>Your little receipt ✿</h2><p>Items ({summary.count}) <strong>{formatPrice(summary.subtotal)}</strong></p><p>Delivery <strong>Calculated at checkout</strong></p><p className="order-note">✿ A pretend order for your real plant dreams. No payment is taken.</p>
      {conflicts.length || missing.length ? <p className="inline-error">Please resolve unavailable items before checkout.</p> : <Link className="primary-button" to="/checkout">Continue to checkout ↗</Link>}</aside></div>}
  </main>;
}
