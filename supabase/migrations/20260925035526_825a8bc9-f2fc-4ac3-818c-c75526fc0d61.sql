CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_school_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;
REVOKE ALL ON FUNCTION private.is_school_staff(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_school_staff(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE assigned_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, nome) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)));
  SELECT CASE WHEN EXISTS (SELECT 1 FROM public.user_roles) THEN 'funcionario'::public.app_role ELSE 'admin'::public.app_role END INTO assigned_role;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.handle_new_user() TO service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

DROP POLICY "Equipe gerencia responsáveis" ON public.responsaveis;
CREATE POLICY "Equipe gerencia responsáveis" ON public.responsaveis FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia alunos" ON public.alunos;
CREATE POLICY "Equipe gerencia alunos" ON public.alunos FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia anos letivos" ON public.anos_letivos;
CREATE POLICY "Equipe gerencia anos letivos" ON public.anos_letivos FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia séries" ON public.series;
CREATE POLICY "Equipe gerencia séries" ON public.series FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia disciplinas" ON public.disciplinas;
CREATE POLICY "Equipe gerencia disciplinas" ON public.disciplinas FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia turmas" ON public.turmas;
CREATE POLICY "Equipe gerencia turmas" ON public.turmas FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe gerencia matrículas" ON public.matriculas;
CREATE POLICY "Equipe gerencia matrículas" ON public.matriculas FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Equipe visualiza notas" ON public.notas;
CREATE POLICY "Equipe visualiza notas" ON public.notas FOR SELECT TO authenticated USING (private.is_school_staff(auth.uid()));
DROP POLICY "Docentes lançam notas" ON public.notas;
CREATE POLICY "Docentes lançam notas" ON public.notas FOR INSERT TO authenticated WITH CHECK (private.is_school_staff(auth.uid()) AND lancado_por = auth.uid());
DROP POLICY "Docentes alteram notas" ON public.notas;
CREATE POLICY "Docentes alteram notas" ON public.notas FOR UPDATE TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Administração remove notas" ON public.notas;
CREATE POLICY "Administração remove notas" ON public.notas FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY "Equipe visualiza faltas" ON public.faltas;
CREATE POLICY "Equipe visualiza faltas" ON public.faltas FOR SELECT TO authenticated USING (private.is_school_staff(auth.uid()));
DROP POLICY "Docentes lançam faltas" ON public.faltas;
CREATE POLICY "Docentes lançam faltas" ON public.faltas FOR INSERT TO authenticated WITH CHECK (private.is_school_staff(auth.uid()) AND lancado_por = auth.uid());
DROP POLICY "Docentes alteram faltas" ON public.faltas;
CREATE POLICY "Docentes alteram faltas" ON public.faltas FOR UPDATE TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()));
DROP POLICY "Administração remove faltas" ON public.faltas;
CREATE POLICY "Administração remove faltas" ON public.faltas FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY "Administração gerencia documentos" ON public.documentos;
CREATE POLICY "Administração gerencia documentos" ON public.documentos FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'funcionario')) WITH CHECK ((private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'funcionario')) AND emitido_por = auth.uid());
DROP POLICY "Equipe gerencia comunicados" ON public.comunicados;
CREATE POLICY "Equipe gerencia comunicados" ON public.comunicados FOR ALL TO authenticated USING (private.is_school_staff(auth.uid())) WITH CHECK (private.is_school_staff(auth.uid()) AND enviado_por = auth.uid());

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_school_staff(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.has_role(uuid, public.app_role);
DROP FUNCTION public.is_school_staff(uuid);
DROP FUNCTION public.handle_new_user();