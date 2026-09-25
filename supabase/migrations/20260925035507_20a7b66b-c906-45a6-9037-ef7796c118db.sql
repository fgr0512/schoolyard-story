CREATE TYPE public.app_role AS ENUM ('admin', 'professor', 'funcionario');
CREATE TYPE public.enrollment_status AS ENUM ('cursando', 'aprovado', 'reprovado', 'transferido', 'concluido');
CREATE TYPE public.document_type AS ENUM ('historico', 'convocacao', 'declaracao_comparecimento');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  telefone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários autenticados visualizam perfis" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários atualizam o próprio perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários visualizam a própria função" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.is_school_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;
GRANT EXECUTE ON FUNCTION public.is_school_staff(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE assigned_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, nome) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)));
  SELECT CASE WHEN EXISTS (SELECT 1 FROM public.user_roles) THEN 'funcionario'::public.app_role ELSE 'admin'::public.app_role END INTO assigned_role;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.responsaveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf text,
  telefone text NOT NULL,
  email text,
  parentesco text NOT NULL,
  aceita_whatsapp boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.responsaveis TO authenticated;
GRANT ALL ON public.responsaveis TO service_role;
ALTER TABLE public.responsaveis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia responsáveis" ON public.responsaveis FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER responsaveis_updated BEFORE UPDATE ON public.responsaveis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula text NOT NULL UNIQUE,
  nome text NOT NULL,
  data_nascimento date NOT NULL,
  cpf text,
  endereco text,
  responsavel_id uuid REFERENCES public.responsaveis(id) ON DELETE SET NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alunos TO authenticated;
GRANT ALL ON public.alunos TO service_role;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia alunos" ON public.alunos FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER alunos_updated BEFORE UPDATE ON public.alunos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.anos_letivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), ano integer NOT NULL UNIQUE, inicio date NOT NULL, fim date NOT NULL, ativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.anos_letivos TO authenticated; GRANT ALL ON public.anos_letivos TO service_role;
ALTER TABLE public.anos_letivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia anos letivos" ON public.anos_letivos FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER anos_updated BEFORE UPDATE ON public.anos_letivos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nome text NOT NULL, ordem integer NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.series TO authenticated; GRANT ALL ON public.series TO service_role;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia séries" ON public.series FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER series_updated BEFORE UPDATE ON public.series FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.disciplinas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nome text NOT NULL UNIQUE, carga_horaria integer NOT NULL DEFAULT 40,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.disciplinas TO authenticated; GRANT ALL ON public.disciplinas TO service_role;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia disciplinas" ON public.disciplinas FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER disciplinas_updated BEFORE UPDATE ON public.disciplinas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.turmas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nome text NOT NULL, serie_id uuid NOT NULL REFERENCES public.series(id), ano_letivo_id uuid NOT NULL REFERENCES public.anos_letivos(id), turno text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(nome, ano_letivo_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.turmas TO authenticated; GRANT ALL ON public.turmas TO service_role;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia turmas" ON public.turmas FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER turmas_updated BEFORE UPDATE ON public.turmas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.matriculas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), aluno_id uuid NOT NULL REFERENCES public.alunos(id), turma_id uuid NOT NULL REFERENCES public.turmas(id), status public.enrollment_status NOT NULL DEFAULT 'cursando', data_matricula date NOT NULL DEFAULT CURRENT_DATE, media_final numeric(5,2), total_faltas integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(aluno_id, turma_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matriculas TO authenticated; GRANT ALL ON public.matriculas TO service_role;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia matrículas" ON public.matriculas FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE TRIGGER matriculas_updated BEFORE UPDATE ON public.matriculas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.notas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), matricula_id uuid NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE, disciplina_id uuid NOT NULL REFERENCES public.disciplinas(id), periodo integer NOT NULL CHECK (periodo BETWEEN 1 AND 4), nota numeric(4,2) NOT NULL CHECK (nota BETWEEN 0 AND 10), lancado_por uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(matricula_id, disciplina_id, periodo)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notas TO authenticated; GRANT ALL ON public.notas TO service_role;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe visualiza notas" ON public.notas FOR SELECT TO authenticated USING (public.is_school_staff(auth.uid()));
CREATE POLICY "Docentes lançam notas" ON public.notas FOR INSERT TO authenticated WITH CHECK (public.is_school_staff(auth.uid()) AND lancado_por = auth.uid());
CREATE POLICY "Docentes alteram notas" ON public.notas FOR UPDATE TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE POLICY "Administração remove notas" ON public.notas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER notas_updated BEFORE UPDATE ON public.notas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.faltas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), matricula_id uuid NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE, disciplina_id uuid NOT NULL REFERENCES public.disciplinas(id), data date NOT NULL, quantidade integer NOT NULL DEFAULT 1 CHECK (quantidade > 0), justificativa text, lancado_por uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faltas TO authenticated; GRANT ALL ON public.faltas TO service_role;
ALTER TABLE public.faltas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe visualiza faltas" ON public.faltas FOR SELECT TO authenticated USING (public.is_school_staff(auth.uid()));
CREATE POLICY "Docentes lançam faltas" ON public.faltas FOR INSERT TO authenticated WITH CHECK (public.is_school_staff(auth.uid()) AND lancado_por = auth.uid());
CREATE POLICY "Docentes alteram faltas" ON public.faltas FOR UPDATE TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()));
CREATE POLICY "Administração remove faltas" ON public.faltas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER faltas_updated BEFORE UPDATE ON public.faltas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tipo public.document_type NOT NULL, aluno_id uuid NOT NULL REFERENCES public.alunos(id), responsavel_id uuid REFERENCES public.responsaveis(id), motivo text NOT NULL, conteudo jsonb NOT NULL DEFAULT '{}'::jsonb, emitido_por uuid NOT NULL REFERENCES public.profiles(id), emitido_em timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos TO authenticated; GRANT ALL ON public.documentos TO service_role;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Administração gerencia documentos" ON public.documentos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'funcionario')) WITH CHECK ((public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'funcionario')) AND emitido_por = auth.uid());
CREATE TRIGGER documentos_updated BEFORE UPDATE ON public.documentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.comunicados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), aluno_id uuid NOT NULL REFERENCES public.alunos(id), responsavel_id uuid NOT NULL REFERENCES public.responsaveis(id), canal text NOT NULL DEFAULT 'whatsapp', mensagem text NOT NULL, status text NOT NULL DEFAULT 'preparado', enviado_por uuid NOT NULL REFERENCES public.profiles(id), enviado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comunicados TO authenticated; GRANT ALL ON public.comunicados TO service_role;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipe gerencia comunicados" ON public.comunicados FOR ALL TO authenticated USING (public.is_school_staff(auth.uid())) WITH CHECK (public.is_school_staff(auth.uid()) AND enviado_por = auth.uid());
CREATE TRIGGER comunicados_updated BEFORE UPDATE ON public.comunicados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX alunos_nome_idx ON public.alunos(nome);
CREATE INDEX matriculas_turma_idx ON public.matriculas(turma_id);
CREATE INDEX notas_matricula_idx ON public.notas(matricula_id);
CREATE INDEX faltas_matricula_idx ON public.faltas(matricula_id);
CREATE INDEX documentos_aluno_idx ON public.documentos(aluno_id);