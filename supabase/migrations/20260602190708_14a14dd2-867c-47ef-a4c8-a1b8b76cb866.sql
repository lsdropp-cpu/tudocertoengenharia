-- Add kanban stage column (separate from status to keep backward compat; default mirrors status)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estagio text NOT NULL DEFAULT 'novo';
UPDATE public.leads SET estagio = COALESCE(status, 'novo') WHERE estagio = 'novo';

-- Function: grant admin role to the first user signing up (or any new user while no admin exists)
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- Promote any existing user to admin if none exists yet
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
ORDER BY u.created_at
LIMIT 1
ON CONFLICT DO NOTHING;