import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  filterCatalog,
  whatsappLink,
  productMessage,
  categories,
} from "../src/lib/catalog.js";
const { items } = JSON.parse(
  readFileSync(new URL("../src/data/catalog.json", import.meta.url)),
);
test("catalog has unique identities, complete provenance and honest availability", () => {
  assert.equal(new Set(items.map((p) => p.id)).size, items.length);
  for (const p of items) {
    assert.ok(categories[p.category]);
    assert.ok(p.model && p.brand && p.description);
    assert.equal(p.status, "reference");
    assert.equal(p.price, null);
    assert.equal(p.specifications, null);
    assert.equal(p.availability, "unverified");
    assert.equal(p.provenance.inventoryVerifiedAt, null);
    assert.ok(p.provenance.scope);
    if (p.imagery[0].src) assert.ok(
      existsSync(new URL("../public" + p.imagery[0].src, import.meta.url)),
    );
    assert.equal(p.imagery[0].placeholder, true);
    assert.ok(["editorial-photo", "generated-concept", "pending-exact-photo"].includes(p.imagery[0].representation));
  }
});
test("watch images are matched project assets or clearly pending exact photos", () => {
  assert.equal(items.filter((p) => p.imagery[0].representation === "editorial-photo").length, 8);
  assert.equal(items.filter((p) => p.imagery[0].representation === "pending-exact-photo").length, 57);
  for (const p of items.filter((p) => p.category === "watches")) {
    assert.ok(p.manufacturerContext && p.provenance.sourceUrl);
    assert.notEqual(p.imagery[0].representation, "generated-concept");
  }
  for (const p of items.filter((p) => p.imagery[0].representation === "generated-concept")) {
    assert.match(p.imagery[0].alt, /not a photograph of/);
    assert.match(p.imagery[0].rights, /AI-generated/);
  }
});
test("loose-stone page has distinct reference-only entries and concept photos", () => {
  const stones = JSON.parse(readFileSync(new URL("../src/data/loose-stones.json", import.meta.url))).items;
  assert.equal(stones.length, 12);
  assert.equal(new Set(stones.map((s) => s.id)).size, stones.length);
  for (const stone of stones) {
    assert.equal(stone.status, "sourcing-reference");
    assert.equal(stone.availability, "unverified");
    assert.equal(stone.price, null);
    assert.equal(stone.specifications, null);
    assert.ok(existsSync(new URL("../public" + stone.imagery.src, import.meta.url)));
  }
});
test("watch share and planning targets are 75%, targets are separate from records", () => {
  assert.equal(
    items.filter((p) => p.category === "watches").length / items.length,
    0.75,
  );
  const plan = JSON.parse(
    readFileSync(new URL("../src/data/assortment-plan.json", import.meta.url)),
  );
  assert.equal(
    plan.targets.watches / Object.values(plan.targets).reduce((a, b) => a + b),
    0.75,
  );
});
test("combined filters, empty available inventory, search and sorting", () => {
  assert.equal(
    filterCatalog(items, {
      query: " NAUTILUS ",
      category: "watches",
      brand: "Patek Philippe",
    }).length,
    27,
  );
  assert.equal(filterCatalog(items, { status: "available" }).length, 0);
  assert.equal(filterCatalog(items, { category: "diamonds" }).length, 8);
  assert.equal(
    filterCatalog(items, { query: "no matching product" }).length,
    0,
  );
  assert.equal(
    filterCatalog(items, { sort: "az" })[0].brand,
    "Audemars Piguet",
  );
});
test("WhatsApp fails closed for absent or malformed number and encodes message exactly", () => {
  for (const n of [
    "",
    undefined,
    "0000000000",
    "123",
    "https://evil.test",
    "+1abc23456789",
  ])
    assert.equal(whatsappLink(n, "x"), null);
  const msg = productMessage(items[0], "https://example.test/#/products/test");
  const url = new URL(whatsappLink("+1 (202) 555-0123", msg));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/12025550123");
  assert.equal(url.searchParams.get("text"), msg);
  assert.match(msg, /confirm availability, exact details, condition and price/i);
  assert.doesNotMatch(msg, /catalog id|sample|source listing/i);
});
test("imported watch catalog keeps exact listing images paired with inquiry-only records", () => {
  const imported = JSON.parse(readFileSync(new URL("../public/data/wrist-watches.json", import.meta.url))).items;
  assert.ok(imported.length > 2000);
  assert.equal(new Set(imported.map((p) => p.id)).size, imported.length);
  for (const p of imported) {
    assert.equal(p.category, "watches");
    assert.equal(p.status, "reference");
    assert.equal(p.price, null);
    assert.equal(p.availability, "unverified");
    assert.equal(p.specifications, null);
    assert.equal(p.provenance.inventoryVerifiedAt, null);
    assert.equal(p.provenance.type, "authorized-supplier-listing");
    assert.ok(p.model && p.brand && p.sourceDescription);
    assert.ok(p.imagery[0].src.startsWith("https://cdn.shopify.com/"));
    assert.equal(p.imagery[0].src, p.gallery[0]);
    assert.ok(p.provenance.sourceUrl.startsWith("https://wristaficionado.com/products/"));
    assert.doesNotMatch(p.imagery[0].alt, /Wrist Aficionado/i);
  }
});
