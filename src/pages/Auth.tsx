import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(200),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword(parsed.data)
        : await supabase.auth.signUp({
            ...parsed.data,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    if (mode === "signup") {
      toast({
        title: "Conta criada!",
        description: "Peça ao administrador para liberar acesso ao dashboard.",
      });
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-secondary-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-card rounded-2xl p-8 border border-secondary-foreground/10 shadow-glow">
        <a href="/" className="font-display text-2xl tracking-wider block text-center mb-6">
          TUDO <span className="text-primary">CERTO</span>
        </a>
        <h1 className="font-display text-3xl text-center mb-2">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-sm text-secondary-foreground/60 text-center mb-6">
          Acesso ao dashboard de leads
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-secondary-foreground/70 mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary-foreground/70 mb-2">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full mt-4 text-sm text-secondary-foreground/60 hover:text-primary transition-colors"
        >
          {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
