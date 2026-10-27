import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const COLLECTION = "https://wristaficionado.com/collections/watches/products.json";
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/data/wrist-watches.json");
const PAGE_SIZE = 250;
const MAX_PAGES = 100;

function cleanText(html = "") {
  return String(html)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

function imageFromListing(image, title, sourceUrl) {
  const url = new URL(image.src);
  if (url.protocol !== "https:" || url.hostname !== "cdn.shopify.com") return null;
  return {
    src: url.toString(),
    alt: `Catalog photograph of ${title}; exact available piece confirmed on inquiry`,
    rights: "Wrist Aficionado listing image; project owner states republication is authorized",
    placeholder: true,
    representation: "licensed-supplier-photo",
    licensingSourceUrl: sourceUrl,
  };
}

export function convertProduct(product, reviewedOn) {
  if (!product?.id || !product?.handle || !product?.title || !product?.images?.length) return null;
  const sourceUrl = `https://wristaficionado.com/products/${encodeURIComponent(product.handle)}`;
  const imagery = product.images.map((image) => imageFromListing(image, product.title, sourceUrl)).filter(Boolean);
  if (!imagery.length) return null;
  return {
    id: `watch-catalog-${product.id}`,
    category: "watches",
    brand: product.vendor || "Watch reference",
    model: product.title,
    reference: null,
    status: "reference",
    price: null,
    availability: "unverified",
    specifications: null,
    description: "Presented for private inquiry. Please confirm the exact available piece, condition, documentation and price.",
    sourceDescription: cleanText(product.body_html).replace(/Wrist Aficionado/gi, "the original catalog"),
    imagery: [imagery[0]],
    gallery: imagery.map((image) => image.src),
    provenance: {
      type: "authorized-supplier-listing",
      sourceUrl,
      reviewedOn,
      scope: "Title, description and photographs imported from the linked Wrist Aficionado listing; Express Diamonds stock, price and condition unverified",
      inventoryVerifiedAt: null,
    },
  };
}

async function main() {
  const source = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${COLLECTION}?limit=${PAGE_SIZE}&page=${page}`;
    const response = await fetch(url, { headers: { "User-Agent": "ExpressDiamondsCatalogImport/1.0" } });
    if (!response.ok) throw new Error(`Wrist Aficionado feed returned ${response.status} on page ${page}`);
    const batch = (await response.json()).products;
    if (!Array.isArray(batch)) throw new Error(`Invalid products feed on page ${page}`);
    source.push(...batch);
    process.stdout.write(`Page ${page}: ${batch.length} watches\n`);
    if (batch.length < PAGE_SIZE) break;
    if (page === MAX_PAGES) throw new Error("Feed exceeded the configured page limit; import not written");
    await new Promise((done) => setTimeout(done, 250));
  }
  const reviewedOn = new Date().toISOString().slice(0, 10);
  const items = source.map((product) => convertProduct(product, reviewedOn)).filter(Boolean);
  if (new Set(items.map((item) => item.id)).size !== items.length) throw new Error("Duplicate supplier listing IDs");
  if (items.length !== source.length) throw new Error("Some listings had no usable exact image; import not written");
  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify({ schemaVersion: 1, source: COLLECTION, reviewedOn, items }));
  process.stdout.write(`Wrote ${items.length} source-linked watch references to ${OUTPUT}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
