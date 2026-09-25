import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Mail, LockKeyhole, UserRound, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Acesso — Escola Viva" },
    { name: "description", content: "Acesso seguro ao sistema de gestão escolar Escola Viva." },
    { property: "og:title", content: "Acesso — Escola Viva" },
    { property: "og:description", content: "Acesso seguro ao sistema de gestão escolar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true);
    if (mode === "cadastro") {
      const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome }, emailRedirectTo: window.location.origin } });
      setLoading(false);
      if (error) return toast.error(error.message);
      if (!data.session) return toast.success("Confira seu e-mail para confirmar o cadastro.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setLoading(false);
      if (error) return toast.error("E-mail ou senha incorretos.");
    }
    navigate({ to: "/dashboard" });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Não foi possível entrar com Google.");
    else if (!result.redirected) navigate({ to: "/dashboard" });
  }

  async function forgot() {
    if (!email) return toast.error("Digite seu e-mail primeiro.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message); else toast.success("Enviamos o link de recuperação por e-mail.");
  }

  return <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-primary p-14 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 school-pattern opacity-15" />
      <div className="relative flex items-center gap-3 text-lg font-semibold"><span className="grid size-11 place-items-center rounded-lg bg-primary-foreground/15"><GraduationCap /></span> Escola Viva</div>
      <div className="relative max-w-xl"><p className="mb-5 text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">Gestão que aproxima</p><h1 className="font-display text-5xl font-semibold leading-tight">Toda a vida escolar em um só lugar.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/75">Organize pessoas, acompanhe a aprendizagem e mantenha as famílias sempre por perto.</p></div>
      <p className="relative text-sm text-primary-foreground/60">Ambiente protegido para a equipe escolar</p>
    </section>
    <section className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-9 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><GraduationCap /></span><b>Escola Viva</b></div>
        <p className="text-sm font-semibold text-primary">{mode === "login" ? "Bem-vindo de volta" : "Primeiro acesso"}</p>
        <h2 className="font-display mt-2 text-4xl font-semibold">{mode === "login" ? "Acesse sua conta" : "Crie sua conta"}</h2>
        <p className="mt-3 text-muted-foreground">Use seu e-mail institucional para continuar.</p>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          {mode === "cadastro" && <div className="space-y-2"><Label htmlFor="nome">Nome completo</Label><div className="relative"><UserRound className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input id="nome" className="pl-10" value={nome} onChange={e=>setNome(e.target.value)} required /></div></div>}
          <div className="space-y-2"><Label htmlFor="email">E-mail</Label><div className="relative"><Mail className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input id="email" type="email" className="pl-10" value={email} onChange={e=>setEmail(e.target.value)} required /></div></div>
          <div className="space-y-2"><div className="flex justify-between"><Label htmlFor="senha">Senha</Label>{mode === "login" && <button type="button" onClick={forgot} className="text-xs font-medium text-primary hover:underline">Esqueci minha senha</button>}</div><div className="relative"><LockKeyhole className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input id="senha" type="password" minLength={6} className="pl-10" value={senha} onChange={e=>setSenha(e.target.value)} required /></div></div>
          <Button className="h-11 w-full gap-2" disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}<ArrowRight className="size-4"/></Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>ou<span className="h-px flex-1 bg-border"/></div>
        <Button variant="outline" className="h-11 w-full" onClick={google}>Continuar com Google</Button>
        <p className="mt-7 text-center text-sm text-muted-foreground">{mode === "login" ? "Ainda não tem acesso?" : "Já possui acesso?"} <button onClick={()=>setMode(mode === "login" ? "cadastro" : "login")} className="font-semibold text-primary hover:underline">{mode === "login" ? "Criar conta" : "Entrar"}</button></p>
        <Link to="/" className="mt-5 block text-center text-xs text-muted-foreground hover:text-foreground">Voltar ao início</Link>
      </div>
    </section>
  </main>;
}
