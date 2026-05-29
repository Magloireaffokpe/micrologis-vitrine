import Fuse from "fuse.js";
import { Product } from "@/types";

let fuseInstance: Fuse<Product> | null = null;

export function getFuse(products: Product[]): Fuse<Product> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(products, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "tags", weight: 0.3 },
        { name: "subcategory", weight: 0.2 },
        { name: "specs", weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}

export function resetFuse() {
  fuseInstance = null;
}

export function searchProducts(products: Product[], query: string, limit = 8): Product[] {
  if (!query || query.length < 2) return [];
  const fuse = new Fuse(products, {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "tags", weight: 0.3 },
      { name: "subcategory", weight: 0.2 },
      { name: "specs", weight: 0.1 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return fuse.search(query, { limit }).map((r) => r.item);
}
