import { Product, StoreConfig } from "@/types";

export function buildProductLink(product: Product, config: StoreConfig): string {
  const msg = encodeURIComponent(
    product.whatsapp_message ||
      `Bonjour MICROLOGIS, je suis intéressé(e) par : ${product.name}. Est-il disponible ?`
  );
  return `https://wa.me/${config.whatsapp_number.replace(/\D/g, "")}?text=${msg}`;
}

export function buildGenericLink(config: StoreConfig, message?: string): string {
  const msg = encodeURIComponent(message || config.whatsapp_message_generic);
  return `https://wa.me/${config.whatsapp_number.replace(/\D/g, "")}?text=${msg}`;
}

export function buildCategoryLink(categoryName: string, config: StoreConfig): string {
  const msg = encodeURIComponent(
    `Bonjour MICROLOGIS, je cherche un produit dans la catégorie ${categoryName}. Pouvez-vous m'aider ?`
  );
  return `https://wa.me/${config.whatsapp_number.replace(/\D/g, "")}?text=${msg}`;
}
