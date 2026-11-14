import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../data/plants';

export default function PlantDetails({ plants, loading, error, retry, onAdd }) {
  const { id } = useParams();
  if (loading) return <main className="feedback"><p role="status">Loading plant details…</p></main>;
  if (error) return <main className="feedback" role="alert"><h1>We couldn't load this plant.</h1><p>{error}</p><button className="primary-button" onClick={retry}>Retry</button></main>;
  const plant = plants.find(item => item.id === id);
  if (!plant) return <main className="feedback"><h1>This plant has wandered off.</h1><p>We couldn't find a plant at this address.</p><Link className="primary-button" to="/shop">Return to shop ↗</Link></main>;
  return <main className="section-wrap details-page"><Link className="back-link" to="/shop">← Back to all plants</Link>
    <div className="details-layout"><div className="details-image"><img src={plant.image} alt={`${plant.name} plant`} onError={e => { e.currentTarget.style.display = 'none'; }}/><span className="details-fallback" aria-hidden="true">✿</span></div>
      <div className="details-info"><span className="eyebrow">{plant.category.toUpperCase()} · LITTLE LEAF</span><h1>{plant.name}</h1><p className="details-price">{formatPrice(plant.price)}</p><p className="details-description">{plant.description}</p>
        <div className="spec-grid"><div><span>☀ Light</span><strong>{plant.light}</strong></div><div><span>◷ Water</span><strong>{plant.water}</strong></div><div><span>✿ Care</span><strong>{plant.care}</strong></div><div><span>↗ Size</span><strong>{plant.size}</strong></div><div><span>♡ Pet-friendly</span><strong>{plant.petSafe ? 'Yes' : 'No'}</strong></div><div><span>✳ Stock</span><strong>{plant.stock > 0 ? `${plant.stock} available` : 'Out of stock'}</strong></div></div>
        <div className="details-note"><strong>A little note from us</strong><p>Prices and stock shown are fictional demo data. All purchases and confirmations are simulated for this class project.</p></div>
        <button className="primary-button" disabled={!plant.stock} onClick={() => onAdd(plant.id, 1)}>{plant.stock ? "Add to basket +" : "Currently unavailable"}</button> <Link className="text-link" to="/cart">View basket ↗</Link>
      </div></div>
  </main>;
}
