import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  ArrowRight,
  Heart,
  Gem,
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCw,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import "./styles.css";

const photos = {
  hero: "/images/hero-ring.jpg",
  diamond: "/images/category-diamond.jpeg",
  necklace: "/images/category-jewelry.jpeg",
  watch: "/images/category-watch.jpeg",
  custom: "/images/category-custom.jpeg",
  studs: "/images/product-studs.jpg",
  bracelet: "/images/product-bracelet.jpg",
  productWatch: "/images/product-watch.jpg",
  ring: "/images/product-ring.jpg",
  campaign: "/images/campaign-watch.jpg",
  lifestyle: "/images/campaign-jewelry.jpg",
};
const heroSlides = [
  { image: photos.hero, label: "THE EVERYDAY, ELEVATED" },
  { image: photos.campaign, label: "TIME WELL SPENT" },
  { image: photos.lifestyle, label: "MADE PERSONAL" },
  { image: photos.ring, label: "A BRIGHTER KIND OF FOREVER" },
];
const videos = {
  hero: "/videos/hwinston-hero.mp4",
  editorial: "/videos/hwinston-editorial.mp4",
};
const categories = [
  { name: "Diamonds", sub: "Shop now", image: photos.diamond },
  { name: "Fine jewelry", sub: "Shop now", image: photos.necklace },
  { name: "Luxury watches", sub: "Shop now", image: photos.watch },
  { name: "Custom pieces", sub: "Start custom", image: photos.custom },
];
const products = [
  {
    name: "Halo diamond studs",
    type: "Lab grown · 14k gold",
    price: "$1,250",
    image: photos.studs,
    tag: "BESTSELLER",
  },
  {
    name: "Diamond link bracelet",
    type: "Pavé · 14k yellow gold",
    price: "$3,950",
    image: photos.bracelet,
    tag: "JUST IN",
  },
  {
    name: "Steel chronograph",
    type: "Swiss automatic · blue dial",
    price: "$12,500",
    image: photos.productWatch,
    tag: "ICONIC",
  },
  {
    name: "Classic halo ring",
    type: "Round brilliant · white gold",
    price: "$2,850",
    image: photos.ring,
    tag: "MADE FOR YOU",
  },
];
function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Express Diamonds home">
      <span className="logo-mark">
        E<span>D</span>
      </span>
      <span className="logo-type">
        EXPRESS<small>— DIAMONDS —</small>
      </span>
    </a>
  );
}
function App() {
  const [saved, setSaved] = useState([]),
    [cart, setCart] = useState(0),
    [menu, setMenu] = useState(false),
    [notice, setNotice] = useState("");
  const [slide, setSlide] = useState(0);
  const toggleSaved = (name) =>
    setSaved((s) =>
      s.includes(name) ? s.filter((x) => x !== name) : [...s, name],
    );
  const addBag = (name) => {
    setCart((c) => c + 1);
    setNotice(`${name} added to your bag`);
    setTimeout(() => setNotice(""), 2400);
  };
  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <div className="announcement">
        Complimentary insured shipping on every order <span>·</span>{" "}
        Thoughtfully made, always
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Open menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Logo />
        <nav className={menu ? "nav open" : "nav"}>
          {[
            "Diamonds",
            "Jewelry",
            "Watches",
            "Custom",
            "Sell / trade",
            "Our story",
          ].map((x) => (
            <a
              key={x}
              href={x === "Custom" ? "#custom" : "#collections"}
              onClick={() => setMenu(false)}
            >
              {x}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search"
            onClick={() => setNotice("Search coming soon")}
          >
            <Search />
          </button>
          <button
            className="icon-button account"
            aria-label="Account"
            onClick={() => setNotice("Your account")}
          >
            <UserRound />
          </button>
          <button
            className="icon-button bag-button"
            aria-label={`Shopping bag, ${cart} items`}
            onClick={() =>
              setNotice(
                cart
                  ? `${cart} item${cart === 1 ? "" : "s"} in your bag`
                  : "Your bag is waiting for something beautiful",
              )
            }
          >
            <ShoppingBag />
            {cart > 0 && <span className="bag-count">{cart}</span>}
          </button>
        </div>
      </header>
      <main>
        <section
          className="hero"
        >
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={videos.hero} type="video/mp4" />
          </video>
        </section>
        <section className="editorial" id="collections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your forever</p>
              <h2>Considered collections</h2>
            </div>
            <a className="under-link" href="#featured">
              Explore all collections <ArrowRight size={14} />
            </a>
          </div>
          <div className="category-grid">
            {categories.map((c, i) => (
              <a href="#featured" className="category-card" key={c.name}>
                <div className="category-image">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="category-num">0{i + 1}</span>
                  <span className="category-arrow">
                    <ArrowRight size={17} />
                  </span>
                </div>
                <div className="category-label">
                  <div>
                    <h3>{c.name}</h3>
                    <span>{c.sub}</span>
                  </div>
                  <ArrowRight size={16} />
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="featured" id="featured">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chosen for you</p>
              <h2>Pieces to keep</h2>
            </div>
            <a className="under-link" href="#collections">
              View the collection <ArrowRight size={14} />
            </a>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <article className="product-card" key={p.name}>
                <div className="product-image">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="product-tag">{p.tag}</span>
                  <button
                    className={`heart-button ${saved.includes(p.name) ? "saved" : ""}`}
                    onClick={() => toggleSaved(p.name)}
                    aria-label={
                      saved.includes(p.name)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={17}
                      fill={saved.includes(p.name) ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="quick-add" onClick={() => addBag(p.name)}>
                    Add to bag <ArrowRight size={14} />
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.type}</p>
                  </div>
                  <strong>{p.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="editorial-film"
          style={{ "--film": `url(${photos.lifestyle})` }}
        >
          <video
            className="editorial-film-video"
            autoPlay
            muted
            loop
            playsInline
            poster={photos.lifestyle}
            aria-hidden="true"
          >
            <source src={videos.editorial} type="video/mp4" />
          </video>
          <div className="editorial-film-copy">
            <p className="eyebrow">The art of becoming</p>
            <h2>
              Made for
              <br />
              <em>the moment.</em>
            </h2>
            <a href="#custom" className="button button-light">
              Discover the house <ArrowRight size={15} />
            </a>
          </div>
        </section>
        <section className="story-banners">
          <div
            className="story-card watch-story"
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(13,25,42,.8),rgba(13,25,42,.08)),url(${photos.campaign})`,
            }}
          >
            <p className="eyebrow">The icons, considered</p>
            <h2>
              Time well
              <br />
              spent.
            </h2>
            <a href="#featured" className="button button-light">
              Discover watches <ArrowRight size={15} />
            </a>
          </div>
          <div
            className="story-card jewelry-story"
            id="custom"
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(15,19,26,.68),rgba(15,19,26,.05)),url(${photos.lifestyle})`,
            }}
          >
            <p className="eyebrow">Made personal</p>
            <h2>
              Something
              <br />
              only yours.
            </h2>
            <a
              href="#custom"
              className="button button-light"
              onClick={(e) => {
                e.preventDefault();
                setNotice("A jewelry specialist will be with you soon");
              }}
            >
              Begin your custom design <ArrowRight size={15} />
            </a>
          </div>
        </section>
        <section className="promise-strip">
          {[
            {
              Icon: Gem,
              title: "Consciously brilliant",
              detail: "Conflict free, lab grown",
            },
            {
              Icon: FileCheck2,
              title: "Know what you love",
              detail: "Certified, always",
            },
            {
              Icon: Truck,
              title: "A little extra care",
              detail: "Insured, complimentary shipping",
            },
            {
              Icon: RefreshCw,
              title: "Find your fit",
              detail: "Easy returns & exchanges",
            },
            {
              Icon: Headphones,
              title: "Here for you",
              detail: "Real people, expert advice",
            },
          ].map(({ Icon, title, detail }) => (
            <div className="promise" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </section>
      </main>
      <footer>
        <Logo />
        <p>Beautifully considered. Made to last.</p>
        <span>© 2025 Express Diamonds</span>
      </footer>
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
