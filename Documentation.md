# MICROLOGIS — Documentation complète du projet

> Site vitrine e-catalogue professionnel pour **MICROLOGIS INFORMATIQUE & GSM**, Parakou, Bénin.
> Construit avec **Next.js 14 App Router** · **TypeScript** · **Tailwind CSS** · **Fuse.js**

---

## Table des matières

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Prérequis techniques](#2-prérequis-techniques)
3. [Installation pas à pas](#3-installation-pas-à-pas)
4. [Organisation complète des fichiers](#4-organisation-complète-des-fichiers)
5. [Architecture et flux de données](#5-architecture-et-flux-de-données)
6. [Le fichier de données : products.json](#6-le-fichier-de-données--productsjson)
7. [Référence des composants](#7-référence-des-composants)
8. [Référence des hooks](#8-référence-des-hooks)
9. [Référence des fonctions utilitaires](#9-référence-des-fonctions-utilitaires)
10. [Système de design et palette couleurs](#10-système-de-design-et-palette-couleurs)
11. [Pages et routing](#11-pages-et-routing)
12. [Gestion du contenu — guide pratique](#12-gestion-du-contenu--guide-pratique)
13. [Déploiement sur Vercel](#13-déploiement-sur-vercel)
14. [Variables d'environnement](#14-variables-denvironnement)
15. [Scripts disponibles](#15-scripts-disponibles)
16. [Dépendances expliquées](#16-dépendances-expliquées)
17. [Évolutions recommandées](#17-évolutions-recommandées)

---

## 1. Démarrage rapide

```bash
# 1. Décompresser l'archive
unzip micrologis-vitrine.zip
cd micrologis-vitrine

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

---

## 2. Prérequis techniques

| Outil           | Version minimum | Vérification    |
| --------------- | --------------- | --------------- |
| Node.js         | 18.17.0+        | `node -v`       |
| npm             | 9.0.0+          | `npm -v`        |
| Git (optionnel) | 2.x             | `git --version` |

> **Pas besoin de base de données.** Tout le contenu est stocké dans un fichier JSON local.

---

## 3. Installation pas à pas

### 3.1 Décompresser et accéder au projet

```bash
unzip micrologis-vitrine.zip
cd micrologis-vitrine
```

### 3.2 Installer les dépendances Node.js

```bash
npm install
```

Cette commande lit `package.json` et télécharge tous les modules dans `node_modules/`.

### 3.3 Ajouter le logo

Copier le fichier logo de MICROLOGIS dans :

```
public/images/logo/logo.png
```

Le composant `LogoSafe` affiche automatiquement le logo s'il est présent. Si le fichier est absent ou cassé, un logo typographique de secours s'affiche (`MICRO` bleu + `LOGIS` anthracite).

### 3.4 Ajouter les images produits (optionnel)

Déposer les photos dans les dossiers correspondants :

```
public/images/ordinateurs/      ← photos de PC portables et fixes
public/images/telephones/       ← photos de smartphones
public/images/tablettes/        ← photos de tablettes
public/images/accessoires-gsm/  ← photos d'accessoires pour téléphones
public/images/accessoires-informatiques/ ← photos d'accessoires PC
public/images/services/         ← photos illustrant les services
```

Puis mettre à jour le champ `images` dans `public/data/products.json` pour chaque produit.
Si aucune image n'est fournie, une icône de catégorie s'affiche à la place.

### 3.5 Mettre à jour les informations de la boutique

Ouvrir `public/data/products.json` et modifier le bloc `config` (voir section 6).

### 3.6 Lancer en production

```bash
npm run build    # Compile le projet
npm run start    # Lance le serveur de production sur le port 3000
```

---

## 4. Organisation complète des fichiers

```
micrologis-vitrine/
│
├── app/                              ← Pages de l'application (Next.js App Router)
│   ├── layout.tsx                    ← Layout racine : métadonnées SEO, polices, structure HTML
│   ├── page.tsx                      ← Page d'accueil (route "/")
│   ├── globals.css                   ← Styles globaux, variables CSS, directives Tailwind
│   ├── not-found.tsx                 ← Page 404 personnalisée
│   ├── favicon.ico                   ← Icône de l'onglet navigateur
│   ├── [slug]/
│   │   └── page.tsx                  ← Page catégorie dynamique (route "/ordinateurs", "/telephones"…)
│   ├── contact/
│   │   └── page.tsx                  ← Page contact & localisation (route "/contact")
│   └── a-propos/                     ← Dossier réservé pour une future page "À propos"
│
├── components/                       ← Tous les composants React réutilisables
│   │
│   ├── layout/                       ← Composants de structure de page (header, footer…)
│   │   ├── RootLayoutClient.tsx      ← Wrapper "use client" : assemble TopBar + Header + Drawer + Footer + BottomNav
│   │   ├── TopBar.tsx                ← Barre supérieure : adresse, horaires, téléphone (masquée sur mobile)
│   │   ├── Header.tsx                ← Header principal : logo + barre de recherche + navbar desktop + bouton WhatsApp
│   │   ├── MegaMenu.tsx              ← Mega menu déroulant par catégorie (sous-catégories en grille)
│   │   ├── MobileDrawer.tsx          ← Tiroir latéral de navigation mobile (s'ouvre depuis le hamburger)
│   │   ├── BottomNav.tsx             ← Navigation fixe en bas d'écran, visible uniquement sur mobile
│   │   └── Footer.tsx                ← Pied de page 4 colonnes : marque, catégories, contact, horaires
│   │
│   ├── sections/                     ← Sections complètes de pages (blocs de contenu)
│   │   ├── HeroSection.tsx           ← Bannière principale de la page d'accueil (gradient + cards)
│   │   ├── PromoBanner.tsx           ← Bande orange : livraison, garantie, diagnostic, paiement
│   │   ├── CategoryGrid.tsx          ← Grille des 6 catégories avec icônes colorées
│   │   ├── FeaturedProducts.tsx      ← Section "Produits en vedette" (produits featured:true)
│   │   ├── ServicesSection.tsx       ← 6 cards de services : réparation, installation, livraison…
│   │   ├── WhatsAppBanner.tsx        ← Bloc CTA WhatsApp central (fond sombre)
│   │   └── CategoryClient.tsx        ← Composant interactif page catégorie : filtres + tri + grille/liste
│   │
│   └── ui/                           ← Composants atomiques réutilisables
│       ├── ProductCard.tsx           ← Carte produit : image, nom, prix, badge, bouton WhatsApp (vue grille ou liste)
│       ├── SearchBar.tsx             ← Barre de recherche avec dropdown Fuse.js et liens WhatsApp par résultat
│       ├── FilterSidebar.tsx         ← Panneau de filtres : sous-catégories (checkbox), état (radio), prix (slider)
│       ├── SortBar.tsx               ← Barre tri + compteur produits + toggle vue grille/liste
│       ├── Badge.tsx                 ← Badge coloré : Neuf / Occasion / Reconditionné / Promo / Rupture
│       ├── Breadcrumb.tsx            ← Fil d'Ariane navigation (Accueil > Catégorie > …)
│       ├── WhatsAppButton.tsx        ← Bouton WhatsApp réutilisable (3 tailles : sm, md, lg)
│       ├── WhatsAppCTA.tsx           ← Bouton flottant WhatsApp fixé en bas à droite de l'écran
│       └── LogoSafe.tsx              ← Logo avec gestion d'erreur : affiche l'image ou le texte MICROLOGIS en fallback
│
├── hooks/                            ← Hooks React personnalisés ("use client")
│   ├── useSearch.ts                  ← Gère la recherche live : query, results, isOpen, debounce 150ms, Échap
│   ├── useFilters.ts                 ← Gère les filtres : état local + synchronisation URL (params)
│   └── useMobileMenu.ts              ← Gère l'ouverture/fermeture du drawer : isOpen, overflow body, Échap
│
├── lib/                              ← Fonctions utilitaires et accès aux données (côté serveur et client)
│   ├── products.ts                   ← Toutes les fonctions de lecture du catalogue (getProducts, filterProducts…)
│   ├── utils.ts                      ← Helpers généraux : cn(), formatPrice(), slugify(), conditionLabel()
│   ├── whatsapp.ts                   ← Génération des liens wa.me avec messages pré-remplis
│   └── search.ts                     ← Configuration et instanciation Fuse.js pour la recherche floue
│
├── types/
│   └── index.ts                      ← Types TypeScript globaux : StoreConfig, Category, Product, FilterState…
│
├── public/                           ← Fichiers statiques servis directement par le navigateur
│   ├── data/
│   │   └── products.json             ← ★ SOURCE DE VÉRITÉ : config boutique + catégories + produits
│   └── images/
│       ├── logo/                     ← Mettre logo.png ici
│       ├── hero/                     ← Images de la bannière principale
│       ├── ordinateurs/              ← Photos des PC portables et fixes
│       ├── telephones/               ← Photos des smartphones
│       ├── tablettes/                ← Photos des tablettes
│       ├── accessoires-gsm/          ← Photos des accessoires GSM
│       ├── accessoires-informatiques/ ← Photos des accessoires informatiques
│       └── services/                 ← Photos pour les services
│
├── tailwind.config.ts                ← Configuration Tailwind : palette brand, polices, border-radius, shadows
├── tsconfig.json                     ← Configuration TypeScript (resolveJsonModule activé)
├── next.config.mjs                   ← Configuration Next.js (images, optimisations)
├── postcss.config.mjs                ← Configuration PostCSS (requis par Tailwind)
├── package.json                      ← Dépendances et scripts npm
└── README.md                         ← Ce fichier
```

---

## 5. Architecture et flux de données

### Principe général

Le projet n'a **aucun backend, aucune base de données, aucune API**. Toute la donnée vit dans un seul fichier :

```
public/data/products.json
       ↓
lib/products.ts  (fonctions de lecture)
       ↓
app/layout.tsx   (layout racine, charge config + catégories + produits)
app/page.tsx     (page accueil, charge produits featured)
app/[slug]/page.tsx  (page catégorie, charge produits de la catégorie)
       ↓
components/sections/...  (reçoivent les données en props)
components/ui/...        (reçoivent les données en props)
```

### Séparation Server / Client Components

Next.js 14 distingue deux types de composants :

| Type                          | Marqueur                          | Rôle dans ce projet                              |
| ----------------------------- | --------------------------------- | ------------------------------------------------ |
| **Server Component** (défaut) | aucun                             | Lire le JSON, générer le HTML, SEO               |
| **Client Component**          | `"use client"` en tête de fichier | Interactions : recherche, filtres, menus, drawer |

Les composants `"use client"` dans ce projet :

- `RootLayoutClient.tsx` — orchestre l'ouverture du drawer
- `CategoryClient.tsx` — filtres, tri, toggle vue grille/liste
- `SearchBar.tsx` — recherche live avec dropdown
- `FilterSidebar.tsx` — checkboxes et slider de prix
- `SortBar.tsx` — sélecteurs de tri et de vue
- `MobileDrawer.tsx` — animation d'ouverture
- `BottomNav.tsx` — surlignage du lien actif
- `WhatsAppCTA.tsx` — bouton flottant
- Tous les hooks (`hooks/*.ts`)

### Génération statique des pages catégories

La fonction `generateStaticParams()` dans `app/[slug]/page.tsx` indique à Next.js de pré-générer les 6 pages catégories au moment du build :

```
/ordinateurs
/telephones
/tablettes
/accessoires-gsm
/accessoires-informatiques
/services
```

Résultat : le site se déploie comme un **ensemble de fichiers HTML statiques**, sans serveur Node.js en production (si hébergé sur Vercel ou Netlify).

---

## 6. Le fichier de données : products.json

Ce fichier est la **seule source de vérité** du site. Il contient trois sections : `config`, `categories`, et `products`.

Chemin : `public/data/products.json`

---

### 6.1 Section `config` — Configuration de la boutique

```json
"config": {
  "store_name": "MICROLOGIS INFORMATIQUE & GSM",
  "tagline": "Votre partenaire high-tech à Parakou",
  "whatsapp_number": "+22997000000",
  "whatsapp_message_generic": "Bonjour MICROLOGIS, je voudrais des renseignements.",
  "phone": "+22997000000",
  "email": "micrologis.parakou@gmail.com",
  "address": "Parakou, BANIKANNI — le pavé qui quitte le Campus pour Rose Croix, après le pont, 2ème immeuble à droite",
  "city": "Parakou, Bénin",
  "maps_embed_url": "https://maps.google.com/?q=Parakou+Benin",
  "currency": "FCFA",
  "currency_symbol": "F",
  "logo_path": "/images/logo/logo.png",
  "hours": {
    "Lundi–Vendredi": "08h00 – 19h00",
    "Samedi": "08h00 – 18h00",
    "Dimanche": "Fermé"
  },
  "social": {
    "facebook": "https://facebook.com/micrologis",
    "instagram": ""
  }
}
```

| Champ                      | Description                                    | Exemple                                  |
| -------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `store_name`               | Nom complet affiché dans les balises `<title>` | `"MICROLOGIS INFORMATIQUE & GSM"`        |
| `tagline`                  | Accroche affichée dans le hero et le SEO       | `"Votre partenaire high-tech à Parakou"` |
| `whatsapp_number`          | Numéro WhatsApp avec indicatif pays            | `"+22997000000"`                         |
| `whatsapp_message_generic` | Message pré-rempli des liens génériques        | `"Bonjour MICROLOGIS…"`                  |
| `phone`                    | Numéro affiché dans la TopBar et le footer     | `"+22997000000"`                         |
| `email`                    | Adresse email affichée dans le footer          | `"micrologis.parakou@gmail.com"`         |
| `address`                  | Adresse complète avec indication d'itinéraire  | texte libre                              |
| `logo_path`                | Chemin vers le logo dans `public/`             | `"/images/logo/logo.png"`                |
| `hours`                    | Objet clé=jour, valeur=horaire                 | voir exemple                             |
| `social.facebook`          | URL de la page Facebook                        | URL complète ou `""`                     |
| `social.instagram`         | URL du compte Instagram                        | URL complète ou `""`                     |

---

### 6.2 Section `categories` — Les 6 catégories

Chaque catégorie génère une page à l'URL `/{slug}`.

```json
{
  "id": "ordinateurs",
  "slug": "ordinateurs",
  "name": "Ordinateurs",
  "name_short": "PC",
  "description": "Portables et fixes neufs & occasion — HP, Dell, Lenovo, Asus, Acer",
  "icon": "Laptop",
  "color": "#1B5EC2",
  "bg_color": "#EBF2FB",
  "meta_title": "Ordinateurs Portables & PC Fixes à Parakou | MICROLOGIS",
  "meta_description": "Achetez vos ordinateurs HP, Dell, Lenovo neufs et occasion à Parakou.",
  "subcategories": [
    "HP",
    "Dell",
    "Lenovo",
    "Asus",
    "Acer",
    "Toshiba",
    "PC Occasion"
  ]
}
```

| Champ              | Description                                                          | Valeurs possibles                                                 |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `id`               | Identifiant interne, doit correspondre au `category_id` des produits | texte sans espaces                                                |
| `slug`             | Segment d'URL de la page catégorie                                   | texte sans espaces ni accents                                     |
| `name`             | Nom affiché dans les menus et les titres                             | texte libre                                                       |
| `name_short`       | Nom court pour les petits espaces (grille catégories)                | texte court                                                       |
| `icon`             | Nom de l'icône Lucide React utilisée                                 | `Laptop`, `Smartphone`, `Tablet`, `Headphones`, `Mouse`, `Wrench` |
| `color`            | Couleur principale de la catégorie (texte, icône)                    | code hexadécimal                                                  |
| `bg_color`         | Couleur de fond de la catégorie (fond carte, fond page)              | code hexadécimal                                                  |
| `meta_title`       | Balise `<title>` de la page catégorie                                | texte, idéalement < 60 caractères                                 |
| `meta_description` | Balise `<meta description>`                                          | texte, idéalement < 160 caractères                                |
| `subcategories`    | Liste des marques/types affichés dans les filtres et mega menus      | tableau de chaînes                                                |

**Catégories existantes et leurs IDs :**

| ID                          | Slug                        | Page                         |
| --------------------------- | --------------------------- | ---------------------------- |
| `ordinateurs`               | `ordinateurs`               | `/ordinateurs`               |
| `telephones`                | `telephones`                | `/telephones`                |
| `tablettes`                 | `tablettes`                 | `/tablettes`                 |
| `accessoires-gsm`           | `accessoires-gsm`           | `/accessoires-gsm`           |
| `accessoires-informatiques` | `accessoires-informatiques` | `/accessoires-informatiques` |
| `services`                  | `services`                  | `/services`                  |

---

### 6.3 Section `products` — Les produits

Chaque produit est un objet JSON avec les champs suivants :

```json
{
  "id": "pc-001",
  "name": "HP ProBook 450 G8 — Core i5 11e Gen",
  "slug": "hp-probook-450-g8-core-i5",
  "category_id": "ordinateurs",
  "subcategory": "HP",
  "description": "Description complète du produit…",
  "specs": "i5-1135G7 · 8 Go RAM · 256 Go SSD · 15,6\" FHD · Windows 11",
  "price": 320000,
  "price_original": 380000,
  "condition": "new",
  "in_stock": true,
  "images": ["/images/ordinateurs/hp-probook-450.jpg"],
  "whatsapp_message": "Bonjour MICROLOGIS, je suis intéressé(e) par le HP ProBook 450 G8.",
  "featured": true,
  "tags": ["HP", "ordinateur", "portable", "i5", "professionnel"]
}
```

**Description détaillée de chaque champ :**

| Champ              | Type           | Obligatoire | Description                                                                                |
| ------------------ | -------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `id`               | string         | ✅          | Identifiant unique. Convention : `{cat-abrégé}-{numéro}` ex: `pc-001`, `tel-003`           |
| `name`             | string         | ✅          | Nom complet affiché sur la carte et dans la recherche                                      |
| `slug`             | string         | ✅          | Identifiant URL du produit (sans espaces ni accents)                                       |
| `category_id`      | string         | ✅          | Doit correspondre exactement à un `id` dans `categories`                                   |
| `subcategory`      | string         | ✅          | Marque ou type. Doit être dans le tableau `subcategories` de la catégorie parente          |
| `description`      | string         | ✅          | Description longue (utilisée sur la page détail produit à venir)                           |
| `specs`            | string         | ✅          | Caractéristiques courtes affichées sous le nom sur la carte                                |
| `price`            | number ou null | ✅          | Prix en FCFA. Mettre `null` pour afficher "Prix sur demande"                               |
| `price_original`   | number ou null | ✅          | Ancien prix (affiche une ligne barrée). Mettre `null` si pas de promo                      |
| `condition`        | string         | ✅          | État du produit : `"new"`, `"occasion"`, ou `"reconditioned"`                              |
| `in_stock`         | boolean        | ✅          | `true` = en stock, `false` = rupture (affiche un badge rouge)                              |
| `images`           | string[]       | ✅          | Tableau de chemins d'images. Tableau vide `[]` si pas de photo                             |
| `whatsapp_message` | string ou null | ✅          | Message pré-rempli pour ce produit. Si `null`, un message générique est utilisé            |
| `featured`         | boolean        | ✅          | `true` = affiché sur la page d'accueil dans "Produits en vedette"                          |
| `tags`             | string[]       | ✅          | Mots-clés pour la recherche Fuse.js. Inclure la marque, le type, les caractéristiques clés |

**Valeurs du champ `condition` :**

| Valeur            | Badge affiché | Couleur                 | Filtré par        |
| ----------------- | ------------- | ----------------------- | ----------------- |
| `"new"`           | Neuf          | Bleu (`brand-blue`)     | Filtre "Neuf"     |
| `"occasion"`      | Occasion      | Orange (`brand-orange`) | Filtre "Occasion" |
| `"reconditioned"` | Reconditionné | Vert (`emerald-600`)    | Filtre "Occasion" |

---

### 6.4 Convention de nommage des IDs produits

| Catégorie                 | Préfixe ID  | Exemple              |
| ------------------------- | ----------- | -------------------- |
| Ordinateurs               | `pc-`       | `pc-001`, `pc-002`   |
| Téléphones                | `tel-`      | `tel-001`, `tel-002` |
| Tablettes                 | `tab-`      | `tab-001`, `tab-002` |
| Accessoires GSM           | `acc-gsm-`  | `acc-gsm-001`        |
| Accessoires informatiques | `acc-info-` | `acc-info-001`       |
| Services                  | `serv-`     | `serv-001`           |

---

## 7. Référence des composants

### 7.1 Composants de layout

---

#### `RootLayoutClient`

**Fichier :** `components/layout/RootLayoutClient.tsx`
**Type :** Client Component (`"use client"`)

Point d'entrée de tout l'affichage. Instancie le hook `useMobileMenu` et passe les callbacks au `Header` et au `MobileDrawer`. Il assemble dans l'ordre : TopBar → Header → MobileDrawer → `{children}` → Footer → BottomNav → WhatsAppCTA.

```tsx
<RootLayoutClient config={config} categories={categories} products={products}>
  {children}
</RootLayoutClient>
```

| Prop         | Type              | Description                                            |
| ------------ | ----------------- | ------------------------------------------------------ |
| `config`     | `StoreConfig`     | Configuration boutique depuis products.json            |
| `categories` | `Category[]`      | Liste des catégories pour la navbar et le footer       |
| `products`   | `Product[]`       | Liste complète des produits pour la barre de recherche |
| `children`   | `React.ReactNode` | Contenu de la page courante                            |

---

#### `TopBar`

**Fichier :** `components/layout/TopBar.tsx`
**Type :** Server Component
**Visible :** Desktop uniquement (`hidden md:block`)

Affiche adresse, horaires et téléphone. Ne reçoit que `config`.

---

#### `Header`

**Fichier :** `components/layout/Header.tsx`
**Type :** Server Component (les parties interactives sont dans les enfants)

Contient trois zones :

1. **Logo** — `LogoSafe` linkant vers `/`
2. **SearchBar** — visible à partir de `sm:` (≥ 640px)
3. **CTA** — bouton WhatsApp desktop + bouton hamburger mobile

La navbar sous le header contient les liens catégories. Chaque lien est enveloppé dans un `group` Tailwind qui déclenche le `MegaMenu` au survol CSS pur (pas de JavaScript).

---

#### `MegaMenu`

**Fichier :** `components/layout/MegaMenu.tsx`
**Type :** Server Component

Rendu conditionnel : ne s'affiche que si la catégorie a des sous-catégories (`subcategories.length > 0`). L'animation d'apparition est gérée par des classes Tailwind sur le groupe parent (opacity-0 → opacity-100, translate-y).

Structure interne :

- En-tête coloré avec le nom de la catégorie
- Grille 2 colonnes des sous-catégories (liens vers `/{slug}?sub={valeur}`)
- Lien "Voir tous les…" en bas

---

#### `MobileDrawer`

**Fichier :** `components/layout/MobileDrawer.tsx`
**Type :** Client Component (`"use client"`)

Tiroir qui glisse depuis la gauche. Déclenché par le bouton hamburger dans le Header. Contient :

- Logo textuel MICROLOGIS
- Bouton de fermeture (×)
- Liste des catégories avec emojis
- Informations de contact et bouton WhatsApp

| Prop         | Type          | Description                                         |
| ------------ | ------------- | --------------------------------------------------- |
| `isOpen`     | `boolean`     | État d'ouverture contrôlé par le parent             |
| `onClose`    | `() => void`  | Callback pour fermer le drawer                      |
| `config`     | `StoreConfig` | Pour afficher le numéro et générer le lien WhatsApp |
| `categories` | `Category[]`  | Liste des catégories à afficher                     |

---

#### `BottomNav`

**Fichier :** `components/layout/BottomNav.tsx`
**Type :** Client Component (`"use client"`)
**Visible :** Mobile uniquement (`md:hidden`)

4 onglets : Accueil, Catégories, Chercher, Contact. L'onglet actif est mis en évidence grâce à `usePathname()`.

---

#### `Footer`

**Fichier :** `components/layout/Footer.tsx`
**Type :** Server Component

Grille 4 colonnes (1 colonne sur mobile) : marque + description · catégories · contact · horaires. Passe en 2 colonnes entre `sm:` et `lg:`.

---

### 7.2 Composants de sections

---

#### `HeroSection`

**Fichier :** `components/sections/HeroSection.tsx`
**Type :** Server Component

Bannière principale avec gradient `brand-dark → [#243554] → brand-blue`. Contient :

- Badge localisation "Parakou, Bénin"
- Titre H1 avec mot-clé "high-tech" en orange
- 2 boutons CTA : "Voir les produits" (orange) et "Nous écrire" (outline)
- 4 cards de mise en avant (visibles uniquement desktop)

---

#### `PromoBanner`

**Fichier :** `components/sections/PromoBanner.tsx`
**Type :** Server Component

Bande orange avec 4 arguments : livraison, garantie, diagnostic gratuit, paiement à la livraison. Pas de props — contenu fixe.

---

#### `CategoryGrid`

**Fichier :** `components/sections/CategoryGrid.tsx`
**Type :** Server Component

Grille responsive des 6 catégories. Chaque carte est un `<Link>` vers `/{slug}` avec icône Lucide colorée selon `cat.color` et `cat.bg_color`. Animation au survol : bordure bleue + élévation + zoom icône.

---

#### `FeaturedProducts`

**Fichier :** `components/sections/FeaturedProducts.tsx`
**Type :** Server Component

Affiche uniquement les produits avec `featured: true` depuis products.json. Grille 2→3→4 colonnes. Lien "Voir tout" vers `/ordinateurs`.

---

#### `ServicesSection`

**Fichier :** `components/sections/ServicesSection.tsx`
**Type :** Server Component

6 cards service définies en dur dans le composant (pas dans products.json). Fond gris clair. Icônes Lucide React.

---

#### `WhatsAppBanner`

**Fichier :** `components/sections/WhatsAppBanner.tsx`
**Type :** Server Component

Bloc pleine largeur sur fond `brand-dark`. Appel à l'action central avec grand bouton WhatsApp vert. Le lien est généré par `buildGenericLink()`.

---

#### `CategoryClient`

**Fichier :** `components/sections/CategoryClient.tsx`
**Type :** Client Component (`"use client"`)

Composant principal de la page catégorie. Gère toute l'interactivité côté client :

- État `filters` (sous-catégories, condition, fourchette de prix)
- État `sort` (pertinence, prix croissant/décroissant, nom)
- État `view` (grille ou liste)
- État `showMobileFilters` (overlay filtres sur mobile)

Le calcul des produits affichés est mémoïsé avec `useMemo` : `sortProducts(filterProducts(products, filters), sort)`.

| Prop         | Type          | Description                                             |
| ------------ | ------------- | ------------------------------------------------------- |
| `products`   | `Product[]`   | Produits de la catégorie (pré-filtrés côté serveur)     |
| `config`     | `StoreConfig` | Pour formater les prix et générer les liens WhatsApp    |
| `category`   | `Category`    | Pour les sous-catégories disponibles dans les filtres   |
| `initialSub` | `string?`     | Sous-catégorie initiale depuis le paramètre URL `?sub=` |

---

### 7.3 Composants UI atomiques

---

#### `ProductCard`

**Fichier :** `components/ui/ProductCard.tsx`
**Type :** Server Component

Supporte deux modes d'affichage :

- **`view="grid"`** (défaut) : carte verticale avec image aspect-ratio 4/3, badges, specs, prix, bouton WhatsApp
- **`view="list"`** : ligne horizontale compacte avec miniature, nom, prix, bouton

Si aucune image n'est fournie dans `product.images`, une icône de catégorie s'affiche à la place.

| Prop      | Type                 | Défaut   | Description                                          |
| --------- | -------------------- | -------- | ---------------------------------------------------- |
| `product` | `Product`            | —        | Données du produit                                   |
| `config`  | `StoreConfig`        | —        | Pour formater le prix et construire le lien WhatsApp |
| `view`    | `"grid"` \| `"list"` | `"grid"` | Mode d'affichage                                     |

---

#### `SearchBar`

**Fichier :** `components/ui/SearchBar.tsx`
**Type :** Client Component (`"use client"`)

Utilise le hook `useSearch` qui encapsule Fuse.js avec debounce 150ms. Affiche un dropdown au-dessus/dessous avec jusqu'à 8 résultats. Chaque résultat est un lien direct vers WhatsApp avec le message produit pré-rempli. La fermeture se fait au clic extérieur (via `useRef` + `addEventListener`) ou avec la touche Échap.

| Prop        | Type          | Description                           |
| ----------- | ------------- | ------------------------------------- |
| `products`  | `Product[]`   | Liste complète à indexer dans Fuse.js |
| `config`    | `StoreConfig` | Pour construire les liens WhatsApp    |
| `className` | `string?`     | Classes CSS additionnelles            |

---

#### `FilterSidebar`

**Fichier :** `components/ui/FilterSidebar.tsx`
**Type :** Client Component (`"use client"`)

Trois sections de filtres :

1. **Marque / Type** : checkboxes pour chaque sous-catégorie
2. **État** : radio buttons (Tous / Neuf / Occasion)
3. **Prix maximum** : range slider en FCFA

Chaque modification appelle immédiatement `onApply` sans bouton "Valider". Le compteur de filtres actifs (`activeCount`) est calculé par le parent.

| Prop            | Type                       | Description                                           |
| --------------- | -------------------------- | ----------------------------------------------------- |
| `subcategories` | `string[]`                 | Options disponibles (depuis `category.subcategories`) |
| `filters`       | `FilterState`              | État courant des filtres                              |
| `maxPrice`      | `number`                   | Borne maximale du slider                              |
| `activeCount`   | `number`                   | Nombre de filtres actifs (pour le bouton "Effacer")   |
| `onApply`       | `(f: FilterState) => void` | Callback appliqué à chaque modification               |
| `onReset`       | `() => void`               | Callback pour tout réinitialiser                      |

---

#### `SortBar`

**Fichier :** `components/ui/SortBar.tsx`
**Type :** Client Component (`"use client"`)

Barre en haut de la grille produits. Contient :

- Sur mobile : bouton "Filtres" avec badge du nombre de filtres actifs
- Compteur de produits trouvés
- `<select>` de tri (pertinence, prix, nom)
- Toggle grille/liste (icônes Lucide `LayoutGrid` / `LayoutList`)

---

#### `Badge`

**Fichier :** `components/ui/Badge.tsx`
**Type :** Server Component

| Variant         | Couleur               | Texte affiché |
| --------------- | --------------------- | ------------- |
| `new`           | Bleu `brand-blue`     | Neuf          |
| `occasion`      | Orange `brand-orange` | Occasion      |
| `reconditioned` | Vert `emerald-600`    | Reconditionné |
| `promo`         | Vert `green-600`      | Promo         |
| `stock`         | Rouge `red-500`       | Rupture       |

---

#### `Breadcrumb`

**Fichier :** `components/ui/Breadcrumb.tsx`
**Type :** Server Component

Accepte un tableau d'items `{ label, href? }`. Les items sans `href` sont affichés en texte simple (dernier élément du fil d'Ariane). Les items avec `href` sont des liens actifs.

---

#### `WhatsAppButton`

**Fichier :** `components/ui/WhatsAppButton.tsx`
**Type :** Server Component

Bouton réutilisable pour les appels à l'action WhatsApp. Toujours `target="_blank"`.

| Prop        | Type                       | Défaut        | Description            |
| ----------- | -------------------------- | ------------- | ---------------------- |
| `href`      | `string`                   | —             | URL `wa.me/…` complète |
| `label`     | `string`                   | `"Commander"` | Texte du bouton        |
| `size`      | `"sm"` \| `"md"` \| `"lg"` | `"md"`        | Taille                 |
| `fullWidth` | `boolean`                  | `false`       | Prend toute la largeur |

---

#### `WhatsAppCTA`

**Fichier :** `components/ui/WhatsAppCTA.tsx`
**Type :** Client Component (`"use client"`)

Bouton flottant fixe. Positionné en bas à droite. Sur mobile, il monte au-dessus de la `BottomNav` (`bottom: 74px` au lieu de `bottom: 24px`).

---

#### `LogoSafe`

**Fichier :** `components/ui/LogoSafe.tsx`
**Type :** Client Component (`"use client"`)

Tente d'afficher le logo via `next/image`. Si le fichier est absent ou si le chargement échoue (erreur 404), bascule automatiquement sur un logo typographique :

```
MICROLOGIS
INFORMATIQUE & GSM
```

Le `M` de MICRO est en bleu `#1B5EC2` et LOGIS en anthracite `#1E2D40`.

---

## 8. Référence des hooks

### `useSearch`

**Fichier :** `hooks/useSearch.ts`

Encapsule toute la logique de recherche live.

```ts
const { query, results, isOpen, handleQuery, close } = useSearch(products);
```

| Retour        | Type                    | Description                           |
| ------------- | ----------------------- | ------------------------------------- |
| `query`       | `string`                | Valeur courante du champ de recherche |
| `results`     | `Product[]`             | Résultats Fuse.js (max 8)             |
| `isOpen`      | `boolean`               | Vrai quand le dropdown est visible    |
| `handleQuery` | `(val: string) => void` | À brancher sur `onChange` de l'input  |
| `close`       | `() => void`            | Ferme le dropdown et réinitialise     |

**Comportement :**

- Déclenche la recherche si `query.length >= 2`
- Debounce de **150ms** pour éviter les appels excessifs
- Ferme le dropdown avec la touche **Échap**

---

### `useFilters`

**Fichier :** `hooks/useFilters.ts`

Gère les filtres et les synchronise avec les paramètres d'URL. Permet le partage et le rechargement d'une URL filtrée.

```ts
const { filters, applyFilters, resetFilters, activeCount } =
  useFilters(maxPrice);
```

**Paramètres URL utilisés :**

| Paramètre   | Exemple          | Description                                          |
| ----------- | ---------------- | ---------------------------------------------------- |
| `sub`       | `?sub=HP,Dell`   | Sous-catégories sélectionnées (séparées par virgule) |
| `condition` | `?condition=new` | État du produit                                      |
| `min`       | `?min=50000`     | Prix minimum                                         |
| `max`       | `?max=300000`    | Prix maximum                                         |

---

### `useMobileMenu`

**Fichier :** `hooks/useMobileMenu.ts`

Gère l'état du drawer mobile.

```ts
const { isOpen, open, close, toggle } = useMobileMenu();
```

**Effets secondaires :**

- Bloque le scroll du `body` quand `isOpen === true` (via `document.body.style.overflow`)
- Ferme le drawer avec la touche **Échap**

---

## 9. Référence des fonctions utilitaires

### `lib/products.ts` — Accès aux données

| Fonction                             | Paramètres                 | Retour                  | Description                                                  |
| ------------------------------------ | -------------------------- | ----------------------- | ------------------------------------------------------------ |
| `getConfig()`                        | —                          | `StoreConfig`           | Retourne la config boutique                                  |
| `getCategories()`                    | —                          | `Category[]`            | Retourne toutes les catégories                               |
| `getCategoryBySlug(slug)`            | `string`                   | `Category \| undefined` | Trouve une catégorie par son slug URL                        |
| `getProducts()`                      | —                          | `Product[]`             | Retourne tous les produits                                   |
| `getProductsByCategory(id)`          | `string`                   | `Product[]`             | Retourne les produits d'une catégorie                        |
| `getFeaturedProducts()`              | —                          | `Product[]`             | Retourne les produits avec `featured: true`                  |
| `getProductBySlug(slug)`             | `string`                   | `Product \| undefined`  | Trouve un produit par son slug                               |
| `getRelatedProducts(product, limit)` | `Product`, `number`        | `Product[]`             | Produits de la même catégorie                                |
| `getPriceRange(products)`            | `Product[]`                | `[number, number]`      | Prix min et max d'une liste                                  |
| `filterProducts(products, opts)`     | `Product[]`, `FilterState` | `Product[]`             | Applique les filtres                                         |
| `sortProducts(products, sort)`       | `Product[]`, `string`      | `Product[]`             | Trie les produits                                            |
| `getAllSlugs()`                      | —                          | `string[]`              | Slugs de toutes les catégories (pour `generateStaticParams`) |

---

### `lib/utils.ts` — Helpers généraux

| Fonction                     | Description                                                             | Exemple                                  |
| ---------------------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| `cn(...classes)`             | Fusionne des classes Tailwind (clsx + tailwind-merge)                   | `cn("text-sm", isActive && "font-bold")` |
| `formatPrice(price, config)` | Formate en FCFA avec séparateurs. Retourne "Prix sur demande" si `null` | `"320 000 F"`                            |
| `formatPriceCompact(price)`  | Version courte pour les espaces réduits                                 | `"320 k F"`                              |
| `slugify(text)`              | Transforme un texte en slug URL                                         | `"HP ProBook" → "hp-probook"`            |
| `conditionLabel(condition)`  | Traduit la valeur en libellé français                                   | `"new" → "Neuf"`                         |
| `conditionColor(condition)`  | Retourne les classes Tailwind pour la couleur                           | `"bg-brand-blue text-white"`             |

---

### `lib/whatsapp.ts` — Génération de liens

| Fonction                                  | Description                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `buildProductLink(product, config)`       | Lien `wa.me` avec le `whatsapp_message` du produit (ou message générique si `null`) |
| `buildGenericLink(config, message?)`      | Lien `wa.me` avec le `whatsapp_message_generic` ou un message personnalisé          |
| `buildCategoryLink(categoryName, config)` | Lien `wa.me` pour demander des informations sur une catégorie                       |

---

### `lib/search.ts` — Configuration Fuse.js

La recherche floue indexe chaque produit sur 4 champs avec des poids différents :

| Champ         | Poids | Explication                                    |
| ------------- | ----- | ---------------------------------------------- |
| `name`        | 0.4   | Le nom est le critère le plus important        |
| `tags`        | 0.3   | Les tags permettent de trouver des synonymes   |
| `subcategory` | 0.2   | La marque est un critère secondaire            |
| `specs`       | 0.1   | Les specs sont indexées mais avec peu de poids |

**Seuil de tolérance (`threshold`) : 0.35** — Une valeur de 0 signifie correspondance exacte, 1 signifie tout accepter. 0.35 est un bon équilibre pour les fautes de frappe mineures.

---

## 10. Système de design et palette couleurs

### 10.1 Palette de marque (extraite du logo MICROLOGIS)

| Token Tailwind       | Valeur hexadécimale | Usage                                                          |
| -------------------- | ------------------- | -------------------------------------------------------------- |
| `brand-blue`         | `#1B5EC2`           | Couleur principale : texte "MICRO", liens, boutons, prix       |
| `brand-blue-light`   | `#2C6BAC`           | Accents secondaires, icônes, hover des cartes                  |
| `brand-blue-pale`    | `#EBF2FB`           | Fonds au survol, fond de la mega menu header                   |
| `brand-orange`       | `#E85D1A`           | Texte "accent", badges occasion, CTA secondaires, hover navbar |
| `brand-orange-light` | `#FDF0EA`           | Fonds légers orange                                            |
| `brand-dark`         | `#1E2D40`           | Texte "LOGIS", navbar, header dark, texte principal            |
| `brand-dark-mid`     | `#2D3F55`           | Texte secondaire sur fonds sombres                             |
| `whatsapp`           | `#25D366`           | Tous les éléments liés à WhatsApp                              |

### 10.2 Utilisation dans les classes Tailwind

```tsx
// Bleu principal
className = "text-brand-blue bg-brand-blue-pale border-brand-blue";

// Orange accent
className = "text-brand-orange bg-brand-orange-light";

// Fond sombre (navbar, footer)
className = "bg-brand-dark text-white";

// WhatsApp
className = "bg-whatsapp text-white";
```

### 10.3 Polices

| Variable    | Police      | Usage                               | Poids utilisés |
| ----------- | ----------- | ----------------------------------- | -------------- |
| `font-head` | **Syne**    | Titres, logos, boutons importants   | 600, 700, 800  |
| `font-body` | **DM Sans** | Corps de texte, specs, descriptions | 400, 500, 600  |

Les polices sont chargées via Google Fonts dans `globals.css`.

### 10.4 Border radius

| Token              | Valeur | Usage                                |
| ------------------ | ------ | ------------------------------------ |
| `rounded-brand`    | `10px` | Cartes produits, mega menu, sections |
| `rounded-brand-sm` | `6px`  | Boutons, inputs, badges              |

### 10.5 Ombres

| Token                | Description                                  |
| -------------------- | -------------------------------------------- |
| `shadow-brand`       | Ombre légère pour les cartes au repos        |
| `shadow-brand-hover` | Ombre plus marquée pour les cartes au survol |

### 10.6 Breakpoints responsive

| Breakpoint Tailwind | Largeur  | Comportement principal                           |
| ------------------- | -------- | ------------------------------------------------ |
| (défaut)            | < 640px  | Mobile : 2 colonnes, BottomNav visible           |
| `sm:`               | ≥ 640px  | SearchBar apparaît dans le Header                |
| `md:`               | ≥ 768px  | TopBar, navbar, bouton WA desktop visibles       |
| `lg:`               | ≥ 1024px | FilterSidebar desktop visible, grille 4 colonnes |
| `xl:`               | ≥ 1280px | Grille 4 colonnes sur la page catégorie          |

---

## 11. Pages et routing

| URL                          | Fichier                | Type   | Description                 |
| ---------------------------- | ---------------------- | ------ | --------------------------- |
| `/`                          | `app/page.tsx`         | Static | Page d'accueil              |
| `/ordinateurs`               | `app/[slug]/page.tsx`  | SSG    | Catégorie Ordinateurs       |
| `/telephones`                | `app/[slug]/page.tsx`  | SSG    | Catégorie Téléphones        |
| `/tablettes`                 | `app/[slug]/page.tsx`  | SSG    | Catégorie Tablettes         |
| `/accessoires-gsm`           | `app/[slug]/page.tsx`  | SSG    | Catégorie Accessoires GSM   |
| `/accessoires-informatiques` | `app/[slug]/page.tsx`  | SSG    | Catégorie Accessoires Info. |
| `/services`                  | `app/[slug]/page.tsx`  | SSG    | Catégorie Services          |
| `/contact`                   | `app/contact/page.tsx` | Static | Page contact & localisation |
| `/*` (non trouvé)            | `app/not-found.tsx`    | Static | Page 404                    |

**SSG** = Static Site Generation : la page est pré-rendue au moment du `npm run build` et servie comme fichier HTML statique.

### Paramètres d'URL des pages catégories

```
/ordinateurs?sub=HP&condition=new&max=300000
```

| Paramètre   | Description                                        |
| ----------- | -------------------------------------------------- |
| `sub`       | Filtre par sous-catégorie(s), séparées par virgule |
| `condition` | `new` ou `occasion`                                |
| `min`       | Prix minimum en FCFA                               |
| `max`       | Prix maximum en FCFA                               |

---

## 12. Gestion du contenu — guide pratique

### 12.1 Ajouter un nouveau produit

Ouvrir `public/data/products.json` et ajouter un objet dans le tableau `products` :

```json
{
  "id": "pc-005",
  "name": "HP EliteBook 840 G6 — Core i7 / 16Go / SSD 512Go",
  "slug": "hp-elitebook-840-g6-i7-16go",
  "category_id": "ordinateurs",
  "subcategory": "HP",
  "description": "HP EliteBook 840 G6, processeur Intel Core i7-8665U vPro, 16 Go RAM DDR4, SSD 512 Go NVMe. PC professionnel ultra-fiable avec capteur d'empreinte et port USB-C Thunderbolt 3.",
  "specs": "i7-8665U · 16 Go RAM · 512 Go NVMe · 14\" FHD · Windows 10 Pro",
  "price": 250000,
  "price_original": null,
  "condition": "occasion",
  "in_stock": true,
  "images": ["/images/ordinateurs/hp-elitebook-840-g6.jpg"],
  "whatsapp_message": "Bonjour MICROLOGIS, je suis intéressé(e) par le HP EliteBook 840 G6 i7 (250 000 F). Est-il disponible ?",
  "featured": false,
  "tags": [
    "HP",
    "ordinateur",
    "portable",
    "i7",
    "EliteBook",
    "occasion",
    "professionnel"
  ]
}
```

> ⚠️ L'`id` doit être unique dans tout le fichier. Le `slug` doit être unique et sans espaces ni accents.

### 12.2 Modifier le prix d'un produit

Dans `products.json`, trouver le produit par son `id` et modifier `price` :

```json
"price": 295000
```

Pour ajouter une promotion, remplir aussi `price_original` avec l'ancien prix :

```json
"price": 270000,
"price_original": 295000
```

### 12.3 Marquer un produit comme rupture de stock

```json
"in_stock": false
```

Un badge rouge "Rupture" apparaîtra sur la carte produit.

### 12.4 Mettre un produit en vedette sur la page d'accueil

```json
"featured": true
```

Le produit apparaîtra dans la section "Produits en vedette" de la page d'accueil. Il n'y a pas de limite de nombre imposée, mais idéalement 8 produits maximum pour la lisibilité.

### 12.5 Ajouter une nouvelle sous-catégorie

Par exemple, ajouter "Teclast" aux téléphones :

1. Trouver la catégorie `telephones` dans `categories`
2. Ajouter `"Teclast"` dans son tableau `subcategories`
3. Créer des produits avec `"subcategory": "Teclast"`

La nouvelle sous-catégorie apparaît automatiquement dans les filtres et le mega menu.

### 12.6 Modifier les horaires

Dans le bloc `config.hours` :

```json
"hours": {
  "Lundi–Vendredi": "08h00 – 20h00",
  "Samedi": "08h00 – 19h00",
  "Dimanche": "09h00 – 13h00"
}
```

Les horaires sont affichés dans la TopBar, le Footer et la page Contact.

### 12.7 Changer le numéro WhatsApp

Dans `config` :

```json
"whatsapp_number": "+22999999999",
"phone": "+22999999999"
```

> Le numéro doit inclure l'indicatif pays (`+229` pour le Bénin). Les caractères non numériques sont supprimés automatiquement lors de la génération des liens `wa.me`.

### 12.8 Ajouter une image produit

1. Copier l'image dans le bon dossier sous `public/images/`
2. Mettre à jour le champ `images` dans `products.json` :

```json
"images": ["/images/ordinateurs/nom-du-fichier.jpg"]
```

Formats recommandés : `.jpg` ou `.webp`. Dimensions conseillées : **800×600px** minimum, ratio **4:3**. Poids conseillé : moins de 200 Ko par image.

---

## 13. Déploiement sur Vercel

Vercel est la plateforme recommandée — elle est créée par l'équipe de Next.js et supporte nativement toutes ses fonctionnalités.

### 13.1 Déploiement depuis GitHub (recommandé)

```bash
# Initialiser le dépôt Git
git init
git add .
git commit -m "feat: init site vitrine micrologis"

# Créer le dépôt sur GitHub puis lier
git remote add origin https://github.com/votre-compte/micrologis-vitrine.git
git branch -M main
git push -u origin main
```

Sur [vercel.com](https://vercel.com) :

1. Cliquer **"Add New Project"**
2. Importer le dépôt GitHub `micrologis-vitrine`
3. Framework auto-détecté : **Next.js** ✅
4. Cliquer **Deploy**

Le site sera en ligne en ~2 minutes à une URL du type `https://micrologis-vitrine.vercel.app`.

### 13.2 Déploiement via CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 13.3 Redéploiement après modification du contenu

Après chaque modification de `products.json`, il faut redéployer pour que les changements soient visibles en production :

```bash
git add public/data/products.json
git commit -m "chore: mise à jour produits"
git push
```

Vercel redéploie automatiquement à chaque `push` sur la branche `main`.

---

## 14. Variables d'environnement

Ce projet **ne nécessite aucune variable d'environnement** dans sa version actuelle. Toute la configuration est dans `public/data/products.json`.

Si vous ajoutez ultérieurement un service externe (email, analytics, CMS), créez un fichier `.env.local` à la racine :

```env
# Exemple pour une future intégration
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxx
```

Les variables préfixées `NEXT_PUBLIC_` sont accessibles côté client. Les autres sont réservées au serveur.

---

## 15. Scripts disponibles

| Commande        | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| `npm run dev`   | Lance le serveur de développement sur `http://localhost:3000` avec hot-reload |
| `npm run build` | Compile le projet pour la production, génère les pages statiques              |
| `npm run start` | Lance le serveur de production (nécessite d'avoir fait `build` avant)         |
| `npm run lint`  | Vérifie le code avec ESLint (règles Next.js + TypeScript)                     |

---

## 16. Dépendances expliquées

### Dépendances de production

| Package                      | Version | Rôle                                                                             |
| ---------------------------- | ------- | -------------------------------------------------------------------------------- |
| `next`                       | 14.2.35 | Framework React avec App Router, rendu serveur, optimisation images              |
| `react` + `react-dom`        | 18.x    | Bibliothèque UI de base                                                          |
| `fuse.js`                    | 7.3.0   | Moteur de recherche floue (fuzzy search) côté client                             |
| `lucide-react`               | 1.17.0  | Bibliothèque d'icônes SVG (Laptop, Smartphone, MessageCircle…)                   |
| `clsx`                       | 2.1.1   | Utilitaire de composition de classes CSS conditionnelles                         |
| `tailwind-merge`             | 3.6.0   | Résolution des conflits de classes Tailwind (évite `text-sm text-base` dupliqué) |
| `class-variance-authority`   | 0.7.1   | Création de variantes de composants (utilisable pour les futures extensions)     |
| `yet-another-react-lightbox` | 3.32.0  | Galerie d'images en plein écran (disponible pour la future page produit)         |

### Dépendances de développement

| Package                                           | Version       | Rôle                                         |
| ------------------------------------------------- | ------------- | -------------------------------------------- |
| `typescript`                                      | 5.x           | Typage statique du code JavaScript           |
| `tailwindcss`                                     | 3.4.1         | Framework CSS utilitaire                     |
| `postcss`                                         | 8.x           | Traitement CSS (requis par Tailwind)         |
| `eslint` + `eslint-config-next`                   | 8.x / 14.2.35 | Vérification qualité du code                 |
| `@types/node`, `@types/react`, `@types/react-dom` | 20.x / 18.x   | Définitions TypeScript pour Node.js et React |

---

## 17. Évolutions recommandées

Ces fonctionnalités ne sont pas encore implémentées mais le projet est structuré pour les accueillir facilement.

### Page produit individuelle

Créer `app/produit/[slug]/page.tsx` en utilisant `getProductBySlug(slug)` et `getRelatedProducts(product)` qui existent déjà dans `lib/products.ts`. La galerie d'images peut utiliser `yet-another-react-lightbox` déjà installé.

### Panier de commande WhatsApp

Ajouter un hook `useCart` (liste de produits sélectionnés en `localStorage`) et un bouton "Ajouter au panier" sur chaque carte. Au moment de la commande, générer un message WhatsApp récapitulatif avec tous les produits et leurs prix.

### Formulaire de contact

La page `/contact` est prête à accueillir un formulaire. Utiliser **Resend** ou **EmailJS** pour l'envoi d'emails sans backend.

### Système de stock en temps réel

Remplacer le JSON statique par un CMS headless comme **Sanity** ou **Contentful**, ou une feuille Google Sheets via l'API, pour mettre à jour les stocks sans redéploiement.

### Internationalisation

Si le site doit fonctionner en français et en autre langue, Next.js 14 supporte l'i18n nativement via `next.config.mjs`.
