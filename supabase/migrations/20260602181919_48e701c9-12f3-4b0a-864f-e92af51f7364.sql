
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;

DROP POLICY "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(nome) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(telefone) BETWEEN 5 AND 50
    AND char_length(cidade) BETWEEN 1 AND 200
  );
