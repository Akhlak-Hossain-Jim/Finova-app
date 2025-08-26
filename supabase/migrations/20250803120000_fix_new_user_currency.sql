CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, currency)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'USD');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;