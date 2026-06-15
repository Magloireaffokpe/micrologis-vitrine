-- ============================================================
-- MICROLOGIS INFORMATIQUE & GSM — Schéma Supabase complet
-- À exécuter dans l'éditeur SQL de Supabase (dashboard > SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 2. TABLE : settings (paramètres de la boutique)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT UNIQUE NOT NULL,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Valeurs par défaut
INSERT INTO settings (key, value) VALUES
  ('store_name',        'MICROLOGIS INFORMATIQUE & GSM'),
  ('whatsapp_number',   '+22997419851'),
  ('phone',             '+22997419851'),
  ('email',             'desiregbehon@gmail.com'),
  ('address',           'Parakou, BANIKANNI — le pavé...'),
  ('opening_hours',     'Lun–Sam : 08h–21h'),
  ('logo_path',         '/images/logo/logo.webp'),
  ('hero_title',        'Informatique & Téléphonie à Parakou'),
  ('hero_subtitle',     'Ordinateurs, smartphones, accessoires — prix imbattables'),
  ('hero_image',        '')
ON CONFLICT (key) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 3. TABLE : categories
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  image_url        TEXT,
  sort_order       INT DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  name_short       TEXT,
  icon             TEXT,
  color            TEXT,
  bg_color         TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  subcategories    TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. TABLE : products
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  specs           TEXT,
  price           NUMERIC(12, 0) NOT NULL DEFAULT 0,
  price_original  NUMERIC(12, 0),           -- Prix barré (avant promo)
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory     TEXT,
  condition       TEXT DEFAULT 'new' CHECK (condition IN ('new', 'occasion', 'reconditioned')),
  images          TEXT[] DEFAULT '{}',       -- Tableau d'URLs Supabase Storage
  in_stock        BOOLEAN DEFAULT TRUE,
  stock_qty       INT,
  is_active       BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  -- Promotion
  is_promo        BOOLEAN DEFAULT FALSE,
  price_promo     NUMERIC(12, 0),
  promo_start     TIMESTAMPTZ,
  promo_end       TIMESTAMPTZ,
  -- Tags
  tags            TEXT[] DEFAULT '{}',
  -- WhatsApp
  whatsapp_message TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

-- ────────────────────────────────────────────────────────────
-- 5. TABLE : quotes (demandes de devis)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,                         -- Snapshot du nom au moment de la demande
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'cancelled')),
  admin_note  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_product ON quotes(product_id);

-- ────────────────────────────────────────────────────────────
-- 6. TABLE : reviews (avis clients)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product  ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- ────────────────────────────────────────────────────────────
-- 7. TABLE : blog_posts (articles / actualités)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,                          -- HTML ou Markdown
  cover_image  TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug      ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published);

-- ────────────────────────────────────────────────────────────
-- 8. TABLE : contact_messages
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 9. FONCTION updated_at automatique
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables qui ont updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['settings', 'categories', 'products', 'quotes', 'blog_posts'] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
    ', t, t);
  END LOOP;
END $$;

-- ────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- Activer RLS sur toutes les tables
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ── settings ──────────────────────────────────────────────
-- Lecture publique pour les clés non sensibles
CREATE POLICY "settings_read_public" ON settings
  FOR SELECT USING (true);

-- Écriture uniquement par un utilisateur authentifié (admin)
CREATE POLICY "settings_write_admin" ON settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── categories ────────────────────────────────────────────
CREATE POLICY "categories_read_active" ON categories
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "categories_write_admin" ON categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── products ──────────────────────────────────────────────
CREATE POLICY "products_read_active" ON products
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "products_write_admin" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── quotes ────────────────────────────────────────────────
-- Le public peut INSÉRER (formulaire devis)
CREATE POLICY "quotes_insert_public" ON quotes
  FOR INSERT WITH CHECK (true);

-- Seul l'admin peut lire et modifier
CREATE POLICY "quotes_read_admin" ON quotes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "quotes_update_admin" ON quotes
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "quotes_delete_admin" ON quotes
  FOR DELETE USING (auth.role() = 'authenticated');

-- ── reviews ───────────────────────────────────────────────
-- Le public peut lire les avis approuvés
CREATE POLICY "reviews_read_approved" ON reviews
  FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

-- Le public peut insérer un avis
CREATE POLICY "reviews_insert_public" ON reviews
  FOR INSERT WITH CHECK (true);

-- L'admin peut tout faire
CREATE POLICY "reviews_admin" ON reviews
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── blog_posts ────────────────────────────────────────────
CREATE POLICY "blog_read_published" ON blog_posts
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "blog_write_admin" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── contact_messages ──────────────────────────────────────
CREATE POLICY "contact_insert_public" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_read_admin" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "contact_update_admin" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "contact_delete_admin" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────
-- 11. STORAGE BUCKET
-- ────────────────────────────────────────────────────────────
-- À exécuter DANS Supabase Dashboard > Storage > New Bucket
-- OU via SQL comme ci-dessous :

INSERT INTO storage.buckets (id, name, public)
VALUES ('micrologis', 'micrologis', true)
ON CONFLICT (id) DO NOTHING;

-- Politique storage : lecture publique
CREATE POLICY "storage_read_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'micrologis');

-- Politique storage : écriture admin uniquement
CREATE POLICY "storage_write_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'micrologis' AND auth.role() = 'authenticated'
  );

CREATE POLICY "storage_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'micrologis' AND auth.role() = 'authenticated'
  );

CREATE POLICY "storage_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'micrologis' AND auth.role() = 'authenticated'
  );

-- ────────────────────────────────────────────────────────────
-- FIN DU SCRIPT
-- ────────────────────────────────────────────────────────────
