CREATE TYPE public.staff_type AS ENUM ('professor', 'funcionario');

CREATE TABLE public.equipe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo public.staff_type NOT NULL,
  cpf text,
  email text,
  telefone text,
  cargo text,
  formacao text,
  ativo boolean NOT NULL DEFAULT true,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipe TO authenticated;
GRANT ALL ON public.equipe TO service_role;
ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe visualiza colaboradores" ON public.equipe FOR SELECT TO authenticated USING (private.is_school_staff(auth.uid()));
CREATE POLICY "Administração gerencia colaboradores" ON public.equipe FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Administração atualiza colaboradores" ON public.equipe FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'funcionario')) WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'funcionario'));
CREATE POLICY "Administração remove colaboradores" ON public.equipe FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER equipe_updated BEFORE UPDATE ON public.equipe FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX equipe_nome_idx ON public.equipe(nome);