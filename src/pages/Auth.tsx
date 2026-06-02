import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(200),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    const creds = { email: parsed.data.email as string, password: parsed.data.password as string };
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword(creds)
        : await supabase.auth.signUp({
            ...creds,
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
    <div className="min-h-screen bg-hero-gradient text-secondary-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo card */}
        <a href="/" className="flex flex-col items-center gap-3 mb-6 group">
          <div className="w-24 h-24 rounded-2xl bg-dark-card border border-primary/20 flex items-center justify-center shadow-glow group-hover:border-primary/50 transition-colors">
            <img src={logo} alt="Tudo Certo Engenharia" className="w-16 h-16 object-contain" />
          </div>
          <span className="font-display text-xl tracking-[0.2em] text-secondary-foreground/90">
            TUDO <span className="text-primary">CERTO</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-secondary-foreground/40">
            Engenharia · Steel Frame
          </span>
        </a>

        <div className="bg-dark-card/80 backdrop-blur-xl rounded-2xl p-8 border border-secondary-foreground/10 shadow-glow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-primary" />
            <h1 className="font-display text-2xl text-center">
              {mode === "login" ? "Área restrita" : "Criar conta"}
            </h1>
          </div>
          <p className="text-sm text-secondary-foreground/60 text-center mb-6">
            {mode === "login"
              ? "Acesse o painel de gestão de leads"
              : "Solicite acesso ao painel administrativo"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-secondary-foreground/60 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-secondary-foreground/60 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-dark-bg border border-secondary-foreground/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-foreground/60 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : mode === "login" ? "Entrar no painel" : "Criar conta"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-secondary-foreground/10" />
            <span className="text-[10px] uppercase tracking-widest text-secondary-foreground/40">ou</span>
            <div className="h-px flex-1 bg-secondary-foreground/10" />
          </div>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
          >
            {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        </div>

        <p className="text-center text-xs text-secondary-foreground/40 mt-6">
          © {new Date().getFullYear()} Tudo Certo Engenharia
        </p>
      </div>
    </div>
  );
};

export default Auth;
