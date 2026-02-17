-- Run this in your Supabase SQL Editor

-- Countries Master
CREATE TABLE IF NOT EXISTS public.master_countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- States Master
CREATE TABLE IF NOT EXISTS public.master_states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_id UUID REFERENCES public.master_countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(country_id, name)
);

-- Cities Master
CREATE TABLE IF NOT EXISTS public.master_cities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_id UUID REFERENCES public.master_states(id) ON DELETE SET NULL,
    name TEXT NOT NULL UNIQUE, -- Assuming unique city names for simplicity, or constraint by state
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transporters Master
CREATE TABLE IF NOT EXISTS public.master_transporters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city_id UUID REFERENCES public.master_cities(id) ON DELETE SET NULL,
    gstin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
