import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingBag, Menu, ArrowRight, ArrowDown, Heart, X, Plus, Minus, Pause, Play, Gem } from 'lucide-react';
import './styles.css';

const products = [
  { id: 'cartier-love', brand: 'Cartier', name: 'LOVE bracelet', detail: 'Classic model · 18k yellow gold', price: null, image: 'cartier-love.png', category: 'Fine jewelry', source: 'https://www.cartier.com/en-us/jewelry/bracelets/love-bracelet-B6067517.html' },
  { id: 'rolex-datejust', brand: 'Rolex', name: 'Datejust 41', detail: 'Oystersteel & white gold · Bright blue dial', price: null, image: 'rolex-datejust.png', category: 'Watches', source: 'https://www.rolex.com/watches/datejust/m126334-0002' },
  { id: 'ap-royal-oak', brand: 'Audemars Piguet', name: 'Royal Oak Selfwinding', detail: '41 mm · Stainless steel · Blue dial', price: null, image: 'ap-royal-oak.png', category: 'Watches', source: 'https://www.audemarspiguet.com/en/watch-collection/royal-oak/15510ST.OO.1320ST.06' },
  { id: 'patek-nautilus', brand: 'Patek Philippe', name: 'Nautilus', detail: '5811/1G-001 · White gold', price: null, image: 'patek-nautilus-white.png', category: 'Watches', source: 'https://www.patek.com/en/collection/nautilus/5811-1g-001' },
];
const categories = [
  { name: 'Diamonds', caption: 'A brilliant beginning', image: 'diamond-editorial-v2.png' },
  { name: 'Fine jewelry', caption: 'The extraordinary, everyday', image: 'high-jewelry-yellow-v3.png' },
  { name: 'Watches', caption: 'An appreciation of time', image: 'category-watch.jpeg' },
];
const money = value => value == null ? 'Discover the piece' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
function readSaved(key, fallback) {
  try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data.filter(id => products.some(p => p.id === id)) : fallback; } catch { return fallback; }
}
function Logo() {
  return <a className="logo" href="#top" aria-label="Express Diamonds home"><span>EXPRESS</span><small>DIAMONDS</small></a>;
}
function Photo({ image, alt, className = '', eager = false }) {
  return <img className={className} src={`/images/${image}`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}
function Modal({ title, children, close, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`dialog ${wide ? 'dialog-wide' : ''}`} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby="dialog-title"><div className="dialog-inner"><div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={close} aria-label="Close dialog"><X /></button></div>{children}</div></dialog>;
}
function Hero() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { if (preference.matches) video.current?.pause(); else video.current?.play().catch(() => {}); };
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <section className="hero" aria-labelledby="hero-title">
    <video ref={video} muted loop playsInline poster="/images/hero-ring.jpg" preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true"><source src="/videos/hwinston-hero.mp4" type="video/mp4" /></video>
    <div className="hero-shade" />
    <div className="hero-copy"><p className="eyebrow">THE EXPRESSION OF SOMETHING RARE</p><h1 id="hero-title">Some things<br />are <em>forever.</em></h1><p>Diamonds, fine jewelry, and timepieces.<br />For the moments that become your story.</p><a className="button button-white" href="#collections">Discover the collections <ArrowRight size={16} /></a></div>
    <div className="hero-bottom"><a href="#collections" className="scroll-link"><ArrowDown size={15} /> A world of possibility</a><span>EXPRESS DIAMONDS · THE COLLECTION</span><button className="film-control" onClick={() => playing ? video.current.pause() : video.current.play().catch(() => {})} aria-label={playing ? 'Pause background film' : 'Play background film'}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></div>
  </section>;
}
function EditorialFilm() {
  const video = useRef(null);
  const section = useRef(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !preference.matches && !manuallyPaused.current) video.current?.play().catch(() => {});
      else video.current?.pause();
    }, { threshold: 0.2 });
    observer.observe(section.current);
    const stopForMotion = () => { if (preference.matches) video.current?.pause(); };
    preference.addEventListener('change', stopForMotion);
    return () => { observer.disconnect(); preference.removeEventListener('change', stopForMotion); };
  }, []);
  return <section ref={section} className="editorial-film" id="editorial-film" aria-labelledby="film-title">
    <video ref={video} muted loop playsInline preload="none" poster="/images/campaign-jewelry.jpg" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}><source src="/videos/hwinston-editorial.mp4" type="video/mp4" /></video>
    <div className="editorial-film-shade" />
    <div className="editorial-film-copy"><p className="eyebrow">THE ART OF BECOMING</p><h2 id="film-title">Made for<br /><em>the moment.</em></h2><a className="text-link" href="#custom">Discover the extraordinary <ArrowRight size={17} /></a></div>
    <div className="editorial-film-bottom"><span>A STUDY IN BRILLIANCE</span><button className="film-control" aria-label={playing ? 'Pause editorial film' : 'Play editorial film'} onClick={() => { manuallyPaused.current = playing; if (playing) video.current.pause(); else video.current.play().catch(() => {}); }}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></div>
  </section>;
}
function ProductCard({ product, saved, toggle, open }) {
  return <article className={`product-card product-${product.id}`}><div className="product-image"><button className="image-button" onClick={() => open(product)} aria-label={`View ${product.name}`}><Photo image={product.image} alt={product.name} /><span className="view-piece">Discover the piece <ArrowRight size={15} /></span></button><button className={`save-button ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={saved} onClick={() => toggle(product.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><p className="product-brand">{product.brand}</p><button className="product-title" onClick={() => open(product)}>{product.name}</button><p>{product.detail}</p><button className="piece-details" onClick={() => open(product)}>Explore the details <ArrowRight size={13} /></button></article>;
}
function App() {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All pieces');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(() => readSaved('ed-saved', []));
  const [bag, setBag] = useState(() => readSaved('ed-bag', []));
  const [notice, setNotice] = useState('');
  useEffect(() => { try { localStorage.setItem('ed-saved', JSON.stringify(saved)); localStorage.setItem('ed-bag', JSON.stringify(bag)); } catch {} }, [saved, bag]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { const escape = e => { if (e.key === 'Escape') setMenu(false); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  const toggle = id => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const open = product => { setSelected(product); setPanel('product'); };
  const browse = category => { setFilter(category); setMenu(false); };
  const close = () => setPanel(null);
  const filtered = products.filter(p => filter === 'All pieces' || p.category === filter || p.brand === filter);
  const searchResults = products.filter(p => `${p.brand} ${p.name} ${p.detail} ${p.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div id="top">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement">A little brilliance. A lifetime of meaning.</div>
    <header className="site-header"><div className="masthead"><div className="masthead-left"><button className="icon-button mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button><button className="service-link" onClick={() => setPanel('bespoke')}>The bespoke experience</button></div><Logo /><div className="header-actions"><button className="icon-button" aria-label="Search collection" onClick={() => setPanel('search')}><Search /></button><button className="icon-button wishlist-link" aria-label={`Saved pieces, ${saved.length}`} onClick={() => setPanel('saved')}><Heart /></button><button className="icon-button bag-button" aria-label={`Shopping bag, ${bag.length} items`} onClick={() => setPanel('bag')}><ShoppingBag />{bag.length > 0 && <span>{bag.length}</span>}</button></div></div>
    <nav id="navigation" className={menu ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{['Diamonds', 'Fine jewelry', 'Watches'].map(name => <a key={name} href="#pieces" onClick={() => browse(name)}>{name}</a>)}<button onClick={() => { setMenu(false); setPanel('bespoke'); }}>Bespoke</button><a href="#philosophy" onClick={() => setMenu(false)}>Our philosophy</a></nav></header>
    <main id="main"><Hero />
      <section className="collections section" id="collections"><div className="section-intro"><p className="eyebrow">THE WORLD OF EXPRESS DIAMONDS</p><h2>Extraordinary, by nature.<br /><em>Personal, by choice.</em></h2><p>For a promise. For a milestone. Or simply, for you.<br className="desktop-break" /> Discover the pieces that say it all.</p></div><div className="category-grid">{categories.map((category, i) => <a key={category.name} className="category-card" href="#pieces" onClick={() => browse(category.name)}><div className="category-image"><Photo image={category.image} alt={category.name === 'Diamonds' ? 'A brilliant-cut diamond in reflected light' : category.name === 'Watches' ? 'Close detail of a luxury wristwatch' : 'Yellow and white diamond high-jewelry necklace'} /><span className="category-number">0{i + 1}</span></div><div className="category-caption"><div><h3>{category.name}</h3><p>{category.caption}</p></div><ArrowRight size={20} /></div></a>)}</div></section>
      <EditorialFilm />
      <section className="timepiece-editorial" id="custom" aria-labelledby="timepiece-title">
        <div className="timepiece-copy"><p className="eyebrow">PATEK PHILIPPE</p><h2 id="timepiece-title">A different<br /><em>measure of time.</em></h2><p className="timepiece-description">The Nautilus. An unmistakable silhouette.<br />A study in balance, proportion, and detail.</p><a className="text-link" href="https://www.patek.com/en/collection/nautilus/5811-1g-001" target="_blank" rel="noreferrer">Discover the Nautilus <ArrowRight size={16} /></a><span className="timepiece-reference">5811/1G-001 · WHITE GOLD</span></div>
        <div className="timepiece-image"><Photo image="patek-nautilus-white.png" alt="Patek Philippe Nautilus 5811/1G-001 in white gold with a blue dial" /></div>
      </section>
      <section className="pieces section" id="pieces"><div className="section-heading"><div><p className="eyebrow">THE CONSIDERED EDIT</p><h2>Icons, <em>by design.</em></h2></div><p>Exceptional names. Unmistakable design.</p></div><div className="filters" role="group" aria-label="Filter pieces">{['All pieces', 'Cartier', 'Rolex', 'Audemars Piguet', 'Patek Philippe'].map(name => <button key={name} className={filter === name ? 'active' : ''} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name}</button>)}</div><div className="product-grid">{filtered.length === 0 && <p className="empty-collection">Explore the diamond collection above, or select a house to discover the current edit.</p>}{filtered.map(product => <ProductCard key={product.id} product={product} saved={saved.includes(product.id)} toggle={toggle} open={open} />)}</div><p className="collection-note">A curated selection of iconic designs.</p></section>
      <section className="philosophy" id="philosophy"><div className="philosophy-copy"><Gem size={30} strokeWidth={1} /><p className="eyebrow">THE EXPRESS DIAMONDS PHILOSOPHY</p><h2>Jewelry is never<br /><em>just jewelry.</em></h2><p>It is a quiet expression of who you are. A reminder of where you have been. A promise of everything still to come.</p><a className="text-link" href="#collections">Find your expression <ArrowRight size={17} /></a></div><div className="philosophy-image"><Photo image="product-ring.jpg" alt="A halo diamond ring nestled in a velvet jewelry box" /></div></section>
      <section className="closing"><p className="eyebrow">A NEW CHAPTER STARTS HERE</p><h2>Make it <em>meaningful.</em></h2><a className="button button-dark" href="#pieces" onClick={() => browse('All pieces')}>Explore the collection <ArrowRight size={16} /></a></section>
    </main>
    <footer><div className="footer-top"><div><Logo /><p>For all that matters.</p></div><div className="footer-links"><span>EXPLORE</span><a href="#pieces" onClick={() => browse('Diamonds')}>Diamonds</a><a href="#pieces" onClick={() => browse('Fine jewelry')}>Fine jewelry</a><a href="#pieces" onClick={() => browse('Watches')}>Watches</a></div><div className="footer-links"><span>EXPRESS DIAMONDS</span><button onClick={() => setPanel('bespoke')}>Bespoke design</button><a href="#philosophy">Our philosophy</a><button onClick={() => setPanel('saved')}>Your saved pieces</button></div><a className="back-top" href="#top">Back to top <ArrowRight size={16} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Express Diamonds</span><span>Beautifully considered. Made to mean more.</span></div></footer>
    <div className={`toast ${notice ? 'visible' : ''}`} role="status">{notice}</div>
    {panel && <Modal key={panel} title={panel === 'search' ? 'Find your piece' : panel === 'bag' ? 'Your bag' : panel === 'saved' ? 'Your saved pieces' : panel === 'bespoke' ? 'A design of your own' : selected.name} close={close} wide={panel === 'product'}>
      {panel === 'search' && <><label className="search-label" htmlFor="search">Search by piece, material, or collection</label><input id="search" className="search-input" type="search" placeholder="Try diamonds, gold, or watches" value={query} onChange={e => setQuery(e.target.value)} autoFocus /><p className="result-count" aria-live="polite">{searchResults.length} pieces</p><div className="result-list">{searchResults.map(p => <button key={p.id} className="result" onClick={() => open(p)}><Photo image={p.image} alt="" /><span>{p.name}<small>{p.detail}</small></span><ArrowRight size={16} /></button>)}{!searchResults.length && <p>No pieces match your search. Try “gold” or “ring”.</p>}</div></>}
      {panel === 'saved' && <div className="result-list">{!saved.length && <p>Save a piece using its heart icon. Your favorites will be waiting here.</p>}{products.filter(p => saved.includes(p.id)).map(p => <div className="result" key={p.id}><Photo image={p.image} alt="" /><button className="result-name" onClick={() => open(p)}>{p.name}<small>{money(p.price)}</small></button><button className="icon-button" aria-label={`Remove ${p.name} from saved pieces`} onClick={() => toggle(p.id)}><X size={16} /></button></div>)}</div>}
      {panel === 'product' && <div className="product-detail"><Photo image={selected.image} alt={selected.name} /><div><p className="eyebrow">{selected.brand}</p><p className="detail-description">{selected.detail}</p><p className="muted">An iconic design selected for the Express Diamonds edit. Explore the full specifications on the official house website.</p><a className="button button-dark" href={selected.source} target="_blank" rel="noreferrer">Discover at {selected.brand} <ArrowRight size={16} /></a><button className="text-link" aria-pressed={saved.includes(selected.id)} onClick={() => toggle(selected.id)}>{saved.includes(selected.id) ? 'Saved to your pieces' : 'Save for a little later'} <Heart size={16} /></button></div></div>}
      {panel === 'bag' && <>{!bag.length ? <div className="empty-bag"><ShoppingBag size={35} strokeWidth={1} /><p>Your next meaningful piece is waiting to be discovered.</p><button className="button button-dark" onClick={() => { close(); document.getElementById('pieces').scrollIntoView(); }}>Explore the pieces <ArrowRight size={16} /></button></div> : <><div className="result-list">{products.filter(p => bag.includes(p.id)).map(p => <div key={p.id} className="result bag-row"><Photo image={p.image} alt="" /><div><button className="result-name" onClick={() => open(p)}>{p.name}</button><small>{money(p.price)}</small><div className="quantity"><button className="icon-button" aria-label={`Remove one ${p.name}`} onClick={() => setBag(current => { const copy = [...current]; copy.splice(copy.indexOf(p.id), 1); return copy; })}><Minus size={14} /></button><span>{bag.filter(id => id === p.id).length}</span><button className="icon-button" aria-label={`Add one ${p.name}`} onClick={() => setBag(current => [...current, p.id])}><Plus size={14} /></button></div></div></div>)}</div><div className="subtotal"><span>Subtotal</span><span>{money(bag.reduce((total, id) => total + products.find(p => p.id === id).price, 0))}</span></div><p className="muted">Your selection is saved on this device. Online checkout is not yet available; no order has been placed.</p></>}</>}
      {panel === 'bespoke' && <div className="bespoke-guide"><p>A thoughtful starting point for a piece that feels like you.</p><ol><li><h3>Find your inspiration</h3><p>Consider the occasion, the silhouette, and the pieces you already love.</p></li><li><h3>Explore the details</h3><p>Think about your preferred stone shape, metal color, and setting.</p></li><li><h3>Bring it together</h3><p>Keep a selection of favorite pieces as a starting point for your design.</p></li></ol><button className="button button-dark" onClick={() => { close(); browse('All pieces'); document.getElementById('pieces').scrollIntoView(); }}>Find inspiration <ArrowRight size={16} /></button></div>}
    </Modal>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
