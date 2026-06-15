# MICROLOGIS — Guide de mise en place et d'utilisation

## Table des matières

1. [Installation des dépendances](#1-installation)
2. [Configuration Supabase](#2-supabase)
3. [Variables d'environnement](#3-variables-denvironnement)
4. [Déploiement Vercel](#4-déploiement-vercel)
5. [Guide utilisateur admin](#5-guide-utilisateur)
6. [Récapitulatif des fichiers modifiés](#6-fichiers-modifiés)

---

## 1. Installation

Dans le dossier du projet :

```bash
npm install
```

Nouvelles dépendances ajoutées :

- `@supabase/supabase-js` — client Supabase
- `@supabase/ssr` — intégration Next.js App Router (cookies SSR)

---

## 2. Configuration Supabase

### 2.1 Créer un projet

1. Aller sur [supabase.com](https://supabase.com) → **New Project**
2. Choisir un nom (ex: `micrologis`), une région proche (Europe West)
3. Définir un mot de passe fort pour la base de données : micrologis@gmail.com
4. Attendre ~2 minutes que le projet soit prêt

### 2.2 Créer les tables (schéma SQL)

1. Dans le dashboard Supabase → **SQL Editor** → **New query**
2. Copier-coller intégralement le contenu de `supabase_schema.sql`
3. Cliquer **Run** (triangle vert)

Si tu vois `Success. No rows returned` → c'est bon.

### 2.3 Créer le bucket Storage

Le script SQL crée automatiquement le bucket `micrologis`.  
Pour vérifier : **Storage** → tu dois voir un bucket `micrologis` marqué **Public**.

Si le bucket n'apparaît pas, le créer manuellement :

1. **Storage** → **New Bucket**
2. Nom : `micrologis`
3. Cocher **Public bucket** → **Create bucket**

### 2.4 Créer le compte administrateur

> ⚠️ **L'inscription publique doit rester désactivée** (c'est le paramètre par défaut Supabase).

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Saisir l'email admin et un mot de passe fort (min. 12 caractères, majuscules, chiffres, symboles)
3. Cocher **Auto Confirm User** → **Create User**

C'est le seul compte qui peut accéder à `/admin`.

### 2.5 Désactiver l'inscription publique (sécurité)

1. **Authentication** → **Providers** → **Email**
2. Désactiver **Enable email signups** (ou laisser activé mais ne jamais exposer de formulaire d'inscription)

### 2.6 Récupérer les clés API

**Project Settings** → **API** :

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** (cliquer "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Variables d'environnement

### En local

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Ne jamais committer `.env.local` sur Git (il est dans `.gitignore`).

Tester en local :

```bash
npm run dev
```

---

## 4. Déploiement Vercel

### 4.1 Ajouter les variables d'environnement sur Vercel

1. Dashboard Vercel → ton projet `micrologis-vitrine`
2. **Settings** → **Environment Variables**
3. Ajouter les 3 variables :

| Nom                             | Valeur                    | Environnement       |
| ------------------------------- | ------------------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co` | All                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`                  | All                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJ...`                  | Production, Preview |

### 4.2 Déployer

```bash
git add .
git commit -m "feat: migration full-stack Supabase"
git push origin main
```

Vercel détecte le push et redéploie automatiquement.

### 4.3 Vérifier

- `https://micrologis.vercel.app` → site public
- `https://micrologis.vercel.app/admin/login` → interface admin

---

## 5. Guide utilisateur

### 5.1 Se connecter à l'administration

1. Aller sur `https://micrologis.vercel.app/admin/login`
2. Saisir l'email et le mot de passe créés à l'étape 2.4
3. Cliquer **Se connecter**

> En cas d'oubli du mot de passe : dashboard Supabase → **Authentication** → **Users** → cliquer sur l'utilisateur → **Send password reset**

---

### 5.2 Gérer les catégories

**Admin → Catégories**

Avant d'ajouter des produits, créer les catégories correspondant aux rayons de la boutique.

**Créer une catégorie :**

1. Cliquer **Nouvelle catégorie**
2. Remplir :
   - **Nom** : ex. `Ordinateurs portables`
   - **Nom court** (pour les menus) : ex. `Laptops`
   - **Icône Lucide** : nom exact depuis [lucide.dev](https://lucide.dev) — ex. `Laptop`, `Smartphone`, `Printer`, `Headphones`, `Camera`, `Cpu`
   - **Couleur texte / fond** : choisir dans le color picker ou saisir le code hex
   - **Ordre** : `0` s'affiche en premier
3. Cliquer **Enregistrer**

**Modifier / Supprimer :** icônes crayon et corbeille dans la liste.

---

### 5.3 Ajouter un produit

**Admin → Produits → Nouveau produit**

| Champ                       | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| **Nom**                     | Nom complet du produit                                         |
| **Slug**                    | Généré automatiquement — ne pas modifier sauf nécessité        |
| **Description**             | Texte complet affiché sur la fiche produit                     |
| **Spécifications**          | Résumé court (ex: `i5 · 8 Go RAM · 256 Go SSD`)                |
| **Message WhatsApp**        | Si vide, utilise le message générique des paramètres           |
| **Catégorie**               | Obligatoire pour que le produit apparaisse dans la bonne page  |
| **Sous-catégorie / Marque** | Ex: `HP`, `Samsung`, `Apple`                                   |
| **État**                    | Neuf / Occasion / Reconditionné                                |
| **Tags**                    | Mots-clés séparés par virgules — améliorent la recherche       |
| **Prix de vente**           | En FCFA, sans espaces                                          |
| **Prix barré**              | Ancien prix (si solde) — affiché barré à côté du prix actuel   |
| **Promotion**               | Activer pour afficher un badge PROMO avec prix réduit et dates |
| **En stock**                | Décocher si le produit n'est plus disponible                   |
| **Quantité**                | Optionnel — pour suivi interne                                 |
| **Publié**                  | Décocher = le produit n'est pas visible sur le site            |
| **Mis en avant**            | Apparaît dans la section "Produits vedettes" de l'accueil      |
| **Images**                  | Jusqu'à 5 photos — la première est l'image principale          |

Cliquer **Créer le produit** pour enregistrer.

---

### 5.4 Gérer les demandes de devis

**Admin → Devis**

Chaque fois qu'un visiteur remplit le formulaire "Demander un devis" sur une fiche produit, une demande apparaît ici.

**Filtres :** En attente / Traité / Annulé

**Actions disponibles :**

- Cliquer sur une demande pour voir les détails
- **Répondre par email** → ouvre ton client mail avec l'adresse du client
- **WhatsApp** → ouvre WhatsApp avec le numéro du client (si fourni)
- **Marquer traité** → la demande passe dans l'onglet "Traité"
- **Supprimer** → suppression définitive

---

### 5.5 Modérer les avis clients

**Admin → Avis clients**

Les visiteurs peuvent laisser des avis sur les fiches produits. Ils ne sont visibles sur le site que si tu les approuves.

- Onglet **En attente** : avis à traiter
- **Approuver** → l'avis apparaît sur le site
- **Supprimer** → suppression définitive

---

### 5.6 Gérer le blog

**Admin → Blog → Nouvel article**

| Champ                   | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| **Titre**               | Titre de l'article                                            |
| **Extrait**             | Résumé affiché dans la liste des articles                     |
| **Contenu**             | Corps de l'article en HTML (ex: `<p>Texte</p><h2>Titre</h2>`) |
| **Image de couverture** | Photo principale de l'article                                 |
| **Publier**             | Cocher pour rendre l'article visible sur `/blog`              |

---

### 5.7 Modifier les paramètres de la boutique

**Admin → Paramètres**

Modifier les informations affichées sur tout le site :

- Nom, slogan, coordonnées, WhatsApp, réseaux sociaux
- Horaires d'ouverture (affichés dans le footer et la page contact)
- Titre et sous-titre de la bannière principale

Cliquer **Enregistrer les paramètres** après chaque modification.

---

## 6. Fichiers modifiés

### Fichiers remplacés (contenu totalement réécrit)

| Fichier               | Changement                                                                            |
| --------------------- | ------------------------------------------------------------------------------------- |
| `types/index.ts`      | Ajout des types `Quote`, `Review`, `BlogPost`, `Setting` + rétrocompatibilité         |
| `lib/products.ts`     | Lecture Supabase au lieu de JSON statique — mêmes signatures de fonctions             |
| `lib/utils.ts`        | Ajout `getEffectivePrice`, `formatDate`, `truncate` — fonctions existantes conservées |
| `app/layout.tsx`      | Server Component async — `getConfig()` et `getCategories()` depuis Supabase           |
| `app/page.tsx`        | Server Component async — données depuis Supabase                                      |
| `app/[slug]/page.tsx` | Gère catégories ET produits — données depuis Supabase                                 |
| `next.config.mjs`     | Ajout domaine `*.supabase.co` pour `next/image`                                       |
| `package.json`        | Ajout `@supabase/supabase-js` et `@supabase/ssr`                                      |

### Nouveaux fichiers

| Fichier                                    | Description                            |
| ------------------------------------------ | -------------------------------------- |
| `supabase_schema.sql`                      | Schéma complet + RLS                   |
| `.env.example`                             | Template variables d'environnement     |
| `middleware.ts`                            | Protection des routes `/admin`         |
| `lib/supabase/client.ts`                   | Client navigateur                      |
| `lib/supabase/server.ts`                   | Client serveur + admin                 |
| `lib/auth.ts`                              | Helper `requireAuth()` pour API routes |
| `app/api/products/route.ts`                | GET produits publics                   |
| `app/api/quotes/route.ts`                  | POST devis public                      |
| `app/api/reviews/route.ts`                 | POST avis public                       |
| `app/api/contact/route.ts`                 | POST contact public                    |
| `app/api/admin/products/route.ts`          | GET + POST produits (admin)            |
| `app/api/admin/products/[id]/route.ts`     | GET + PUT + DELETE produit (admin)     |
| `app/api/admin/categories/route.ts`        | GET + POST catégories (admin)          |
| `app/api/admin/categories/[id]/route.ts`   | PUT + DELETE catégorie (admin)         |
| `app/api/admin/quotes/route.ts`            | GET devis (admin)                      |
| `app/api/admin/quotes/[id]/route.ts`       | PUT + DELETE devis (admin)             |
| `app/api/admin/reviews/route.ts`           | GET avis (admin)                       |
| `app/api/admin/reviews/[id]/route.ts`      | PUT + DELETE avis (admin)              |
| `app/api/admin/blog/route.ts`              | GET + POST articles (admin)            |
| `app/api/admin/blog/[id]/route.ts`         | GET + PUT + DELETE article (admin)     |
| `app/api/admin/settings/route.ts`          | GET + PUT paramètres (admin)           |
| `app/api/admin/upload/route.ts`            | POST + DELETE upload images            |
| `app/admin/layout.tsx`                     | Layout admin (sidebar + header)        |
| `app/admin/page.tsx`                       | Tableau de bord admin                  |
| `app/admin/login/page.tsx`                 | Page de connexion                      |
| `app/admin/products/page.tsx`              | Liste des produits                     |
| `app/admin/products/new/page.tsx`          | Formulaire création produit            |
| `app/admin/products/[id]/page.tsx`         | Formulaire édition produit             |
| `app/admin/categories/page.tsx`            | Gestion catégories                     |
| `app/admin/quotes/page.tsx`                | Liste des devis                        |
| `app/admin/reviews/page.tsx`               | Modération avis                        |
| `app/admin/blog/page.tsx`                  | Liste articles                         |
| `app/admin/blog/new/page.tsx`              | Création article                       |
| `app/admin/blog/[id]/page.tsx`             | Édition article                        |
| `app/admin/settings/page.tsx`              | Paramètres boutique                    |
| `app/blog/page.tsx`                        | Blog public (liste)                    |
| `app/blog/[slug]/page.tsx`                 | Blog public (détail)                   |
| `components/admin/LoginForm.tsx`           | Formulaire de connexion                |
| `components/admin/AdminSidebar.tsx`        | Sidebar de navigation admin            |
| `components/admin/AdminHeader.tsx`         | En-tête admin                          |
| `components/admin/ProductForm.tsx`         | Formulaire produit                     |
| `components/admin/CategoryManager.tsx`     | CRUD catégories                        |
| `components/admin/QuotesList.tsx`          | Gestion des devis                      |
| `components/admin/ReviewsManager.tsx`      | Modération avis                        |
| `components/admin/BlogForm.tsx`            | Formulaire article                     |
| `components/admin/SettingsForm.tsx`        | Formulaire paramètres                  |
| `components/admin/ImageUpload.tsx`         | Upload d'images                        |
| `components/admin/DeleteProductButton.tsx` | Suppression produit                    |
| `components/admin/DeleteBlogButton.tsx`    | Suppression article                    |
| `components/ui/QuoteForm.tsx`              | Formulaire devis public                |
| `components/ui/ReviewSection.tsx`          | Avis clients sur fiche produit         |
| `app/admin-globals.css`                    | Classes CSS utilitaires admin          |
