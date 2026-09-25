import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({ head: () => ({ meta: [
  { title: "Redefinir senha — Escola Viva" }, { name: "description", content: "Redefina sua senha de acesso à Escola Viva." },
  { property: "og:title", content: "Redefinir senha — Escola Viva" }, { property: "og:description", content: "Redefina sua senha de acesso." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
] }), component: ResetPassword });
function ResetPassword(){ const navigate=useNavigate(); const [password,setPassword]=useState(""); async function submit(e:React.FormEvent){e.preventDefault(); const {error}=await supabase.auth.updateUser({password}); if(error) return toast.error(error.message); toast.success("Senha atualizada."); navigate({to:"/dashboard"});} return <main className="grid min-h-screen place-items-center bg-muted/40 p-6"><form onSubmit={submit} className="w-full max-w-sm rounded-lg border bg-card p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold">Nova senha</h1><p className="mt-2 text-sm text-muted-foreground">Escolha uma senha segura para sua conta.</p><div className="mt-7 space-y-2"><Label htmlFor="new-password">Nova senha</Label><Input id="new-password" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></div><Button className="mt-6 w-full">Salvar nova senha</Button></form></main> }
