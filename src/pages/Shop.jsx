import { useMemo, useState } from 'react';
import { categories } from '../data/plants';
import PlantCard from '../components/PlantCard';

export default function Shop({ plants, loading, error, retry, emptyDemo, setEmptyDemo, failDemo, setFailDemo, onAdd }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All plants');
  const [light, setLight] = useState('Any light');
  const [care, setCare] = useState('Any care');
  const [size, setSize] = useState('Any size');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('featured');

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = plants.filter(plant => {
      return (!query || `${plant.name} ${plant.category} ${plant.description} ${plant.light} ${plant.care}`.toLowerCase().includes(query))
        && (category === 'All plants' || plant.category === category)
        && (light === 'Any light' || plant.light === light)
        && (care === 'Any care' || plant.care === care)
        && (size === 'Any size' || plant.size === size)
        && (maxPrice === '' || plant.price <= Number(maxPrice));
    });
    return [...filtered].sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : 0);
  }, [plants, search, category, light, care, size, maxPrice, sort]);
  const clear = () => { setSearch(''); setCategory('All plants'); setLight('Any light'); setCare('Any care'); setSize('Any size'); setMaxPrice(''); setSort('featured'); };

  return <main className="section-wrap shop-page">
    <div className="shop-intro"><span className="eyebrow">THE LITTLE LEAF GREENHOUSE</span><h1>Plants with personality<span className="pink-star">✳</span></h1><p>Find something leafy that feels right at home.</p></div>
    <div className="shop-layout">
      <aside className="filters" aria-label="Plant filters">
        <div className="filter-head"><h2>Find your plant</h2><button className="link-button" onClick={clear}>Clear all</button></div>
        <label htmlFor="search">Search plants</label><input id="search" placeholder="Try 'pothos' or 'low'…" value={search} onChange={e => setSearch(e.target.value)}/>
        <label htmlFor="category">Category</label><select id="category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="light">Sunlight</label><select id="light" value={light} onChange={e => setLight(e.target.value)}>{['Any light', 'Low', 'Indirect', 'Bright'].map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="care">Care difficulty</label><select id="care" value={care} onChange={e => setCare(e.target.value)}>{['Any care', 'Easy', 'Moderate', 'Advanced'].map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="size">Plant size</label><select id="size" value={size} onChange={e => setSize(e.target.value)}>{['Any size', 'Small', 'Medium', 'Large'].map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="maxPrice">Maximum price (Rs.)</label><input id="maxPrice" type="number" inputMode="numeric" min="0" step="100" placeholder="Any price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
        <details className="demo-tools"><summary>Demo: loading and availability states</summary><label className="checkbox-label"><input type="checkbox" checked={failDemo} onChange={e => setFailDemo(e.target.checked)} /> Simulate loading failure</label><label className="checkbox-label"><input type="checkbox" checked={emptyDemo} onChange={e => setEmptyDemo(e.target.checked)} /> Simulate empty catalogue</label></details>
      </aside>
      <div>
        <div className="results-bar"><span aria-live="polite">{loading ? 'Finding plants…' : error ? 'Could not load plants' : `${matches.length} happy little ${matches.length === 1 ? 'plant' : 'plants'}`}</span><label className="sort-label" htmlFor="sort">Sort by <select id="sort" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
        {loading ? <div className="feedback" role="status">✿ Finding the perfect leaves for you…</div>
          : error ? <div className="feedback" role="alert"><h2>Our greenhouse needs a moment.</h2><p>{error}</p><button className="primary-button" onClick={retry}>Try again ↻</button>{failDemo && <p>Turn off “Simulate loading failure” to recover.</p>}</div>
          : plants.length === 0 ? <div className="feedback"><h2>The greenhouse is empty.</h2><p>No plant records are currently available. Turn off the empty-catalogue demo to restore them.</p></div>
          : matches.length === 0 ? <div className="feedback"><h2>No plants found for your filters.</h2><p>{search ? `We couldn't find “${search}”. Check the spelling, try a shorter word, or broaden your filters.` : 'Try another category, price, or sunlight level.'}</p><button className="primary-button" onClick={clear}>Clear filters and show all ↗</button></div>
          : <div className="product-grid shop-grid">{matches.map(plant => <PlantCard key={plant.id} plant={plant} onAdd={onAdd}/>)}</div>}
      </div>
    </div>
  </main>;
}
