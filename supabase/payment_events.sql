-- PAYMENT EVENTS LOGGING SCHEMA

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  event_type TEXT NOT NULL, -- 'payment_initiated', 'payment_succeeded', 'payment_failed', 'refunded', etc.
  provider TEXT NOT NULL, -- 'stripe', 'paypal', 'tabby', etc.
  raw_data JSONB, -- Full webhook payload or response metadata
  external_id TEXT, -- e.g., Stripe Payment Intent ID or PayPal Order ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by order
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_external_id ON public.payment_events(external_id);

-- RLS POLICIES
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all payment events (assuming service_role or admin role exists)
-- For now, let's allow users to see events related to their own orders if needed
CREATE POLICY "Users can view own payment events" ON public.payment_events FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
