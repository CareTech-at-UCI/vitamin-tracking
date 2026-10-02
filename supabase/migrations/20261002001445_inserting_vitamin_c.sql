INSERT INTO public.nutrients (name, symbol, unit)
VALUES ('Vitamin C', 'C', 'mg')
ON CONFLICT (symbol) DO NOTHING;