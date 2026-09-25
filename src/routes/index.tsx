import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, FileText, GraduationCap, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Escola Viva — Gestão escolar completa" },
    { name: "description", content: "Gestão de alunos, equipe, notas, faltas, documentos e comunicação escolar." },
    { property: "og:title", content: "Escola Viva — Gestão escolar completa" },
    { property: "og:description", content: "Uma gestão escolar organizada, segura e próxima das famílias." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const features=[[Users,"Cadastros integrados","Alunos, responsáveis e toda a equipe escolar."],[BookOpenCheck,"Diário escolar","Notas e frequência organizadas por aluno."],[FileText,"Documentos oficiais","Históricos, convocações e declarações prontas para imprimir."],[MessageCircle,"Famílias mais próximas","Comunicados de comparecimento enviados pelo WhatsApp."]] as const;
  return <main className="min-h-screen bg-background"><header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="size-5"/></span><b className="font-display text-xl">Escola Viva</b></div><Button asChild><Link to="/auth">Acessar sistema <ArrowRight/></Link></Button></header><section className="relative overflow-hidden border-y bg-primary text-primary-foreground"><div className="absolute inset-0 school-pattern opacity-15"/><div className="relative mx-auto grid min-h-[610px] max-w-7xl content-center px-5 py-20 md:px-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">Gestão escolar integrada</p><h1 className="font-display mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] md:text-7xl">A escola inteira, organizada para ensinar melhor.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/75">Cadastros, aprendizagem, documentos e comunicação com as famílias em uma experiência simples e segura.</p><Button asChild size="lg" variant="secondary" className="mt-9 w-fit"><Link to="/auth">Começar agora <ArrowRight/></Link></Button></div></section><section className="mx-auto max-w-7xl px-5 py-16 md:px-8"><div className="grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 xl:grid-cols-4">{features.map(([Icon,title,text])=><article key={title} className="bg-card p-7"><Icon className="size-6 text-primary"/><h2 className="font-display mt-8 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></section></main>;
}
