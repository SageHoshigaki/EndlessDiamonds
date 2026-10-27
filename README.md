# Express Diamonds

The original Express Diamonds landing page remains at `/` with its previous photography, films, styling, and interactions. The catalog lives at `/catalog.html#/collections`; the dedicated loose-stone sourcing page is `/catalog.html#/loose-stones`. Navigation on both pages links directly to the main collections and loose stones.

Run `npm install`, `npm run dev`, `npm test`, and `npm run build`. Vite builds both HTML entry points. The previous landing page uses `src/main.jsx` and `src/styles.css`; the catalog uses `src/catalog.jsx` and `src/catalog.css`.

## Catalog

`src/data/catalog.json` contains the original 80 **reference/sample** entries: 60 watches, eight diamond concepts, and 12 fine-jewelry entries. `public/data/wrist-watches.json` adds 2,483 watch listings, for 2,543 watches and 2,563 catalog records in the current snapshot. The watch imports appear in the site's Watches collection and have their own product pages, gallery, search and inquiry. The 75% watch share applies to the original assortment plan; the current full catalog is watch-heavy because the requested external watch catalog was added in full.

All watches are inquiry-only listings. Their presence in the catalog does not establish Express Diamonds stock or a sale price. Imported records keep title, brand, seller description, and matching gallery together. Price, specifications, condition and local availability stay unverified until the owner checks the exact piece. Source URLs and image rights notes are retained in JSON provenance, with no outbound seller links on imported product pages.

`src/data/assortment-plan.json` records the original 600-watch / 100-diamond / 100-jewelry target. It is a planning target, not a live inventory claim. Owner confirmation is required for availability, exact configuration, condition and price.

Catalog URLs include collection, category, product, About, Contact/bespoke, and saved-piece pages. Hash routing supports direct links on a static host. Search, brand/status filters, alphabetical sorting, progressive loading, native product disclosures, and browser-local favorites are included.

## Photography

The original site's high-resolution media in `public/images` and `public/videos` remains on the landing page. The catalog keeps eight existing Rolex Datejust, Patek Philippe Nautilus, Audemars Piguet Royal Oak, Cartier LOVE, ring, bracelet, and earring photographs. Category cards use the original watch, diamond, and fine-jewelry editorial photos. Twelve loose-stone sourcing references have individual AI-generated concept photos. Fine-jewelry and diamond design studies also use disclosed concept photos.

The imported watch catalog includes matching primary and gallery photographs from its listing feed. The project owner stated they have permission or a licensed feed to republish these images and descriptions. The images load from the source's Shopify CDN; they are not copied into this repository. Run `npm run sync:watches` to refresh the complete public collection feed and rebuild. That command overwrites `public/data/wrist-watches.json`, so review the new snapshot before publishing. The 57 older watch references without a verified matching image still display an “exact product photo pending” panel. Existing watch photographs remain marked representative until exact configuration is confirmed. No image proves local availability or condition.

The provenance field records original asset origins and official reference URLs. Rights for the pre-existing site photography and films have not been independently verified; confirm those separately before public deployment.

## WhatsApp

No business number was present in the project. Copy `.env.example` to `.env.local`, set `VITE_WHATSAPP_NUMBER` to the owner's verified international-format WhatsApp number, then restart/rebuild. Inquiry buttons remain disabled until a valid number is configured. The generated draft includes brand, model, reference or missing-reference marker, catalog ID, stock disclosure and product link. The visitor reviews and sends it in WhatsApp. Contact-form text stays in browser memory until the visitor opens the draft. The public number appears in the frontend bundle; do not put secrets in `VITE_*` variables.

## Verification

`npm test` checks catalog identity/provenance, image pairing, inquiry-only status, local image paths, the original 75% planning split, filtering, and WhatsApp URL/message encoding. `npm run build` builds both pages. A production inquiry cannot be end-to-end tested without the business number.
