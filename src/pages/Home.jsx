import { Link } from 'react-router-dom';
import PlantCard from '../components/PlantCard';

export default function Home({ plants, onAdd }) {
  return <>
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow">YOUR HAPPY PLACE FOR HOUSEPLANTS ✿</span>
        <h1>Make room for<br/><em>a little</em> green.</h1>
        <p>Thoughtfully picked plants for cozy corners, sunny windows, and every kind of plant parent.</p>
        <Link className="primary-button" to="/shop">Explore the greenhouse <span aria-hidden="true">↗</span></Link>
        <div className="hero-footnote">✳ Easy-care picks &nbsp; ✳ Clear plant details &nbsp; ✳ Local delivery</div>
      </div>
      <div className="hero-art" aria-label="Decorative plant photograph">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85" alt="A bright and lush green plant collection" />
        <div className="floating-note">good things<br/>take thyme <span>♡</span></div>
      </div>
    </section>
    <section className="intro-strip"><span>✿</span> A calmer way to find plants that fit your home <span>✿</span></section>
    <section className="section-wrap" aria-labelledby="favorites-title">
      <div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2 id="favorites-title">Little green favorites</h2></div><Link className="text-link" to="/shop">Shop all plants ↗</Link></div>
      <div className="product-grid">{plants.slice(0, 4).map(plant => <PlantCard key={plant.id} plant={plant} onAdd={onAdd}/>)}</div>
    </section>
    <section className="match-teaser"><div className="teaser-emblem" aria-hidden="true">✿</div><div><span className="eyebrow">A LITTLE BOTANICAL MAGIC</span><h2>Every plant has a person.<br/><em>Find yours.</em></h2><p>A tiny quiz for your light, space, and plant-parent personality.</p></div><Link className="primary-button" to="/match">Take the plant match quiz ↗</Link></section>
    <section className="story-banner"><div><span className="eyebrow">ROOTED IN SOMETHING GOOD</span><h2>Find the right plant,<br/><em>not just any plant.</em></h2><p>Search by sunlight, care level, size, or budget. Every little leaf deserves the right home.</p><Link className="primary-button" to="/shop">Find your match ↗</Link></div><div className="story-flower" aria-hidden="true">✿</div></section>
  </>;
}
