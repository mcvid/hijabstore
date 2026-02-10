-- Helper function to decrement stock safely
CREATE OR REPLACE FUNCTION public.decrement_variant_stock(row_id UUID, qty INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - qty
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
