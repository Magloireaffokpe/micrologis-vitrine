# MICROLOGIS Vitrine — Boutique High-Tech (Parakou, Bénin)

Ce projet est une vitrine e-commerce moderne, rapide et ultra-performante inspirée du design de **Materiel.net**. Elle est conçue pour présenter le catalogue d'ordinateurs, téléphones et accessoires de la boutique **MICROLOGIS** à Parakou (Bénin), avec une mise en relation directe par **WhatsApp** pour l'achat.

Toute la logique complexe de panier d'achat et de base de données backend a été retirée pour en faire un site statique extrêmement rapide à charger et simple à maintenir.

---

## 🚀 Technologies Utilisées
* **Framework** : Next.js 14 (App Router)
* **Langage** : TypeScript
* **Design & Styles** : Tailwind CSS & CSS Vanilla
* **Icônes** : Lucide React
* **Recherche** : Fuse.js (recherche floue ultra-rapide côté client)
* **Format d'images** : WebP (optimisé pour la performance et le mobile)

---

## 📦 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le site.

### 3. Compiler pour la production
```bash
npm run build
```

---

## 📂 Structure des Fichiers Clés

```text
├── app/                           # Pages de l'application (Next.js App Router)
│   ├── page.tsx                   # Page d'accueil
│   ├── [slug]/                    # Page dynamique des catégories
│   └── contact/                   # Page de contact
├── components/                    # Composants React
│   ├── layout/                    # Header, Footer, Menu Mobile, BottomNav
│   ├── sections/                  # HeroSection, FeaturedProducts, CategoryGrid, etc.
│   └── ui/                        # Cartes produits, Boutons WhatsApp, Barre de recherche
├── lib/                           # Utilitaires de données et WhatsApp
│   ├── products.ts                # Lecture et récupération du catalogue
│   └── whatsapp.ts                # Générateur de liens wa.me
├── public/                        # Fichiers statiques
│   ├── data/
│   │   └── products.json          # ★ SOURCE DE VÉRITÉ (Config, Catégories, Produits)
│   └── images/                    # Images de produits (format .webp uniquement)
```

---

## ✍️ Comment Gérer le Catalogue (Ajout, Modification, Suppression)

Le fichier **`public/data/products.json`** est l'unique source de vérité du site. Tout le contenu y est centralisé.

### 1. Modifier les informations de la boutique (Téléphone, Adresse, Horaires)
Modifiez l'objet `"config"` en haut du fichier :
```json
"config": {
  "store_name": "MICROLOGIS INFORMATIQUE & GSM",
  "whatsapp_number": "+22997000000",
  "phone": "+22997000000",
  "email": "micrologis.parakou@gmail.com",
  "address": "Parakou, BANIKANNI — le pavé...",
  "logo_path": "/images/logo/logo.webp"
}
```

### 2. Ajouter un produit au catalogue
Ajoutez un objet dans la liste `"products"` :
```json
{
  "id": "pc-005",
  "name": "Nom du Produit",
  "slug": "nom-du-produit-slug",
  "category_id": "ordinateurs",
  "subcategory": "HP",
  "description": "Description complète du produit.",
  "specs": "Spécifications courtes séparées par des points (ex: i5 · 8 Go RAM)",
  "price": 250000,
  "price_original": 280000,
  "condition": "new",          // Options: "new" (Neuf), "occasion" (Occasion), "reconditioned" (Reconditionné)
  "in_stock": true,
  "images": ["/images/ordinateurs/mon-image.webp"],
  "whatsapp_message": "Bonjour MICROLOGIS, je suis intéressé par le produit...",
  "featured": true,            // true pour l'afficher sur la page d'accueil
  "tags": ["HP", "ordinateur"]
}
```

---

## ⚡ Optimisation des Images (Performance & Rapidité)

Pour que le site reste ultra-rapide à charger sur mobile, respectez ces règles pour les images :

1. **Format WebP uniquement** : Enregistrez toutes vos images de produits avec l'extension `.webp`.
2. **Dimensions recommandées** : 
   * **800 × 600 px** (Format paysage horizontal) ou **800 × 800 px** (Format carré).
3. **Poids des fichiers** : Essayez de garder chaque image en dessous de **100 Ko** en ajustant la qualité lors de l'exportation.
