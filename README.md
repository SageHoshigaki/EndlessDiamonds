# Express Diamonds

The original Express Diamonds landing page remains at `/` with its previous photography, films, styling, anchor links, and interactions. A new catalog lives at `/catalog.html#/collections`; the landing page has a Catalog navigation link and a full-catalog link in its product section.

Run `npm install`, `npm run dev`, `npm test`, and `npm run build`. Vite builds both HTML entry points. The previous landing page uses `src/main.jsx` and `src/styles.css`; the catalog uses `src/catalog.jsx` and `src/catalog.css`.

## Catalog

`src/data/catalog.json` contains 80 **reference/sample** entries: 60 watches, eight diamond concepts, and 12 fine-jewelry entries. These are not verified available stock. Price and specifications remain null unless supplied and verified. Manufacturer references link to official collection pages; provenance says precisely whether a collection name or model reference was reviewed. The current watch count is 75% of the catalog.

`src/data/assortment-plan.json` keeps the larger requested target separate: 600 watches, 100 diamonds, 100 fine jewelry. That is 800 entries and 75% watches. Another 720 sourced entries are needed. Repeating a family, inventing SKUs or treating a competitor's listing as local stock would be misleading. Owner confirmation is required for availability, exact configuration, condition and price.

Catalog URLs include collection, category, product, About, Contact/bespoke, and saved-piece pages. Hash routing supports direct links on a static host. Search, brand/status filters, alphabetical sorting, progressive loading, native product disclosures, and browser-local favorites are included.

## Photography

The original site's high-resolution media in `public/images` and `public/videos` remains on the landing page. The catalog keeps eight existing Rolex Datejust, Patek Philippe Nautilus, Audemars Piguet Royal Oak, Cartier LOVE, ring, bracelet, and earring photographs. Category cards use the original watch, diamond, and fine-jewelry editorial photos. The other 72 reference entries use 12 new AI-generated, brand-free studio concept photographs in `public/images/catalog`. These photos are intentionally reused across related references; they do **not** depict the named models or prove inventory, configuration, or availability. Catalog captions and image metadata distinguish existing representative photos from generated concepts.

The provenance field records existing project assets and official reference URLs. Ownership and reuse rights for the existing photographs have not been independently verified. Confirm those rights before public deployment, especially for manufacturer imagery and the two landing-page films. No new competitor images were downloaded or copied.

## WhatsApp

No business number was present in the project. Copy `.env.example` to `.env.local`, set `VITE_WHATSAPP_NUMBER` to the owner's verified international-format WhatsApp number, then restart/rebuild. Inquiry buttons remain disabled until a valid number is configured. The generated draft includes brand, model, reference or missing-reference marker, catalog ID, stock disclosure and product link. The visitor reviews and sends it in WhatsApp. Contact-form text stays in browser memory until the visitor opens the draft. The public number appears in the frontend bundle; do not put secrets in `VITE_*` variables.

## Verification

`npm test` checks catalog identity/provenance, local image paths, the 75% split, filtering, and WhatsApp URL/message encoding. `npm run build` builds both pages. A production inquiry cannot be end-to-end tested without the business number.
