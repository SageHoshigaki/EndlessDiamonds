import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, Heart, Menu, X, ArrowUpRight } from "lucide-react";
import catalog from "./data/catalog.json";
import looseStones from "./data/loose-stones.json";
import {
  categories,
  filterCatalog,
  whatsappLink,
  productMessage,
} from "./lib/catalog";
import "./catalog.css";
const baseItems = catalog.items;
const number = import.meta.env.VITE_WHATSAPP_NUMBER;
const pathFor = (p) => `#/products/${p.id}`;
const thumbnailFor = (src) => {
  const url = new URL(src);
  url.searchParams.set("width", "180");
  return url.toString();
};
function useRoute() {
  const [route, set] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const update = () => set(location.hash.slice(1) || "/");
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  return route;
}
function Logo() {
  return (
    <a className="logo" href="/" aria-label="Express Diamonds home">
      <span>EXPRESS</span>
      <small>DIAMONDS</small>
    </a>
  );
}
function Art({ p, kind, large = false }) {
  if (p?.imagery[0].representation === "pending-exact-photo") {
    return (
      <figure className={`art pending-art ${large ? "large" : ""}`}>
        <div className="pending-art-inner" role="img" aria-label={`Exact photograph of ${p.brand} ${p.model} pending`}>
          <span>EXPRESS DIAMONDS</span>
          <strong>{p.brand}</strong>
          <small>{p.model}</small>
          <em>Image coming soon</em>
        </div>
      </figure>
    );
  }
  return (
    <figure className={`art ${large ? "large" : ""} ${p?.imagery[0].representation !== "illustration" ? "photo" : ""}`}>
      <img
        src={p?.imagery[0].src || {watches:"/images/category-watch.jpeg",diamonds:"/images/category-diamond.jpeg","fine-jewelry":"/images/category-jewelry.jpeg"}[kind]}
        alt={p?.imagery[0].representation === "generated-concept" ? `${p.model} — illustrative image` : p?.imagery[0].alt || `${kind} jewelry`}
        loading={large ? "eager" : "lazy"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/images/catalog/diamonds.svg";
        }}
      />
      {p?.imagery[0].representation === "generated-concept" && <figcaption>Illustrative image</figcaption>}
    </figure>
  );
}
function Inquiry({ message }) {
  const href = whatsappLink(number, message);
  return (
    <div className="inquiry">
      {href ? (
        <a
          className="button dark"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Make an Inquiry <ArrowUpRight size={17} />
        </a>
      ) : (
        <>
          <button className="button dark" disabled>
            Make an Inquiry
          </button>
          <p role="status">
            WhatsApp inquiries are not yet available. Please check back once our
            contact channel is connected.
          </p>
        </>
      )}
      <small>Opens WhatsApp. You review and send the message.</small>
    </div>
  );
}
function Card({ p, saved, toggle }) {
  return (
    <article className={`card ${p.provenance.type === "authorized-supplier-listing" ? "supplier" : ""}`}>
      <div className="card-art">
        <a href={pathFor(p)} aria-label={`View ${p.brand} ${p.model}`}>
          <Art p={p} />
        </a>
        <button
          className="save"
          onClick={() => toggle(p.id)}
          aria-label={`${saved ? "Unsave" : "Save"} ${p.model}`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-meta">
        <p className="eyebrow">{p.brand}</p>
        <a href={pathFor(p)}>
          <h3>{p.model}</h3>
        </a>
        <p>Inquire for details</p>
        <a className="text-link" href={pathFor(p)}>
          Discover the piece <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}
function Grid({ list, saved, toggle }) {
  return (
    <div className="grid">
      {list.map((p) => (
        <Card key={p.id} p={p} saved={saved.includes(p.id)} toggle={toggle} />
      ))}
    </div>
  );
}
function Collection({ category = "all", saved, toggle, items, supplierLoading, onlySaved = false }) {
  const [query, setQuery] = useState(""),
    [brand, setBrand] = useState("all"),
    [sort, setSort] = useState("featured"),
    [limit, setLimit] = useState(24);
  const source = onlySaved ? items.filter((p) => saved.includes(p.id))
    : category === "watches"
      ? [...items.filter((p) => p.provenance.type === "authorized-supplier-listing"), ...items.filter((p) => p.provenance.type !== "authorized-supplier-listing")]
      : items;
  const filtered = filterCatalog(source, {
    category,
    query,
    brand,
    sort,
  });
  useEffect(() => setLimit(24), [query, brand, sort]);
  return (
    <section className="section">
      <p className="eyebrow">THE CONSIDERED COLLECTION</p>
      <div className="page-heading">
        <h1>
          {onlySaved
            ? "Your saved pieces"
            : categories[category] || "All pieces"}
          <span>.</span>
        </h1>
        <p>
          Find a starting point.
          <br />
          Make it a personal conversation.
        </p>
      </div>
      <p className="disclosure">Discover a piece you love. Availability and pricing are confirmed personally.</p>
      <div className="toolbar">
        <label className="search">
          Search the collection
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Brand, model or reference"
          />
        </label>
        <label>
          House
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All houses</option>
            {[
              ...new Set(
                source
                  .filter((p) => category === "all" || p.category === category)
                  .map((p) => p.brand),
              ),
            ].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Curated order</option>
            <option value="az">House / model A–Z</option>
          </select>
        </label>
      </div>
      <div className="collection-tabs">
        <a href="#/collections">All pieces</a>
        {Object.entries(categories).map(([key, label]) => (
          <a
            aria-current={category === key ? "page" : undefined}
            href={`#/collections/${key}`}
            key={key}
          >
            {label}
          </a>
        ))}
        <a href="#/loose-stones">Loose stones</a>
      </div>
      <p className="count" role="status">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}{supplierLoading && (category === "all" || category === "watches") ? " · loading watches…" : ""}
      </p>
      {filtered.length ? (
        <Grid list={filtered.slice(0, limit)} saved={saved} toggle={toggle} />
      ) : (
        <div className="empty">
          <h2>No pieces here yet.</h2>
          <p>Try another search or explore the full collection.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setBrand("all");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      {filtered.length > limit && (
        <button className="button load" onClick={() => setLimit(limit + 24)}>
          Show more pieces ({filtered.length - limit})
        </button>
      )}
    </section>
  );
}
function Product({ p, saved, toggle, items }) {
  const [activeImage, setActiveImage] = useState(0);
  const gallery = p.gallery || [];
  const displayed = activeImage && gallery[activeImage]
    ? { ...p, imagery: [{ ...p.imagery[0], src: gallery[activeImage] }] }
    : p;
  return (
    <>
      <section className="section detail">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="#/collections">Collection</a> /{" "}
          <a href={`#/collections/${p.category}`}>{categories[p.category]}</a> /{" "}
          {p.model}
        </nav>
        <div className="product-layout">
          <div className="product-media">
            <Art p={displayed} large />
            {gallery.length > 1 && <div className="product-gallery" aria-label="Watch photographs">
              {gallery.map((src, index) => <button type="button" key={`${p.id}-${index}`} aria-label={`View photograph ${index + 1} of ${p.model}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}><img src={thumbnailFor(src)} alt="" loading="lazy" /></button>)}
            </div>}
          </div>
          <div className="product-copy">
            <p className="eyebrow">{p.brand}</p>
            <h1>{p.model}</h1>
            {p.reference && <p className="reference">Ref. {p.reference}</p>}
            <p className="availability">Availability, exact details and pricing on inquiry.</p>
            <Inquiry message={productMessage(p, location.href)} />
            <button
              className="text-link save-detail"
              onClick={() => toggle(p.id)}
              aria-pressed={saved.includes(p.id)}
            >
              <Heart size={16} />
              {saved.includes(p.id)
                ? "Saved to your pieces"
                : "Save this piece"}
            </button>
            <p className="description">{p.sourceDescription || (p.category === "watches" ? `Tell us about the ${p.model} you have in mind. We’ll help you explore the details and availability.` : `Explore ${p.model} with Express Diamonds. Tell us what you have in mind and we’ll help you find the right piece.`)}</p>
            <details>
              <summary>Inquiry details</summary>
              <p>
                We’ll confirm the exact piece, condition, documentation, price and delivery options with you. Sending an inquiry does not place an order.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="section related">
        <p className="eyebrow">CONTINUE EXPLORING</p>
        <h2>A considered selection.</h2>
        <Grid
          list={items
            .filter((x) => x.category === p.category && x.brand === p.brand && x.id !== p.id)
            .slice(0, 4)}
          saved={saved}
          toggle={toggle}
        />
      </section>
    </>
  );
}
function Home({ saved, toggle, items }) {
  return (
    <>
      <section className="hero" id="top">
        <div>
          <p className="eyebrow">EXPRESS DIAMONDS · A CONSIDERED COLLECTION</p>
          <h1>
            For the things
            <br />
            that <em>stay with you.</em>
          </h1>
          <p>
            Timepieces. Diamonds. Fine jewelry.
            <br />A personal approach to finding your next piece.
          </p>
          <a className="button light" href="#/collections">
            Explore the collection <ArrowRight size={16} />
          </a>
        </div>
        <div className="hero-art">
          <Art kind="watches" large />
          <span>01 / THE ART OF TIME</span>
        </div>
      </section>
      <section className="section" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THREE WORLDS. YOUR EXPRESSION.</p>
            <h2>
              Exceptional, <em>by nature.</em>
            </h2>
          </div>
          <a className="text-link" href="#/collections">
            View all pieces <ArrowRight size={15} />
          </a>
        </div>
        <div className="category-grid">
          {Object.entries(categories).map(([key, label], i) => (
            <a href={`#/collections/${key}`} key={key}>
              <Art kind={key} />
              <div className="category-title">
                <h3>{label}</h3>
                <span>
                  0{i + 1} <ArrowUpRight size={16} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="editorial" id="philosophy">
        <p className="eyebrow">THE EXPRESS DIAMONDS APPROACH</p>
        <h2>
          Considered carefully.
          <br />
          <em>Chosen personally.</em>
        </h2>
        <p>
          A collection is only the beginning. The right piece starts with what
          matters to you.
        </p>
        <a className="text-link" href="#/about">
          Our philosophy <ArrowRight size={16} />
        </a>
      </section>
      <section className="section" id="pieces">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE WATCH EDIT</p>
            <h2>A different measure of time.</h2>
          </div>
          <a href="#/collections/watches" className="text-link">
            Explore watches <ArrowRight size={16} />
          </a>
        </div>
        <Grid
          list={(items.filter((p) => p.provenance.type === "authorized-supplier-listing").slice(0, 4).length ? items.filter((p) => p.provenance.type === "authorized-supplier-listing").slice(0, 4) : baseItems.filter((p) => p.category === "watches" && p.imagery[0].representation === "editorial-photo").slice(0, 3))}
          saved={saved}
          toggle={toggle}
        />
      </section>
      <section className="closing" id="custom">
        <p className="eyebrow">SOMETHING ENTIRELY YOURS</p>
        <h2>Begin with a conversation.</h2>
        <a className="button dark" href="#/contact">
          Contact & bespoke <ArrowRight size={16} />
        </a>
      </section>
      <span id="editorial-film" />
    </>
  );
}
function LooseStones() {
  const [filter, setFilter] = useState("all");
  const stones = looseStones.items.filter((stone) => filter === "all" || stone.group === filter);
  return (
    <>
      <section className="section stone-page">
        <p className="eyebrow">THE LOOSE STONE EDIT</p>
        <div className="page-heading">
          <h1>Begin with the stone<span>.</span></h1>
          <p>One stone. A world of possibility.<br />A personal search starts here.</p>
        </div>
        <p className="disclosure">Explore the possibilities. We’ll help you find the right stone and confirm its details and availability.</p>
        <div className="collection-tabs" aria-label="Filter loose stones">
          {[["all", "All stones"], ["Diamond", "Diamonds"], ["Colored gemstone", "Colored gemstones"]].map(([value, label]) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
          ))}
        </div>
        <p className="count" role="status">{stones.length} stones to explore</p>
        {!whatsappLink(number, "test") && <p className="disclosure">WhatsApp inquiries will be available when the business number is connected.</p>}
        <div className="stone-grid">
          {stones.map((stone) => {
            const message = `Hello Express Diamonds, I would like to inquire about a ${stone.name.toLowerCase()}. Please share available options, grading documentation, treatments, origin and pricing. ${location.origin}/catalog.html#/loose-stones`;
            const href = whatsappLink(number, message);
            return (
              <article className="stone-card" key={stone.id}>
                <figure className="stone-art">
                  <img src={stone.imagery.src} alt={`${stone.name} — illustrative image`} loading="lazy" />
                  <figcaption>Illustrative image</figcaption>
                </figure>
                <p className="eyebrow">{stone.group}</p>
                <h2>{stone.name}</h2>
                <p>Explore {stone.name.toLowerCase()} options for your design.</p>
                {href ? <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">Make an Inquiry <ArrowUpRight size={15} /></a>
                  : <button className="text-link" type="button" disabled>Make an Inquiry <ArrowUpRight size={15} /></button>}
              </article>
            );
          })}
        </div>
      </section>
      <section className="closing">
        <p className="eyebrow">A STONE FOR YOUR STORY</p>
        <h2>Let’s find the right one.</h2>
        <a className="button dark" href="#/contact">Contact & bespoke <ArrowRight size={16} /></a>
      </section>
    </>
  );
}
function About() {
  return (
    <>
      <section className="section story">
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <h1>
          More than a piece.
          <br />
          <em>A personal expression.</em>
        </h1>
        <p className="lead">
          A watch that marks a new chapter. A diamond that carries a promise.
          Jewelry that becomes part of the everyday.
        </p>
        <div className="story-columns">
          <h2>
            Begin with what
            <br />
            matters to you.
          </h2>
          <div>
            <p>
              Express Diamonds brings timepieces, diamonds and fine jewelry
              together in a collection designed for discovery. Explore a house,
              a silhouette or an idea, then start a conversation about the piece
              you have in mind.
            </p>
            <p>
              Every inquiry is personal. We’ll help you explore the piece you love and confirm the exact details, availability and price.
            </p>
            <a href="#/contact" className="text-link">
              Start a conversation <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <section className="editorial">
        <p className="eyebrow">DISCOVER. CONSIDER. INQUIRE.</p>
        <h2>
          Good choices begin
          <br />
          <em>with clear details.</em>
        </h2>
        <p>
          Ask us about a piece’s provenance, condition and documentation. We’ll help you find the details that matter.
        </p>
        <a className="button light" href="#/collections">
          Explore the collection <ArrowRight size={16} />
        </a>
      </section>
    </>
  );
}
function Contact() {
  const [topic, setTopic] = useState("A piece from the collection"),
    [message, setMessage] = useState("");
  return (
    <section className="section contact">
      <div>
        <p className="eyebrow">CONTACT & BESPOKE</p>
        <h1>
          Let’s make
          <br />
          it <em>personal.</em>
        </h1>
        <p className="lead">
          Tell us what you have in mind.
          <br />A piece. An occasion. An idea.
        </p>
        <div className="steps">
          <p>
            <b>01</b> Share your starting point
          </p>
          <p>
            <b>02</b> Discuss the details
          </p>
          <p>
            <b>03</b> Confirm the possibilities
          </p>
        </div>
      </div>
      <div className="contact-form">
        <h2>Begin your inquiry.</h2>
        <label htmlFor="topic">I’d like to discuss</label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option>A piece from the collection</option>
          <option>A watch</option>
          <option>A diamond</option>
          <option>A bespoke jewelry idea</option>
        </select>
        <label htmlFor="message">Your message</label>
        <textarea
          id="message"
          rows="6"
          value={message}
          maxLength={1500}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us the model, occasion or design direction you have in mind."
        />
        <Inquiry
          message={`Hello Express Diamonds, I would like to discuss: ${topic}. ${message.trim()}`}
        />
        <p className="muted">
          This page does not submit or store your message. WhatsApp opens a
          draft for you to review and send. Please avoid including sensitive
          personal information.
        </p>
      </div>
    </section>
  );
}
function App() {
  const route = useRoute(),
    main = useRef(null);
  const [supplierItems, setSupplierItems] = useState([]),
    [supplierLoading, setSupplierLoading] = useState(true);
  const items = [...baseItems, ...supplierItems];
  const visibleItems = items.filter((p) => p.imagery[0].representation !== "pending-exact-photo");
  const [menu, setMenu] = useState(false),
    [saved, setSaved] = useState(() => {
      try {
        const s = JSON.parse(localStorage.getItem("ed-saved"));
        return Array.isArray(s) ? s.filter((id) => typeof id === "string") : [];
      } catch {
        return [];
      }
    });
  const toggle = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  useEffect(() => {
    fetch("/data/wrist-watches.json")
      .then((response) => { if (!response.ok) throw new Error("Supplier catalog unavailable"); return response.json(); })
      .then((data) => setSupplierItems(Array.isArray(data.items) ? data.items : []))
      .catch((error) => console.error(error))
      .finally(() => setSupplierLoading(false));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ed-saved", JSON.stringify(saved));
    } catch {}
  }, [saved]);
  useEffect(() => {
    setMenu(false);
    if (!route.startsWith("/")) {
      requestAnimationFrame(() =>
        document.getElementById(route)?.scrollIntoView(),
      );
    } else {
      requestAnimationFrame(() => {
        main.current?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      });
    }
  }, [route]);
  useEffect(() => {
    document.title = `${route.startsWith("/products/") ? items.find((p) => pathFor(p) === "#" + route)?.model || "Piece not found" : route === "/loose-stones" ? "Loose stones" : route.includes("about") ? "Our philosophy" : route.includes("contact") ? "Contact & bespoke" : route.includes("collections") ? "The collection" : "For all that matters"} — Express Diamonds`;
  }, [route, supplierItems]);
  let page;
  const props = { saved, toggle, items: visibleItems, supplierLoading };
  if (route === "/" || !route.startsWith("/")) page = <Home {...props} />;
  else if (route === "/collections" || route === "/saved")
    page = <Collection key={route} {...props} onlySaved={route === "/saved"} />;
  else if (route.startsWith("/collections/") && categories[route.split("/")[2]])
    page = <Collection key={route} category={route.split("/")[2]} {...props} />;
  else if (
    route.startsWith("/products/") &&
    items.some((p) => p.id === route.split("/")[2])
  )
    page = (
      <Product p={items.find((p) => p.id === route.split("/")[2])} {...props} />
    );
  else if (route.startsWith("/products/watch-catalog-") && supplierLoading)
    page = <section className="section empty"><h1>Loading watch.</h1></section>;
  else if (route === "/about") page = <About />;
  else if (route === "/loose-stones") page = <LooseStones />;
  else if (route === "/contact") page = <Contact />;
  else
    page = (
      <section className="section empty">
        <h1>Page not found.</h1>
        <a className="button dark" href="#/collections">
          Return to the collection
        </a>
      </section>
    );
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="announcement">
        A personal approach to extraordinary pieces.
      </div>
      <header>
        <div className="masthead">
          <button
            className="mobile-menu icon"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <a className="header-contact" href="#/contact">
            Private inquiries
          </a>
          <Logo />
          <a
            className="saved-link"
            href="#/saved"
            aria-label={`Saved pieces, ${saved.length}`}
          >
            <Heart size={17} />
            <span>Saved ({saved.length})</span>
          </a>
        </div>
        <nav
          id="nav"
          className={menu ? "open" : ""}
          aria-label="Main navigation"
        >
          <a href="#/collections" aria-current={route === "/collections" ? "page" : undefined}>Collection</a>
          <a href="#/collections/watches" aria-current={route === "/collections/watches" ? "page" : undefined}>Watches</a>
          <a href="#/collections/diamonds" aria-current={route === "/collections/diamonds" ? "page" : undefined}>Diamonds</a>
          <a href="#/loose-stones" aria-current={route === "/loose-stones" ? "page" : undefined}>Loose stones</a>
          <a href="#/collections/fine-jewelry" aria-current={route === "/collections/fine-jewelry" ? "page" : undefined}>Fine jewelry</a>
          <a href="#/about">About</a>
          <a href="#/contact">Contact</a>
        </nav>
      </header>
      <main ref={main} id="main" tabIndex="-1">
        {page}
      </main>
      <footer>
        <div>
          <Logo />
          <p>For all that matters.</p>
        </div>
        <div>
          <p className="eyebrow">EXPLORE</p>
          <a href="#/collections/watches">Watches</a>
          <a href="#/collections/diamonds">Diamonds</a>
          <a href="#/loose-stones">Loose stones</a>
          <a href="#/collections/fine-jewelry">Fine jewelry</a>
        </div>
        <div>
          <p className="eyebrow">PERSONAL CONNECTIONS</p>
          <a href="#/about">Our philosophy</a>
          <a href="#/contact">Contact & bespoke</a>
          <a href="#/saved">Saved pieces</a>
        </div>
        <p className="footer-note">
          Availability and pricing confirmed on inquiry.
          <br />© {new Date().getFullYear()} Express Diamonds
        </p>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
