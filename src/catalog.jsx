import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, Heart, Menu, X, ArrowUpRight } from "lucide-react";
import catalog from "./data/catalog.json";
import {
  categories,
  filterCatalog,
  whatsappLink,
  productMessage,
} from "./lib/catalog";
import "./catalog.css";
const items = catalog.items;
const number = import.meta.env.VITE_WHATSAPP_NUMBER;
const pathFor = (p) => `#/products/${p.id}`;
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
  return (
    <figure className={`art ${large ? "large" : ""} ${p?.imagery[0].representation !== "illustration" ? "photo" : ""}`}>
      <img
        src={p?.imagery[0].src || {watches:"/images/category-watch.jpeg",diamonds:"/images/category-diamond.jpeg","fine-jewelry":"/images/category-jewelry.jpeg"}[kind]}
        alt={p?.imagery[0].alt || `Editorial ${kind} photograph from the previous Express Diamonds site`}
        loading={large ? "eager" : "lazy"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/images/catalog/diamonds.svg";
        }}
      />
      <figcaption>
        {p?.imagery[0].representation === "editorial-photo"
          ? "REPRESENTATIVE PHOTO · AVAILABILITY UNVERIFIED"
          : p?.imagery[0].representation === "generated-concept"
            ? "CONCEPT PHOTO · NOT THE NAMED PRODUCT"
            : p ? "ILLUSTRATION · PRODUCT PHOTOGRAPHY PENDING" : "EDITORIAL PHOTOGRAPH"}
      </figcaption>
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
    <article className="card">
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
        <p>
          {p.status === "reference"
            ? "Reference piece · availability unverified"
            : "Verified available"}
        </p>
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
function Collection({ category = "all", saved, toggle, onlySaved = false }) {
  const [query, setQuery] = useState(""),
    [brand, setBrand] = useState("all"),
    [status, setStatus] = useState("all"),
    [sort, setSort] = useState("featured"),
    [limit, setLimit] = useState(24);
  const source = onlySaved ? items.filter((p) => saved.includes(p.id)) : items;
  const filtered = filterCatalog(source, {
    category,
    query,
    brand,
    status,
    sort,
  });
  useEffect(() => setLimit(24), [query, brand, status, sort]);
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
      <p className="disclosure">
        Reference collection. Availability, specifications and pricing are
        confirmed individually. Existing and generated photos are representative; generated concepts do not depict the named products.
      </p>
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
          Availability
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All pieces</option>
            <option value="reference">Reference / sample</option>
            <option value="available">Verified available</option>
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
      </div>
      <p className="count" role="status">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>
      {filtered.length ? (
        <Grid list={filtered.slice(0, limit)} saved={saved} toggle={toggle} />
      ) : (
        <div className="empty">
          <h2>No pieces here yet.</h2>
          <p>
            {status === "available"
              ? "No inventory has been verified as available. Explore the reference collection to begin an inquiry."
              : "Try another search or save pieces from the collection."}
          </p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setBrand("all");
              setStatus("all");
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
function Product({ p, saved, toggle }) {
  return (
    <>
      <section className="section detail">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="#/collections">Collection</a> /{" "}
          <a href={`#/collections/${p.category}`}>{categories[p.category]}</a> /{" "}
          {p.model}
        </nav>
        <div className="product-layout">
          <Art p={p} large />
          <div className="product-copy">
            <p className="eyebrow">{p.brand}</p>
            <h1>{p.model}</h1>
            <p className="reference">
              {p.reference
                ? `Ref. ${p.reference}`
                : "Collection reference · exact model to be confirmed"}
            </p>
            <span className="badge">
              {p.status === "reference"
                ? "Reference / sample piece"
                : "Verified available"}
            </span>
            <p className="description">{p.description}</p>
            <p className="availability">
              {p.status === "reference"
                ? "Not verified as available inventory."
                : ""}{" "}
              Pricing on confirmation.
            </p>
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
            <details open>
              <summary>Details & availability</summary>
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{categories[p.category]}</dd>
                </div>
                <div>
                  <dt>Reference</dt>
                  <dd>{p.reference || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Condition / specifications</dt>
                  <dd>Not verified</dd>
                </div>
                <div>
                  <dt>Catalog ID</dt>
                  <dd>{p.id}</dd>
                </div>
              </dl>
            </details>
            <details>
              <summary>Provenance & imagery</summary>
              <p>
                {p.provenance.scope}. Reviewed {p.provenance.reviewedOn}.{" "}
                {p.imagery[0].rights}. {p.imagery[0].representation === "generated-concept"
                  ? "This is an AI concept photo, not a photograph of the named product."
                  : "This image is representative; the exact item and availability are unverified."}
              </p>
              {p.provenance.sourceUrl && (
                <a
                  className="text-link"
                  href={p.provenance.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View reference source <ArrowUpRight size={14} />
                </a>
              )}
              <p>
                Brand names identify design references. No authorized-dealer
                relationship is claimed.
              </p>
            </details>
            <details>
              <summary>Your inquiry</summary>
              <p>
                Ask about the exact reference, availability, condition,
                documentation, price and delivery terms before making a purchase
                decision. Sending an inquiry does not place an order.
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
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)}
          saved={saved}
          toggle={toggle}
        />
      </section>
    </>
  );
}
function Home({ saved, toggle }) {
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
            <p className="eyebrow">THE REFERENCE EDIT</p>
            <h2>A different measure of time.</h2>
          </div>
          <a href="#/collections/watches" className="text-link">
            Explore watches <ArrowRight size={16} />
          </a>
        </div>
        <p className="disclosure">
          Design references, not verified stock. Existing photographs are representative; other pieces use generated concept photos.
        </p>
        <Grid
          list={[items[4], items[6], items[22], items[23]]}
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
              Our online edit currently contains reference pieces and bespoke
              design studies. Each is clearly labeled. Specific inventory,
              pricing and product details require confirmation.
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
          Ask about provenance, condition, documentation and the exact
          specifications of any piece. Reference imagery is never proof of
          available stock.
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
          <br />A reference. An occasion. An idea.
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
          <option>A watch reference</option>
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
  const [menu, setMenu] = useState(false),
    [saved, setSaved] = useState(() => {
      try {
        const s = JSON.parse(localStorage.getItem("ed-saved"));
        return Array.isArray(s)
          ? s.filter((id) => items.some((p) => p.id === id))
          : [];
      } catch {
        return [];
      }
    });
  const toggle = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  useEffect(() => {
    try {
      localStorage.setItem("ed-saved", JSON.stringify(saved));
    } catch {}
  }, [saved]);
  useEffect(() => {
    setMenu(false);
    document.title = `${route.startsWith("/products/") ? items.find((p) => pathFor(p) === "#" + route)?.model || "Piece not found" : route.includes("about") ? "Our philosophy" : route.includes("contact") ? "Contact & bespoke" : route.includes("collections") ? "The collection" : "For all that matters"} — Express Diamonds`;
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
  let page;
  const props = { saved, toggle };
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
  else if (route === "/about") page = <About />;
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
          <a href="#/collections">All pieces</a>
          {Object.entries(categories).map(([key, label]) => (
            <a
              key={key}
              href={`#/collections/${key}`}
              aria-current={
                route === `/collections/${key}` ? "page" : undefined
              }
            >
              {label}
            </a>
          ))}
          <a href="#/about">About</a>
          <a href="#/contact">Contact & bespoke</a>
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
          <a href="#/collections/fine-jewelry">Fine jewelry</a>
        </div>
        <div>
          <p className="eyebrow">PERSONAL CONNECTIONS</p>
          <a href="#/about">Our philosophy</a>
          <a href="#/contact">Contact & bespoke</a>
          <a href="#/saved">Saved pieces</a>
        </div>
        <p className="footer-note">
          Reference catalog · availability subject to confirmation. Brand names
          are used for identification; no affiliation or authorized-dealer
          status is implied.
          <br />© {new Date().getFullYear()} Express Diamonds
        </p>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
