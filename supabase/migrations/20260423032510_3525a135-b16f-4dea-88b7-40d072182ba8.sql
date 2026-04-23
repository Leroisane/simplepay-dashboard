-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Success',
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL,
  next_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Open policies (demo app, no auth)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Public insert schedules" ON public.schedules FOR INSERT WITH CHECK (true);

-- Seed data
INSERT INTO public.profiles (name, balance) VALUES ('Andi Pratama', 1250000);

INSERT INTO public.schedules (recipient, amount, frequency, next_date, status) VALUES
  ('PLN Listrik', 250000, 'Monthly', CURRENT_DATE + INTERVAL '3 days', 'Active'),
  ('Indihome', 350000, 'Monthly', CURRENT_DATE + INTERVAL '7 days', 'Active'),
  ('Spotify Premium', 54990, 'Monthly', CURRENT_DATE + INTERVAL '12 days', 'Active');

INSERT INTO public.transactions (type, amount, status, details) VALUES
  ('Transfer', 150000, 'Success', 'To: Budi Santoso - BCA'),
  ('Top Up', 500000, 'Success', 'From: BCA Virtual Account'),
  ('Payment', 75000, 'Success', 'Tokopedia Order');