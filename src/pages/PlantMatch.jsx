import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/plants';

const initial = { light: 'Any', care: 'Any', size: 'Any', pets: false };
const choices = [
  { key: 'light', label: 'How much sunlight does your corner get?', options: [['Any', 'Surprise me'], ['Low', 'Cozy + shady'], ['Indirect', 'Soft filtered light'], ['Bright', 'Bright + sunny']] },
  { key: 'care', label: 'What kind of plant parent are you?', options: [['Any', 'A little of everything'], ['Easy', 'Keep it easy'], ['Moderate', 'I like a routine'], ['Advanced', 'I love a challenge']] },
  { key: 'size', label: 'How much room can your new friend have?', options: [['Any', 'Anywhere'], ['Small', 'A tiny shelf'], ['Medium', 'A pretty corner'], ['Large', 'A big statement']] },
];

export default function PlantMatch({ plants, onAdd }) {
  const [answers, setAnswers] = useState(initial);
  const [showResults, setShowResults] = useState(false);
  const [added, setAdded] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);
  const available = plants.filter(plant => plant.stock > 0);
  const matches = useMemo(() => available.filter(plant =>
    (answers.light === 'Any' || plant.light === answers.light) &&
    (answers.care === 'Any' || plant.care === answers.care) &&
    (answers.size === 'Any' || plant.size === answers.size) &&
    (!answers.pets || plant.petSafe)
  ).sort((a, b) => (a.care === 'Easy' ? -1 : 0) - (b.care === 'Easy' ? -1 : 0) || a.price - b.price), [available, answers]);
  const change = (key, value) => { setAnswers(previous => ({ ...previous, [key]: value })); setShowResults(false); setAdded(''); setVisibleCount(4); };
  return <main className="match-page">
    <section className="match-hero"><div className="match-stars" aria-hidden="true">✳ &nbsp; ✿ &nbsp; ✧</div><span className="eyebrow">THE LITTLE LEAF MATCHMAKER</span><h1>Meet your <em>leafy soulmate.</em></h1><p>A little quiz for a little green magic. Find a plant that feels right at home, with no guesswork or green-thumb pressure.</p><div className="match-sprig" aria-hidden="true">❀</div></section>
    <div className="match-inner"><section className="match-form" aria-label="Plant matching preferences">
      <div className="match-form-head"><div><span className="eyebrow">A LOVE NOTE TO YOUR SPACE</span><h2>Tell us about your corner ♡</h2></div><button className="link-button" type="button" onClick={() => { setAnswers(initial); setShowResults(false); setAdded(''); setVisibleCount(4); }}>Start over</button></div>
      {choices.map((group, index) => <fieldset className="match-question" key={group.key}><legend><span className="match-number">0{index + 1}</span> {group.label}</legend><div className="match-options">{group.options.map(([value, label]) => <label key={value} className={`match-option ${answers[group.key] === value ? 'selected' : ''}`}><input type="radio" name={group.key} value={value} checked={answers[group.key] === value} onChange={() => change(group.key, value)}/><span>{label}</span></label>)}</div></fieldset>)}
      <label className="match-pet"><input type="checkbox" checked={answers.pets} onChange={e => change('pets', e.target.checked)}/><span><strong>Little paws live here 🐾</strong><small>Show only plants marked pet-safe in our catalogue.</small></span></label>
      <button className="primary-button match-submit" type="button" onClick={() => { setVisibleCount(4); setShowResults(true); }}>Find my plant match ✿</button>
    </section>
    {showResults && <section className="match-results" aria-live="polite"><span className="eyebrow">YOUR GREEN CONNECTION</span><h2>{matches.length ? `We found ${matches.length} leafy ${matches.length === 1 ? 'friend' : 'friends'}!` : 'No match this time — and that’s okay.'}</h2><p>{matches.length ? `Showing ${Math.min(visibleCount, matches.length)} of ${matches.length} available matches. Choose one to view its details or add it to your basket.` : 'Try changing the sunlight, care, or size preference. A different combination may give your new plant a happy home.'}</p>{matches.length ? <div className="match-result-grid">{matches.slice(0, visibleCount).map(plant => <article className="match-result-card" key={plant.id}><img
  className="match-plant-image"
  src={plant.image}
  alt={plant.name}
/><div><span className="eyebrow">{plant.light} light · {plant.care.toLowerCase()} care</span><h3>{plant.name}</h3><p>{plant.description}</p><strong>{formatPrice(plant.price)}</strong><div className="match-actions"><Link to={`/plants/${plant.id}`} className="text-link">Plant details ↗</Link><button type="button" onClick={() => { onAdd(plant.id); setAdded(plant.name); }}>Add to basket +</button></div></div></article>)}</div> : <button type="button" className="match-retry" onClick={() => { setAnswers(initial); setShowResults(false); }}>Try another combination ↗</button>}{matches.length > visibleCount && <button type="button" className="match-retry match-more" onClick={() => setVisibleCount(count => Math.min(count + 4, matches.length))}>Show {Math.min(4, matches.length - visibleCount)} more leafy friends ↓</button>}{added && <p className="match-added" role="status">✿ {added} added! <Link to="/cart">Peek at your basket ↗</Link></p>}</section>}
    </div><div className="match-bottom" aria-hidden="true">✿ &nbsp; growing good things &nbsp; ✿ &nbsp; growing good things &nbsp; ✿</div>
  </main>;
}
