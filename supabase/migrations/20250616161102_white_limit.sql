/*
  # Disabilita conferma email per registrazione immediata

  1. Configurazione
    - Disabilita la conferma email obbligatoria
    - Permette agli utenti di registrarsi e accedere immediatamente
    - Mantiene la sicurezza base dell'autenticazione

  2. Note
    - Gli utenti potranno registrarsi e accedere senza confermare l'email
    - L'email sarà comunque validata per il formato
    - Questa configurazione è utile per sviluppo e testing
*/

-- Questa migrazione serve come documentazione
-- La configurazione effettiva deve essere fatta nel dashboard di Supabase:
-- 1. Vai su https://supabase.com/dashboard/project/oatjauerfxwykzihases
-- 2. Vai in Authentication > Settings
-- 3. Disabilita "Enable email confirmations"
-- 4. Salva le modificazioni

-- Alternativa: configurazione tramite SQL (se supportata)
-- UPDATE auth.config SET enable_signup = true, enable_confirmations = false WHERE id = 1;

-- Per ora creiamo una tabella di configurazione personalizzata per tracciare le impostazioni
CREATE TABLE IF NOT EXISTS public.app_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Inserisci configurazione per email confirmation disabilitata
INSERT INTO public.app_config (key, value) 
VALUES ('email_confirmation_disabled', '{"enabled": false, "reason": "Immediate registration without email confirmation"}')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();

-- Abilita RLS sulla tabella di configurazione
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Solo gli admin possono modificare la configurazione
CREATE POLICY "Only admins can manage app config" ON public.app_config
FOR ALL USING (false); -- Nessuno può accedere via RLS, solo tramite service role

-- Tutti possono leggere la configurazione pubblica
CREATE POLICY "Anyone can read public config" ON public.app_config
FOR SELECT USING (true);