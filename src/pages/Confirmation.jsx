import { Link } from 'react-router-dom';
import { formatPrice } from '../data/plants';
export default function Confirmation({ order }) {
  if (!order) return <main className="feedback"><h1>No active order confirmation.</h1><p>Place a simulated order to see the summary.</p><Link className="primary-button" to="/shop">Shop plants ↗</Link></main>;
  return <main className="feedback" role="status"><h1>It's a little greener already! ✿</h1><p>Your simulated order <strong>{order.number}</strong> has been confirmed.</p><p>{order.count} plants · {order.city} · Total {formatPrice(order.total)}</p><p>No payment was taken or order sent to a real business.</p><Link className="primary-button" to="/shop">Keep exploring ↗</Link></main>;
}
