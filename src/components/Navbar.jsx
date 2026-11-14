import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ count = 0 }) {
  return <>
    <div className="announcement">A little green, delivered with love <span aria-hidden="true">✿</span> Islamabad & Rawalpindi</div>
    <header className="header">
      <Link className="logo" to="/" aria-label="Little Leaf home"><span className="logo-mark">✿</span> little leaf<span className="logo-period">.</span></Link>
      <nav aria-label="Main navigation">
        <NavLink end to="/">Home</NavLink>
        <NavLink to="/shop">Shop plants</NavLink>
        <NavLink to="/match">Plant match ✿</NavLink>
      </nav>
      <Link className="bag-link" to="/cart" aria-label={`Shopping basket, ${count} plants`}>Basket ({count}) <span aria-hidden="true">↗</span></Link>
    </header>
  </>;
}
