"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Product } from "@/types";
import { searchProducts } from "@/lib/search";

export function useSearch(products: Product[]) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQuery = useCallback(
    (val: string) => {
      setQuery(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!val || val.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        const hits = searchProducts(products, val, 8);
        setResults(hits);
        setIsOpen(hits.length > 0);
      }, 150);
    },
    [products]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  return { query, results, isOpen, handleQuery, close };
}
