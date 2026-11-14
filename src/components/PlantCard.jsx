import { Link } from 'react-router-dom';
import { formatPrice } from '../data/plants';

export default function PlantCard({ plant, onAdd }) {
  return <article className="plant-card">
    <Link to={`/plants/${plant.id}`} className="plant-photo" aria-label={`View ${plant.name}`}>
      <img src={plant.image} alt={`${plant.name} foliage`} loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} />
      <span className="photo-fallback" aria-hidden="true">✿</span>
      <span className="photo-tag">{plant.care === 'Easy' ? 'beginner friendly' : `${plant.care.toLowerCase()} care`}</span>
    </Link>
    <div className="plant-card-body">
      <div className="plant-meta">{plant.category} · {plant.size}</div>
      <div className="plant-heading"><h3>{plant.name}</h3><strong>{formatPrice(plant.price)}</strong></div>
      <p>{plant.light} light · {plant.water} watering</p>
      <div className="plant-card-footer"><span className={plant.stock ? 'stock-yes' : 'stock-no'}>{plant.stock ? `${plant.stock} in stock` : 'Currently unavailable'}</span><Link to={`/plants/${plant.id}`} className="text-link">See details ↗</Link></div>
      {onAdd && <button className="mini-add" disabled={!plant.stock} onClick={() => onAdd(plant.id, 1)}>{plant.stock ? "Add to basket +" : "Sold out"}</button>}
    </div>
  </article>;
}
