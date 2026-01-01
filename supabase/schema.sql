-- FreightSnap Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with app data
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- DOCUMENTS TABLE
-- Stores uploaded PDF files metadata
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- ============================================
-- FREIGHT_QUOTES TABLE
-- Extracted data from PDFs
-- ============================================
CREATE TABLE freight_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  
  -- Core quote data
  carrier TEXT,
  service_type TEXT,
  
  -- Route
  origin TEXT,
  origin_country TEXT,
  destination TEXT,
  destination_country TEXT,
  
  -- Cargo details
  weight DECIMAL(10, 2),
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
  dimensions TEXT, -- e.g., "120x80x100 cm"
  cargo_type TEXT, -- e.g., "Palletized", "Container"
  
  -- Pricing
  base_price DECIMAL(12, 2),
  fuel_surcharge DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  
  -- Timing
  transit_days INTEGER,
  quote_date DATE,
  valid_until DATE,
  
  -- Raw AI extraction for debugging
  raw_data JSONB,
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_freight_quotes_document_id ON freight_quotes(document_id);
CREATE INDEX idx_freight_quotes_carrier ON freight_quotes(carrier);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE freight_quotes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Documents: Users can only access their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Freight Quotes: Access through document ownership
CREATE POLICY "Users can view own quotes" ON freight_quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = freight_quotes.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quotes" ON freight_quotes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = freight_quotes.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own quotes" ON freight_quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = freight_quotes.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quotes" ON freight_quotes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = freight_quotes.document_id 
      AND documents.user_id = auth.uid()
    )
  );
