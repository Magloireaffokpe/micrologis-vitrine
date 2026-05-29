import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StoreConfig } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null, config: StoreConfig): string {
  if (price === null) return "Prix sur demande";
  return `${price.toLocaleString("fr-FR")} ${config.currency_symbol}`;
}

export function formatPriceCompact(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} M F`;
  if (price >= 1_000) return `${Math.round(price / 1_000)} k F`;
  return `${price} F`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: "Neuf",
    occasion: "Occasion",
    reconditioned: "Reconditionné",
  };
  return labels[condition] ?? condition;
}

export function conditionColor(condition: string): string {
  const colors: Record<string, string> = {
    new: "bg-brand-blue text-white",
    occasion: "bg-brand-orange text-white",
    reconditioned: "bg-emerald-600 text-white",
  };
  return colors[condition] ?? "bg-gray-500 text-white";
}
