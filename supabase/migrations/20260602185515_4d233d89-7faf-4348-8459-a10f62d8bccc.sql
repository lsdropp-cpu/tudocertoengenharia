ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS mensagem text;

ALTER POLICY "Anyone can submit a lead" ON public.leads
WITH CHECK (
  char_length(nome) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 200
  AND char_length(telefone) BETWEEN 5 AND 50
  AND char_length(cidade) BETWEEN 1 AND 200
  AND (mensagem IS NULL OR char_length(mensagem) <= 2000)
);