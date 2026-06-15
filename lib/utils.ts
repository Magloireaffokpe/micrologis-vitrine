// lib/utils.ts — VERSION ÉTENDUE POUR SUPABASE
// Conserve TOUTES les fonctions existantes

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { StoreConfig, Product } from '@/types';

// ─── Existant (INCHANGÉ) ──────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formater un prix — signature originale conservée */
export function formatPrice(price: number | null, config: StoreConfig): string {
  if (price === null) return 'Prix sur demande';
  return `${price.toLocaleString('fr-FR')} ${config.currency_symbol}`;
}

export function formatPriceCompact(price: number | null): string {
  if (price === null) return '—';
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} M F`;
  if (price >= 1_000) return `${Math.round(price / 1_000)} k F`;
  return `${price} F`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: 'Neuf',
    occasion: 'Occasion',
    reconditioned: 'Reconditionné',
  };
  return labels[condition] ?? condition;
}

export function conditionColor(condition: string): string {
  const colors: Record<string, string> = {
    new: 'bg-brand-blue text-white',
    occasion: 'bg-brand-orange text-white',
    reconditioned: 'bg-emerald-600 text-white',
  };
  return colors[condition] ?? 'bg-gray-500 text-white';
}

// ─── Nouvelles fonctions pour le mode dynamique ───────────────────────────────

/**
 * Calcule le prix effectif d'un produit (promo active ou prix normal).
 * Compatible avec les deux schémas : JSON statique et Supabase.
 */
export function getEffectivePrice(product: Product): number | null {
  if (product.is_promo && product.price_promo) {
    const now = new Date();
    const start = product.promo_start ? new Date(product.promo_start) : null;
    const end = product.promo_end ? new Date(product.promo_end) : null;
    const isActive = (!start || now >= start) && (!end || now <= end);
    if (isActive) return product.price_promo;
  }
  return product.price;
}

/** Calcule le % de réduction */
export function getDiscountPercent(original: number, promo: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - promo) / original) * 100);
}

/** Tronquer un texte */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/** Formater une date en français */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
